import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { slugToToken } from '@/lib/token'
import { issueProPoint } from '@/lib/credits'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    token, practitioner_id, procedure_at, technique, customer_phone,
    area, is_retouch, skin_type, device_type, needle_type, dilution,
  } = body

  if (!token || !practitioner_id || !procedure_at || !technique || !area || typeof is_retouch !== 'boolean') {
    return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 })
  }

  const VALID_TECHNIQUES = ['hairstroke', 'combo', 'machine_gradient']
  const VALID_AREAS = ['eyebrow', 'eyeliner', 'lip']
  const VALID_SKIN = ['oily', 'dry', 'combination', 'sensitive']
  const VALID_DEVICE = ['machine', 'manual']
  if (!VALID_TECHNIQUES.includes(technique)) return NextResponse.json({ error: '유효하지 않은 기법입니다.' }, { status: 400 })
  if (!VALID_AREAS.includes(area)) return NextResponse.json({ error: '유효하지 않은 부위입니다.' }, { status: 400 })
  if (skin_type && !VALID_SKIN.includes(skin_type)) return NextResponse.json({ error: '유효하지 않은 피부 타입입니다.' }, { status: 400 })
  if (device_type && !VALID_DEVICE.includes(device_type)) return NextResponse.json({ error: '유효하지 않은 시술 방식입니다.' }, { status: 400 })

  let formattedToken: string
  try {
    formattedToken = slugToToken(token)
  } catch {
    return NextResponse.json({ error: '유효하지 않은 토큰 형식입니다.' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: product } = await supabase
    .from('mnr_products')
    .select('serial_token, product_type')
    .eq('serial_token', formattedToken)
    .single()
  if (!product) return NextResponse.json({ error: '존재하지 않는 제품입니다.' }, { status: 404 })
  if (product.product_type !== 'main') return NextResponse.json({ error: '본품만 시술 등록 가능합니다.' }, { status: 400 })

  const { data: practitioner } = await supabase
    .from('mnr_practitioners')
    .select('practitioner_id')
    .eq('practitioner_id', practitioner_id)
    .single()
  if (!practitioner) return NextResponse.json({ error: '존재하지 않는 시술자입니다.' }, { status: 404 })

  const { error } = await supabase.from('mnr_procedures').insert({
    serial_token: formattedToken,
    practitioner_id,
    procedure_at,
    technique,
    customer_phone: customer_phone ?? null,
    area,
    is_retouch,
    skin_type: skin_type ?? null,
    device_type: device_type ?? null,
    needle_type: needle_type ?? null,
    dilution: dilution ?? null,
  })

  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: '이미 시술 등록된 제품입니다.' }, { status: 409 })
    console.error('procedure insert error:', error)
    return NextResponse.json({ error: '시술 등록에 실패했습니다.' }, { status: 500 })
  }

  // 선택 입력 2개 이상 → 프로 포인트 보상
  const detailCount = [skin_type, device_type, needle_type, dilution].filter(v => v && String(v).trim()).length
  let proPointsEarned = 0
  if (detailCount >= 2) {
    proPointsEarned = await issueProPoint(practitioner_id, 'procedure_detail')
  }

  return NextResponse.json({ success: true, pro_points_earned: proPointsEarned })
}

export async function GET(req: NextRequest) {
  const practitioner_id = req.nextUrl.searchParams.get('practitioner_id')
  if (!practitioner_id) return NextResponse.json({ error: 'practitioner_id required' }, { status: 400 })

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('mnr_procedures')
    .select('procedure_id, serial_token, procedure_at, technique, registered_at')
    .eq('practitioner_id', practitioner_id)
    .order('registered_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'db error' }, { status: 500 })
  return NextResponse.json({ procedures: data })
}
