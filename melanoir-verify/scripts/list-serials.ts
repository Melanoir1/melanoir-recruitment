/**
 * 생성된 시리얼 목록 출력 (인쇄/QR 생성용)
 * 실행: npx ts-node --project tsconfig.node.json scripts/list-serials.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function main() {
  const { data, error } = await supabase
    .from('products')
    .select('internal_id, serial_token, lot_id, created_at')
    .order('internal_id', { ascending: true })

  if (error) { console.error(error); process.exit(1) }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  console.log('internal_id\tserial_token\t\t\tQR URL')
  console.log('─'.repeat(80))
  data?.forEach(p => {
    const slug = p.serial_token.replace(/-/g, '')
    console.log(`${p.internal_id}\t${p.serial_token}\t${baseUrl}/v/${slug}`)
  })
  console.log(`\n총 ${data?.length}개`)
}

main().catch(console.error)
