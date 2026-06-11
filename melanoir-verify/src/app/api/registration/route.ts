import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { slugToToken } from '@/lib/token'
import { issueCredit, CREDIT_AMOUNTS } from '@/lib/credits'
import { uploadPhoto } from '@/lib/storage'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const token = formData.get('token') as string
  const customerName = formData.get('customer_name') as string
  const customerPhone = formData.get('customer_phone') as string
  const marketingConsent = formData.get('marketing_consent') === 'true'
  const photoConsent = formData.get('photo_consent') === 'true'
  const photo = formData.get('photo') as File | null

  if (!token || !customerName || !customerPhone) {
    return NextResponse.json({ error: '이름과 연락처는 필수입니다.' }, { status: 400 })
  }
  if (!photoConsent) {
    return NextResponse.json({ error: '시술 부위 사진 수집·이용 동의가 필요합니다.' }, { status: 400 })
  }
  if (!photo || photo.size === 0) {
    return NextResponse.json({ error: '시술 부위 사진을 첨부해주세요.' }, { status: 400 })
  }

  let formattedToken: string
  try {
    formattedToken = slugToToken(token)
  } catch {
    return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: procedure } = await supabase
    .from('mnr_procedures')
    .select('procedure_id')
    .eq('serial_token', formattedToken)
    .single()
  if (!procedure) {
    return NextResponse.json({ error: '시술자 등록 후 정품 등록이 가능합니다.' }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from('mnr_registrations')
    .select('reg_id')
    .eq('serial_token', formattedToken)
    .single()
  if (existing) {
    return NextResponse.json({ error: '이미 등록된 제품입니다.' }, { status: 409 })
  }

  let photoPath: string
  try {
    photoPath = await uploadPhoto(photo, formattedToken, 'before')
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : '사진 업로드 실패' }, { status: 400 })
  }

  const { error } = await supabase.from('mnr_registrations').insert({
    serial_token: formattedToken,
    customer_name: customerName,
    customer_phone: customerPhone,
    photo_url: photoPath,
    consented_at: new Date().toISOString(),
    marketing_consent: marketingConsent,
    credits_issued: true,
  })
  if (error) {
    return NextResponse.json({ error: '등록 실패' }, { status: 500 })
  }

  await issueCredit('customer', customerPhone, 'registration')
  await issueCredit('customer', customerPhone, 'photo_before')
  const creditsEarned = CREDIT_AMOUNTS.registration + CREDIT_AMOUNTS.photo_before

  return NextResponse.json({ success: true, credits_earned: creditsEarned })
}
