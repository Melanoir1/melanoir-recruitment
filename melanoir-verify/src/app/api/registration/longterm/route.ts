import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { slugToToken } from '@/lib/token'
import { issueCredit, CREDIT_AMOUNTS } from '@/lib/credits'
import { uploadPhoto } from '@/lib/storage'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const token = formData.get('token') as string
  const reviewText = formData.get('review_text') as string | null
  const satisfactionRaw = formData.get('satisfaction') as string | null
  const photo = formData.get('longterm_photo') as File | null

  if (!token) return NextResponse.json({ error: 'token required' }, { status: 400 })
  if (!photo || photo.size === 0) {
    return NextResponse.json({ error: '6개월 사진을 첨부해주세요.' }, { status: 400 })
  }

  const satisfaction = satisfactionRaw ? parseInt(satisfactionRaw, 10) : NaN
  if (!Number.isInteger(satisfaction) || satisfaction < 1 || satisfaction > 5) {
    return NextResponse.json({ error: '만족도를 선택해주세요.' }, { status: 400 })
  }

  let formattedToken: string
  try {
    formattedToken = slugToToken(token)
  } catch {
    return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: reg } = await supabase
    .from('mnr_registrations')
    .select('reg_id, customer_phone, healing_photo_url, longterm_photo_url, longterm_credits_issued')
    .eq('serial_token', formattedToken)
    .single()
  if (!reg) return NextResponse.json({ error: '먼저 정품 등록을 완료해주세요.' }, { status: 400 })
  if (!reg.healing_photo_url) {
    return NextResponse.json({ error: '힐링 사진 등록 후 이용할 수 있습니다.' }, { status: 400 })
  }
  if (reg.longterm_photo_url) {
    return NextResponse.json({ error: '이미 등록되어 있습니다.' }, { status: 409 })
  }

  let photoPath: string
  try {
    photoPath = await uploadPhoto(photo, formattedToken, 'longterm')
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : '사진 업로드 실패' }, { status: 400 })
  }

  const { error } = await supabase
    .from('mnr_registrations')
    .update({
      longterm_photo_url: photoPath,
      longterm_review_text: reviewText?.trim() ? reviewText.trim() : null,
      satisfaction,
      longterm_credits_issued: true,
      longterm_registered_at: new Date().toISOString(),
    })
    .eq('serial_token', formattedToken)
  if (error) return NextResponse.json({ error: '업데이트 실패' }, { status: 500 })

  let creditsEarned = 0
  if (reg.customer_phone && !reg.longterm_credits_issued) {
    creditsEarned = CREDIT_AMOUNTS.photo_longterm
    await issueCredit('customer', reg.customer_phone, 'photo_longterm')
  }

  return NextResponse.json({ success: true, credits_earned: creditsEarned })
}
