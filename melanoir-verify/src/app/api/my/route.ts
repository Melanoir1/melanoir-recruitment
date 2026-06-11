import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySession, COOKIE_CUSTOMER } from '@/lib/session'
import { createServiceClient } from '@/lib/supabase'
import { getCreditBalance } from '@/lib/credits'

export async function GET() {
  const raw = cookies().get(COOKIE_CUSTOMER)?.value
  const phone = raw ? verifySession(raw) : null
  if (!phone) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const supabase = createServiceClient()
  const { data: regs, error } = await supabase
    .from('mnr_registrations')
    .select(`
      reg_id, created_at, credits_issued, healing_credits_issued,
      healing_photo_url, longterm_photo_url, serial_token,
      mnr_procedures ( procedure_at, technique, mnr_practitioners ( name, shop_name ) )
    `)
    .eq('customer_phone', phone)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const balance = await getCreditBalance('customer', phone)
  return NextResponse.json({ registrations: regs ?? [], balance })
}
