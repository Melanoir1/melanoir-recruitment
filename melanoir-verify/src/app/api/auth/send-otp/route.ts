import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function sendSms(phone: string, code: string) {
  // Coolsms API 연동 (환경 변수 설정 후 활성화)
  const apiKey = process.env.SMS_API_KEY
  const senderPhone = process.env.SMS_SENDER_PHONE

  if (!apiKey || !senderPhone) {
    // 개발 환경: 콘솔 출력
    console.log(`[DEV] SMS to ${phone}: 인증번호 [${code}]`)
    return
  }

  // TODO: Coolsms 또는 알리고 API 호출
  // 현재는 개발용 콘솔 출력만
  console.log(`SMS to ${phone}: ${code}`)
}

export async function POST(req: NextRequest) {
  const { phone } = await req.json()
  if (!phone || !/^01[0-9]{8,9}$/.test(phone.replace(/-/g, ''))) {
    return NextResponse.json({ error: '유효하지 않은 전화번호입니다.' }, { status: 400 })
  }

  const normalizedPhone = phone.replace(/-/g, '')
  const code = generateOtp()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5분

  const supabase = createServiceClient()
  await supabase.from('mnr_sms_verifications').insert({
    phone: normalizedPhone,
    code,
    expires_at: expiresAt.toISOString(),
  })

  await sendSms(normalizedPhone, code)

  return NextResponse.json({ success: true, expires_at: expiresAt.toISOString() })
}
