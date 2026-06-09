/**
 * 베타 시드 데이터 생성 스크립트
 * 
 * 실행: npx ts-node --project tsconfig.node.json scripts/seed.ts
 * 
 * 필요 환경 변수: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, HMAC_SECRET
 */
import { createClient } from '@supabase/supabase-js'
import { createHmac } from 'crypto'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const HMAC_SECRET = process.env.HMAC_SECRET!

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !HMAC_SECRET) {
  console.error('.env.local 파일의 환경 변수를 설정해주세요.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

function generateToken(internalId: number): string {
  const raw = createHmac('sha256', HMAC_SECRET)
    .update(internalId.toString())
    .digest('hex')
    .slice(0, 16)
    .toUpperCase()
  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}`
}

async function main() {
  console.log('🌱 시드 데이터 생성 시작...\n')

  // 1. 배치 생성
  const LOT_ID = 'L-2026-06'
  const { error: lotError } = await supabase.from('lots').upsert({
    lot_id: LOT_ID,
    manufactured_at: '2026-05-15T00:00:00+09:00',
    quantity: 50,
    qc_result: 'pass',
  })
  if (lotError) { console.error('lot error:', lotError); process.exit(1) }
  console.log(`✓ 배치 생성: ${LOT_ID}`)

  // 2. 시리얼 50개 생성
  // 먼저 현재 max internal_id 확인
  const { data: maxRow } = await supabase
    .from('products')
    .select('internal_id')
    .order('internal_id', { ascending: false })
    .limit(1)
    .single()

  const startId = (maxRow?.internal_id ?? 0) + 1

  const products = []
  for (let i = startId; i < startId + 50; i++) {
    products.push({
      serial_token: generateToken(i),
      lot_id: LOT_ID,
      product_type: 'main' as const,
    })
  }

  const { data: inserted, error: productError } = await supabase
    .from('products')
    .insert(products)
    .select('internal_id, serial_token')

  if (productError) { console.error('products error:', productError); process.exit(1) }
  console.log(`✓ 시리얼 ${products.length}개 생성 (internal_id: ${startId} ~ ${startId + 49})`)

  // 3. 출고 배송 정보
  const { error: shipError } = await supabase.from('shipments').insert({
    internal_id_from: startId,
    internal_id_to: startId + 49,
    waybill_no: 'BETA-TEST-001',
    carrier: 'CJ대한통운',
    shop_name: '베타테스트',
    shipped_at: new Date().toISOString(),
    delivered_at: new Date().toISOString(),
  })
  if (shipError) console.warn('shipment warning:', shipError)
  console.log('✓ 배송 정보 생성')

  // 4. 테스트 시술자 생성
  const { data: practitioner, error: pracError } = await supabase
    .from('practitioners')
    .upsert({
      name: '김베타',
      shop_name: '테스트 뷰티샵',
      phone: '01099999999',
      region: '서울',
      tier: 'basic',
    }, { onConflict: 'phone' })
    .select()
    .single()

  if (pracError) console.warn('practitioner warning:', pracError)
  console.log(`✓ 테스트 시술자 생성: 01099999999`)

  // 5. 첫 번째 시리얼에 시술 등록 (테스트용)
  if (inserted && inserted.length > 0 && practitioner) {
    const testSerial = inserted[0].serial_token
    const { error: procError } = await supabase.from('procedures').upsert({
      serial_token: testSerial,
      practitioner_id: practitioner.practitioner_id,
      procedure_at: new Date().toISOString().split('T')[0],
      technique: 'hairstroke',
    }, { onConflict: 'serial_token' })
    if (!procError) {
      console.log(`✓ 테스트 시술 등록: ${testSerial}`)
    }
  }

  console.log('\n✅ 시드 완료!\n')
  console.log('=== 생성된 QR URL 예시 (처음 3개) ===')
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  inserted?.slice(0, 3).forEach(p => {
    const slug = p.serial_token.replace(/-/g, '')
    console.log(`  ${baseUrl}/v/${slug}`)
  })
}

main().catch(console.error)
