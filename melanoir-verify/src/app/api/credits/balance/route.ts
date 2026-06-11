import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { slugToToken } from '@/lib/token'
import { getCreditBalance } from '@/lib/credits'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'token required' }, { status: 400 })

  let formattedToken: string
  try {
    formattedToken = slugToToken(token)
  } catch {
    return NextResponse.json({ error: 'invalid token' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data: reg } = await supabase
    .from('mnr_registrations')
    .select('customer_phone')
    .eq('serial_token', formattedToken)
    .single()

  if (!reg?.customer_phone) {
    return NextResponse.json({ error: '등록 정보를 찾을 수 없습니다.' }, { status: 404 })
  }

  const balance = await getCreditBalance('customer', reg.customer_phone)
  return NextResponse.json({ balance })
}
