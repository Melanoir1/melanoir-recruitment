import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { slugToToken } from '@/lib/token'
import { issueCredit, CREDIT_AMOUNTS } from '@/lib/credits'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const token = formData.get('token') as string
  const customerName = formData.get('customer_name') as string
  const customerPhone = formData.get('customer_phone') as string
  const reviewText = formData.get('review_text') as string | null
  // photo upload: Phase 1에서 Supabase Storage 연동

  if (!token || !customerName || !customerPhone) {
    return NextResponse.json({ error: '이름과 연락처는 필수입니다.' }, { status: 400 })
  }

  let formattedToken: string
  try {
    formattedToken = slugToToken(token)
  } catch {
    return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // 시술 등록 여부 확인
  const { data: procedure } = await supabase
    .from('mnr_procedures')
    .select('procedure_id')
    .eq('serial_token', formattedToken)
    .single()

  if (!procedure) {
    return NextResponse.json({ error: '시술자 등록 후 정품 등록이 가능합니다.' }, { status: 400 })
  }

  // 중복 등록 확인
  const { data: existing } = await supabase
    .from('mnr_registrations')
    .select('reg_id')
    .eq('serial_token', formattedToken)
    .single()

  if (existing) {
    return NextResponse.json({ error: '이미 등록된 제품입니다.' }, { status: 409 })
  }

  // 등록
  const { error } = await supabase.from('mnr_registrations').insert({
    serial_token: formattedToken,
    customer_name: customerName,
    customer_phone: customerPhone,
    review_text: reviewText ?? null,
    credits_issued: true,
  })

  if (error) {
    return NextResponse.json({ error: '등록 실패' }, { status: 500 })
  }

  // 멜라누아 멤버십 크레딧 지급 (정품 등록 완료 = 멜라누아 멤버십 자동 가입)
  let creditsEarned = CREDIT_AMOUNTS.registration
  await issueCredit('customer', customerPhone, 'registration')

  if (reviewText && reviewText.trim().length > 0) {
    creditsEarned += CREDIT_AMOUNTS.review_text
    await issueCredit('customer', customerPhone, 'review_text')
  }

  return NextResponse.json({ success: true, credits_earned: creditsEarned })
}
