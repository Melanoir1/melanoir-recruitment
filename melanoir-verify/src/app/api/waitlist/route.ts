import { NextRequest, NextResponse } from 'next/server'
import { createRawServiceClient, createServiceClient } from '@/lib/supabase'
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
  const TECHNIQUE = ['embo', 'sooji', 'combo', 'hairstroke', 'ombre', 'machine_combo', 'other']
  const TARGET = ['female', 'male', 'both']
  const REGION = ['서울','부산','대구','인천','광주','대전','울산','세종','경기','강원','충북','충남','전북','전남','경북','경남','제주']

  const technique = String(body.technique ?? '')
  const target = String(body.target ?? '')
  const region = String(body.region ?? '')
  const regionDetail = body.region_detail ? String(body.region_detail).slice(0, 60) : null

  const techAllArr = String(body.techniques_all ?? '').split(',').map(s => s.trim()).filter(Boolean)
  const techAllValid = techAllArr.every(t => TECHNIQUE.includes(t)) && techAllArr.length <= 3
  const techniquesAll = techAllValid && techAllArr.length ? techAllArr.join(',') : null

  if (type === 'beta' && !TECHNIQUE.includes(technique)) {
    return NextResponse.json({ error: '주력 기법을 선택해주세요.' }, { status: 400, headers })
  }
  if (type === 'beta' && String(body.techniques_all ?? '') && !techAllValid) {
    return NextResponse.json({ error: '가능 기법은 최대 3개까지 선택할 수 있습니다.' }, { status: 400, headers })
  }
  if (type === 'beta' && !TARGET.includes(target)) {
    return NextResponse.json({ error: '주 시술 대상을 선택해주세요.' }, { status: 400, headers })
  }
  if (type === 'beta' && !REGION.includes(region)) {
    return NextResponse.json({ error: '활동 지역을 선택해주세요.' }, { status: 400, headers })
  }
  if (!/^01[0-9]{8,9}$/.test(phone)) {
    return NextResponse.json({ error: '유효하지 않은 전화번호입니다.' }, { status: 400, headers })
  }
  if (body.consent !== true) {
    return NextResponse.json({ error: '개인정보 수집·이용 동의가 필요합니다.' }, { status: 400, headers })
  }

  // beta: SMS 본인 인증 검증 (중복 신청 방지 + 연락처 실소유 확인)
  let phoneVerifiedAt: string | null = null
  if (type === 'beta') {
    const code = String(body.otp_code ?? '').trim()
    if (!/^[0-9]{6}$/.test(code)) {
      return NextResponse.json({ error: '인증번호를 입력해주세요.' }, { status: 400, headers })
    }
    const otpClient = createServiceClient()
    const { data: otp } = await otpClient
      .from('mnr_sms_verifications')
      .select('id')
      .eq('phone', phone)
      .eq('code', code)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (!otp) {
      return NextResponse.json(
        { error: '인증번호가 올바르지 않거나 만료되었습니다. 재발송 후 다시 시도해주세요.' },
        { status: 401, headers }
      )
    }
    // 코드 소진 처리 (재사용 방지)
    await otpClient.from('mnr_sms_verifications').update({ verified: true }).eq('id', otp.id)
    phoneVerifiedAt = new Date().toISOString()
  }

  const supabase = createRawServiceClient()

  const { data: existing } = await supabase
    .from('mnr_waitlist')
    .select('id')
    .eq('phone', phone)
    .eq('type', type)
    .maybeSingle()

  // 주의: status·dm_code 등은 upsert 컬럼에 포함하지 않는다 → 재신청해도 선정 상태가 초기화되지 않음
  const { error } = await supabase.from('mnr_waitlist').upsert(
    {
      type,
      phone,
      name: body.name ? String(body.name).slice(0, 50) : null,
      shop_name: type !== 'customer' && body.shop_name ? String(body.shop_name).slice(0, 80) : null,
      instagram: type !== 'customer' && instagram ? instagram.slice(0, 80) : null,
      technique: type === 'beta' ? technique : null,
      techniques_all: type === 'beta' ? techniquesAll : null,
      target: type === 'beta' ? target : null,
      region: type === 'beta' ? region : null,
      region_detail: type === 'beta' ? regionDetail : null,
      marketing_consent: true,
      source: body.source ? String(body.source).slice(0, 120) : null,
      updated_at: new Date().toISOString(),
      ...(phoneVerifiedAt ? { phone_verified_at: phoneVerifiedAt } : {}),
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
      ? '[멜라누아] 베타테스터 신청이 완료되었습니다. 선정 시 인스타그램 DM 인증 안내를 문자로 보내드릴게요.'
      : '[멜라누아] 출시 알림 신청이 완료되었습니다. 정식 출시 소식을 가장 먼저 보내드릴게요.'
    await sendSms(phone, smsText)
  }

  return NextResponse.json({ success: true }, { headers })
}
