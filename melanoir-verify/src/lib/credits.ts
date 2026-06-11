import { createServiceClient } from './supabase'

// ============================================================
// 멜라누아 클럽 크레딧 (고객, owner_type = 'customer')
//   - 정품 등록 → 힐링 사진 업로드 시 자동 적립
//   - 유효기간: 적립일로부터 24개월
//   - 사용처: 추후 제휴 서비스·이벤트·프로모션 연계 예정
//
// 멜라누아 프로 포인트 (시술자, owner_type = 'practitioner')
//   - 시술 등록 횟수 기반 등급에 따라 구매 시 적립
//   - 유효기간: 적립일로부터 12개월
//   - 사용처: 엠보 제품 구매 할인
// ============================================================

// 고객 크레딧 지급량 (멜라누아 클럽)
export const CREDIT_AMOUNTS = {
  registration: 10000,    // 정품 등록 완료 (멜라누아 클럽 자동 가입)
  review_text: 5000,      // 후기 텍스트 작성
  photo_before: 10000,    // 시술 직후 사진 업로드
  photo_healing: 15000,   // 힐링 완료 사진 업로드
  photo_longterm: 10000,  // 6개월 경과 사진 업로드 (Phase B)
} as const

export type CreditReason = keyof typeof CREDIT_AMOUNTS

// 유효기간 설정 (owner_type별 분리)
const EXPIRY_MONTHS: Record<'customer' | 'practitioner', number> = {
  customer: 24,       // 멜라누아 클럽 크레딧
  practitioner: 12,   // 멜라누아 프로 포인트
}

export async function issueCredit(
  ownerType: 'customer' | 'practitioner',
  ownerId: string,
  reason: CreditReason
) {
  const supabase = createServiceClient()
  const amount = CREDIT_AMOUNTS[reason]
  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + EXPIRY_MONTHS[ownerType])

  const { error } = await supabase.from('mnr_credits').insert({
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

// 멜라누아 프로 포인트 (시술 상세 데이터 입력 보상)
export const PRO_POINT_AMOUNTS = {
  procedure_detail: 1000, // 선택 입력(피부타입·방식·니들·희석) 2개 이상 작성 시
} as const

export async function issueProPoint(
  practitionerId: string,
  reason: keyof typeof PRO_POINT_AMOUNTS
) {
  const supabase = createServiceClient()
  const amount = PRO_POINT_AMOUNTS[reason]
  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + EXPIRY_MONTHS.practitioner)
  const { error } = await supabase.from('mnr_credits').insert({
    owner_type: 'practitioner',
    owner_id: practitionerId,
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
    .from('mnr_credits')
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
