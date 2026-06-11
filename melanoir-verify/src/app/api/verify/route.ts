import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { slugToToken } from '@/lib/token'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'token required' }, { status: 400 })

  let formattedToken: string
  try {
    formattedToken = slugToToken(token)
  } catch {
    return NextResponse.json({ error: 'invalid token format' }, { status: 400 })
  }

  // 제품 조회
  const { data: product, error: productError } = await supabase
    .from('mnr_products')
    .select('*')
    .eq('serial_token', formattedToken)
    .single()

  if (productError || !product) {
    return NextResponse.json({ error: '존재하지 않는 제품입니다.' }, { status: 404 })
  }

  // 배송 정보
  const { data: shipment } = await supabase
    .from('mnr_shipments')
    .select('delivered_at, shipped_at, carrier')
    .lte('internal_id_from', product.internal_id)
    .gte('internal_id_to', product.internal_id)
    .single()

  // 시술 정보
  const { data: procedure } = await supabase
    .from('mnr_procedures')
    .select(`
      procedure_at,
      technique,
      mnr_practitioners (
        name,
        shop_name,
        region
      )
    `)
    .eq('serial_token', formattedToken)
    .single()

  // 고객 등록 정보
  const { data: registration } = await supabase
    .from('mnr_registrations')
    .select('registered_at, healing_photo_url, healing_registered_at')
    .eq('serial_token', formattedToken)
    .single()

  // 배치 정보
  const { data: lot } = product.lot_id
    ? await supabase.from('mnr_lots').select('manufactured_at, lot_id').eq('lot_id', product.lot_id).single()
    : { data: null }

  return NextResponse.json({
    token: formattedToken,
    product: {
      lot_id: product.lot_id,
      manufactured_at: lot?.manufactured_at ?? null,
    },
    shipment: shipment ?? null,
    procedure: procedure
      ? {
          procedure_at: procedure.procedure_at,
          technique: procedure.technique,
          practitioner: procedure.mnr_practitioners,
        }
      : null,
    registration: registration
      ? {
          registered_at: registration.registered_at,
          has_healing_photo: !!registration.healing_photo_url,
          healing_registered_at: registration.healing_registered_at,
        }
      : null,
  })
}
