import { createServiceClient } from './supabase'

export const CREDIT_AMOUNTS = {
  registration: 10000,    // 정품 등록 완료
  review_text: 5000,      // 후기 텍스트 작성
  photo_before: 10000,    // 시술 직후 사진 업로드
  photo_healing: 15000,   // 힐링 완료 사진 업로드
} as const

export type CreditReason = keyof typeof CREDIT_AMOUNTS

export async function issueCredit(
  ownerType: 'customer' | 'practitioner',
  ownerId: string,
  reason: CreditReason
) {
  const supabase = createServiceClient()
  const amount = CREDIT_AMOUNTS[reason]
  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + 24)

  const { error } = await supabase.from('credits').insert({
    owner_type: ownerType,
    owner_id: ownerId,
    amount,
    type: 'earn',
    reason,
    expires_at: expiresAt.toISOString(),
  })

  if (error) throw error
  return amount
}

export async function getCreditBalance(
  ownerType: 'customer' | 'practitioner',
  ownerId: string
): Promise<number> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('credits')
    .select('amount, type')
    .eq('owner_type', ownerType)
    .eq('owner_id', ownerId)
    .gt('expires_at', new Date().toISOString())

  if (error) throw error
  return (data ?? []).reduce(
    (sum, row) => sum + (row.type === 'earn' ? row.amount : -row.amount),
    0
  )
}
