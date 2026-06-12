import { NextResponse } from 'next/server'
import { createRawServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createRawServiceClient()
  const { data, error } = await supabase
    .from('mnr_waitlist')
    .select('id, type, phone, name, shop_name, instagram, source, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    count: data?.length ?? 0,
    by_type: {
      beta: data?.filter(r => r.type === 'beta').length ?? 0,
      customer: data?.filter(r => r.type === 'customer').length ?? 0,
      pro: data?.filter(r => r.type === 'pro').length ?? 0,
    },
    rows: data,
  })
}
