import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { phone, code, name, shop_name, region } = await req.json()
  if (!phone || !code) {
    return NextResponse.json({ error: '전화번호와 인증번호를 입력해주세요.' }, { status: 400 })
  }

  const normalizedPhone = phone.replace(/-/g, '')
  const supabase = createServiceClient()

  // OTP 검증
  const { data: otp } = await supabase
    .from('mnr_sms_verifications')
    .select('id, verified, expires_at')
    .eq('phone', normalizedPhone)
    .eq('code', code)
    .eq('verified', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!otp) {
    return NextResponse.json({ error: '인증번호가 올바르지 않거나 만료되었습니다.' }, { status: 401 })
  }

  // OTP 소진 처리
  await supabase.from('mnr_sms_verifications').update({ verified: true }).eq('id', otp.id)

  // 기존 시술자 조회
  const { data: existing } = await supabase
    .from('mnr_practitioners')
    .select('*')
    .eq('phone', normalizedPhone)
    .single()

  if (existing) {
    return NextResponse.json({ practitioner: existing, is_new: false })
  }

  // 신규 시술자: name, shop_name 필요
  if (!name || !shop_name) {
    return NextResponse.json({ need_registration: true })
  }

  const { data: newPractitioner, error } = await supabase
    .from('mnr_practitioners')
    .insert({ phone: normalizedPhone, name, shop_name, region: region ?? null })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: '계정 생성에 실패했습니다.' }, { status: 500 })
  }

  return NextResponse.json({ practitioner: newPractitioner, is_new: true })
}
