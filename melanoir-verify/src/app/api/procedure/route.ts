import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { slugToToken } from '@/lib/token'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { token, practitioner_id, procedure_at, technique, customer_phone } = body

  if (!token || !practitioner_id || !procedure_at || !technique) {
    return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 })
  }

  const VALID_TECHNIQUES = ['hairstroke', 'combo', 'machine_gradient']
  if (!VALID_TECHNIQUES.includes(technique)) {
    return NextResponse.json({ error: '유효하지 않은 기법입니다.' }, { status: 400 })
  }

  let formattedToken: string
  try {
    formattedToken = slugToToken(token)
  } catch {
    return NextResponse.json({ error: '유효하지 않은 토큰 형식입니다.' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // 제품 존재 확인
  const { data: product } = await supabase
    .from('products')
    .select('serial_token, product_type')
    .eq('serial_token', formattedToken)
    .single()

  if (!product) {
    return NextResponse.json({ error: '존재하지 않는 제품입니다.' }, { status: 404 })
  }

  if (product.product_type !== 'main') {
    return NextResponse.json({ error: '본품만 시술 등록 가능합니다.' }, { status: 400 })
  }

  // 시술자 존재 확인
  const { data: practitioner } = await supabase
    .from('practitioners')
    .select('practitioner_id')
    .eq('practitioner_id', practitioner_id)
    .single()

  if (!practitioner) {
    return NextResponse.json({ error: '존재하지 않는 시술자입니다.' }, { status: 404 })
  }

  // 시술 등록 (UNIQUE 제약으로 중복 방지)
  const { error } = await supabase.from('procedures').insert({
    serial_token: formattedToken,
    practitioner_id,
    procedure_at,
    technique,
    customer_phone: customer_phone ?? null,
  })

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: '이미 시술 등록된 제품입니다.' }, { status: 409 })
    }
    console.error('procedure insert error:', error)
    return NextResponse.json({ error: '시술 등록에 실패했습니다.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function GET(req: NextRequest) {
  const practitioner_id = req.nextUrl.searchParams.get('practitioner_id')
  if (!practitioner_id) return NextResponse.json({ error: 'practitioner_id required' }, { status: 400 })

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('procedures')
    .select('procedure_id, serial_token, procedure_at, technique, registered_at')
    .eq('practitioner_id', practitioner_id)
    .order('registered_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'db error' }, { status: 500 })
  return NextResponse.json({ procedures: data })
}
