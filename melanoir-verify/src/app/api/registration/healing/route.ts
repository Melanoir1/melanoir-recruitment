import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { slugToToken } from '@/lib/token'
import { issueCredit, CREDIT_AMOUNTS } from '@/lib/credits'
import { uploadPhoto } from '@/lib/storage'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const token = formData.get('token') as string
  const reviewText = formData.get('review_text') as string | null
  const photo = formData.get('healing_photo') as File | null

  if (!token) return NextResponse.json({ error: 'token required' }, { status: 400 })
  if (!reviewText || !reviewText.trim()) {
    return NextResponse.json({ error: '후기를 입력해주세요.' }, { status: 400 })
  }
  if (!photo || photo.size === 0) {
    return NextResponse.json({ error: '힐링 사진을 첨부해주세요.' }, { status: 400 })
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
    .select('reg_id, customer_phone, healing_credits_issued, healing_photo_url')
    .eq('serial_token', formattedToken)
    .single()
  if (!reg) return NextResponse.json({ error: '먼저 정품 등록을 완료해주세요.' }, { status: 400 })
  if (reg.healing_photo_url) {
    return NextResponse.json({ error: '이미 힐링 사진이 등록되어 있습니다.' }, { status: 409 })
  }

  const { data: proc } = await supabase
    .from('mnr_procedures')
    .select('procedure_at')
    .eq('serial_token', formattedToken)
    .single()
  if (proc?.procedure_at) {
    const procedureDate = new Date(proc.procedure_at)
    const daysSince = Math.floor((Date.now() - procedureDate.getTime()) / (24 * 60 * 60 * 1000))
    if (daysSince < 7) {
      return NextResponse.json(
        { error: '힐링 사진은 시술 7일 후부터 등록할 수 있습니다. 조금만 기다려주세요.' },
        { status: 400 }
      )
    }
  }

  let photoPath: string
  try {
    photoPath = await uploadPhoto(photo, formattedToken, 'healing')
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : '사진 업로드 실패' }, { status: 400 })
  }

  const { error } = await supabase
    .from('mnr_registrations')
    .update({
      healing_photo_url: photoPath,
      healing_review_text: reviewText.trim(),
      healing_credits_issued: true,
      healing_registered_at: new Date().toISOString(),
    })
    .eq('serial_token', formattedToken)
  if (error) return NextResponse.json({ error: '업데이트 실패' }, { status: 500 })

  await supabase.from('mnr_retouch_dispatches').insert({
    origin_serial: formattedToken,
    r_serial: `MNR-R-${Date.now()}`,
    status: 'pending',
  })

  let creditsEarned = 0
  if (reg.customer_phone && !reg.healing_credits_issued) {
    await issueCredit('customer', reg.customer_phone, 'photo_healing')
    await issueCredit('customer', reg.customer_phone, 'review_text')
    creditsEarned = CREDIT_AMOUNTS.photo_healing + CREDIT_AMOUNTS.review_text
  }

  return NextResponse.json({ success: true, credits_earned: creditsEarned })
}
