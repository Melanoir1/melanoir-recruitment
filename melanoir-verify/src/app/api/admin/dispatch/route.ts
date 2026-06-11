import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { sendSms } from '@/lib/sms'

export async function POST(req: NextRequest) {
  const { dispatch_id, status } = await req.json()
  if (!dispatch_id || !['approved', 'dispatched'].includes(status)) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 })
  }
  const supabase = createServiceClient()
  const patch = {
    status,
    ...(status === 'approved' ? { approved_at: new Date().toISOString() } : {}),
    ...(status === 'dispatched' ? { dispatched_at: new Date().toISOString() } : {}),
  }
  const { data: dispatch, error } = await supabase
    .from('mnr_retouch_dispatches')
    .update(patch)
    .eq('dispatch_id', dispatch_id)
    .select('origin_serial')
    .single()
  if (error) return NextResponse.json({ error: 'update failed' }, { status: 500 })

  if (status === 'dispatched' && dispatch?.origin_serial) {
    const { data: reg } = await supabase
      .from('mnr_registrations')
      .select('customer_phone')
      .eq('serial_token', dispatch.origin_serial)
      .single()
    if (reg?.customer_phone) {
      await sendSms(reg.customer_phone, '[멜라누아] 리터칭 잉크가 발송되었습니다.')
    }
  }

  return NextResponse.json({ success: true })
}
