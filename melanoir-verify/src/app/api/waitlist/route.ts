import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendSms } from '@/lib/sms'

const ALLOWED_ORIGINS = ['https://melanoir.co.kr', 'https://www.melanoir.co.kr']

function corsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get('origin') ?? ''
  const allowed = ALLOWED_ORIGINS.includes(origin) || origin.startsWith('http://localhost')
  return {
    'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) })
}

export async function POST(req: NextRequest) {
  const headers = corsHeaders(req)

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400, headers })
  }

  // 허니팟: 봇이 채운 경우 저장 없이 성공 응답
  if (body.website) {
    return NextResponse.json({ success: true }, { headers })
  }

  const type = body.type
  const phone = String(body.phone ?? '').replace(/-/g, '')

  if (type !== 'customer' && type !== 'pro' && type !== 'beta') {
    return NextResponse.json({ error: '유형을 선택해주세요.' }, { status: 400, headers })
  }
  const instagram = String(body.instagram ?? '').trim().replace(/^@/, '')
  if (type === 'beta' && !instagram) {
    return NextResponse.json({ error: '인스타그램 계정을 입력해주세요.' }, { status: 400, headers })
  }
  if (!/^01[0-9]{8,9}$/.test(phone)) {
    return NextResponse.json({ error: '유효하지 않은 전화번호입니다.' }, { status: 400, headers })
  }
  if (body.consent !== true) {
    return NextResponse.json({ error: '개인정보 수집·이용 동의가 필요합니다.' }, { status: 400, headers })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: existing } = await supabase
    .from('mnr_waitlist')
    .select('id')
    .eq('phone', phone)
    .eq('type', type)
    .maybeSingle()

  const { error } = await supabase.from('mnr_waitlist').upsert(
    {
      type,
      phone,
      name: body.name ? String(body.name).slice(0, 50) : null,
      shop_name: type !== 'customer' && body.shop_name ? String(body.shop_name).slice(0, 80) : null,
      instagram: type !== 'customer' && instagram ? instagram.slice(0, 80) : null,
      marketing_consent: true,
      source: body.source ? String(body.source).slice(0, 120) : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'phone,type' }
  )

  if (error) {
    console.error('[waitlist] upsert error:', error)
    return NextResponse.json({ error: '처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }, { status: 500, headers })
  }

  // 신규 신청에만 확인 SMS 발송 (중복 신청 시 재발송 방지)
  if (!existing) {
    const smsText = type === 'beta'
      ? '[멜라누아] 베타테스터 신청이 완료되었습니다. 선정 결과를 문자로 안내드릴게요.'
      : '[멜라누아] 출시 알림 신청이 완료되었습니다. 정식 출시 소식을 가장 먼저 보내드릴게요.'
    await sendSms(phone, smsText)
  }

  return NextResponse.json({ success: true }, { headers })
}
