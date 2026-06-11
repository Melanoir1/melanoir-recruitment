import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { sendSms } from '@/lib/sms'

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
  const { phone } = await req.json()
  if (!phone || !/^01[0-9]{8,9}$/.test(phone.replace(/-/g, ''))) {
    return NextResponse.json({ error: '유효하지 않은 전화번호입니다.' }, { status: 400 })
  }

  const normalizedPhone = phone.replace(/-/g, '')
  const supabase = createServiceClient()

  const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString()
  const { data: recent } = await supabase
    .from('mnr_sms_verifications')
    .select('id')
    .eq('phone', normalizedPhone)
    .gte('created_at', oneMinuteAgo)
    .limit(1)
  if (recent && recent.length > 0) {
    return NextResponse.json({ error: '잠시 후 다시 시도해주세요.' }, { status: 429 })
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('mnr_sms_verifications')
    .select('id', { count: 'exact', head: true })
    .eq('phone', normalizedPhone)
    .gte('created_at', oneHourAgo)
  if ((count ?? 0) >= 5) {
    return NextResponse.json({ error: '요청 횟수를 초과했습니다. 1시간 후 다시 시도해주세요.' }, { status: 429 })
  }

  const code = generateOtp()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

  await supabase.from('mnr_sms_verifications').insert({
    phone: normalizedPhone,
    code,
    expires_at: expiresAt.toISOString(),
  })

  await sendSms(normalizedPhone, `[멜라누아] 인증번호 [${code}]`)

  return NextResponse.json({ success: true, expires_at: expiresAt.toISOString() })
}
