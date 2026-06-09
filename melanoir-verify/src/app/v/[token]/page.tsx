import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { slugToToken } from '@/lib/token'
import type { Database } from '@/types/database'
import VerifyClient from './VerifyClient'

interface PageProps {
  params: { token: string }
}

async function getProductData(slug: string) {
  const token = slugToToken(slug)

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('serial_token', token)
    .single()

  if (!product) return null

  const [{ data: lot }, { data: shipment }, { data: procedure }, { data: registration }] =
    await Promise.all([
      product.lot_id
        ? supabase.from('lots').select('manufactured_at, lot_id').eq('lot_id', product.lot_id).single()
        : Promise.resolve({ data: null }),
      supabase
        .from('shipments')
        .select('delivered_at, shipped_at')
        .lte('internal_id_from', product.internal_id)
        .gte('internal_id_to', product.internal_id)
        .single(),
      supabase
        .from('procedures')
        .select('procedure_at, technique, practitioners(name, shop_name, region)')
        .eq('serial_token', token)
        .single(),
      supabase
        .from('registrations')
        .select('*')
        .eq('serial_token', token)
        .single(),
    ])

  return { token, product, lot, shipment, procedure, registration }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `정품 확인 — Melanoir`,
    description: '멜라누아 엠보 정품 여부 및 시술 이력을 확인합니다.',
  }
}

export default async function VerifyPage({ params }: PageProps) {
  let data: Awaited<ReturnType<typeof getProductData>>

  try {
    data = await getProductData(params.token)
  } catch {
    notFound()
  }

  if (!data) notFound()

  return <VerifyClient data={data} />
}
