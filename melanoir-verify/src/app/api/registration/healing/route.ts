import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { slugToToken } from '@/lib/token'
import { issueCredit, CREDIT_AMOUNTS } from '@/lib/credits'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const token = formData.get('token') as string
  // healing_photo: Phase 1에서 Supabase Storage 연동

  if (!token) return NextResponse.json({ error: 'token required' }, { status: 400 })

  let formattedToken: string
  try {
    formattedToken = slugToToken(token)
  } catch {
    return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: reg } = await supabase
    .from('registrations')
    .select('reg_id, customer_phone, healing_credits_issued, healing_photo_url')
    .eq('serial_token', formattedToken)
    .single()

  if (!reg) return NextResponse.json({ error: '먼저 정품 등록을 완료해주세요.' }, { status: 400 })
  if (reg.healing_photo_url) return NextResponse.json({ error: '이미 힐링 사진이 등록되어 있습니다.' }, { status: 409 })

  // Phase 0: 사진 URL은 placeholder, Phase 1에서 실제 업로드
  const { error } = await supabase
    .from('registrations')
    .update({
      healing_photo_url: 'pending_upload',
      healing_credits_issued: true,
      healing_registered_at: new Date().toISOString(),
    })
    .eq('serial_token', formattedToken)

  if (error) return NextResponse.json({ error: '업데이트 실패' }, { status: 500 })

  // 리터칭 잉크 발송 요청 생성
  await supabase.from('retouch_dispatches').insert({
    origin_serial: formattedToken,
    r_serial: `MNR-R-${Date.now()}`,
    status: 'pending',
  })

  // 크레딧 지급
  let creditsEarned = 0
  if (reg.customer_phone && !reg.healing_credits_issued) {
    creditsEarned = CREDIT_AMOUNTS.photo_healing
    await issueCredit('customer', reg.customer_phone, 'photo_healing')
  }

  return NextResponse.json({ success: true, credits_earned: creditsEarned })
}
