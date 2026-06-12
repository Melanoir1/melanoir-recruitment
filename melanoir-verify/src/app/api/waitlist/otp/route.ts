import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
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

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
  const headers = corsHeaders(req)

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400, headers })
  }

  const phone = String(body.phone ?? '').replace(/-/g, '')
  if (!/^01[0-9]{8,9}$/.test(phone)) {
    return NextResponse.json({ error: '유효하지 않은 전화번호입니다.' }, { status: 400, headers })
  }

  const supabase = createServiceClient()

  // 레이트리밋 1: 1분 내 재요청 차단
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString()
  const { data: recent } = await supabase
    .from('mnr_sms_verifications')
    .select('id')
    .eq('phone', phone)
    .gte('created_at', oneMinuteAgo)
    .limit(1)
  if (recent && recent.length > 0) {
    return NextResponse.json({ error: '잠시 후 다시 시도해주세요.' }, { status: 429, headers })
  }

  // 레이트리밋 2: 1시간 5회 제한
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('mnr_sms_verifications')
    .select('id', { count: 'exact', head: true })
    .eq('phone', phone)
    .gte('created_at', oneHourAgo)
  if ((count ?? 0) >= 5) {
    return NextResponse.json({ error: '요청 횟수를 초과했습니다. 1시간 후 다시 시도해주세요.' }, { status: 429, headers })
  }

  const code = generateOtp()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

  const { error } = await supabase.from('mnr_sms_verifications').insert({
    phone,
    code,
    expires_at: expiresAt.toISOString(),
  })
  if (error) {
    console.error('[waitlist/otp] insert error:', error)
    return NextResponse.json({ error: '처리 중 오류가 발생했습니다.' }, { status: 500, headers })
  }

  await sendSms(phone, `[멜라누아] 인증번호 [${code}]`)

  return NextResponse.json({ success: true, expires_at: expiresAt.toISOString() }, { headers })
}
