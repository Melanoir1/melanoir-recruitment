import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { createHmac } from 'crypto'

export async function POST(req: NextRequest) {
  // 웹훅 서명 검증
  const signature = req.headers.get('x-sweettracker-signature')
  const secret = process.env.SWEETTRACKER_WEBHOOK_SECRET
  const body = await req.text()

  if (secret && signature) {
    const expected = createHmac('sha256', secret).update(body).digest('hex')
    if (expected !== signature) {
      return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
    }
  }

  let payload: { waybill_no?: string; status?: string; delivered_at?: string }
  try {
    payload = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const { waybill_no, status } = payload

  // 배송 완료 이벤트만 처리
  if (status !== 'delivered' || !waybill_no) {
    return NextResponse.json({ received: true })
  }

  const supabase = createServiceClient()
  const deliveredAt = payload.delivered_at ?? new Date().toISOString()

  const { error } = await supabase
    .from('shipments')
    .update({ delivered_at: deliveredAt })
    .eq('waybill_no', waybill_no)

  if (error) {
    console.error('shipment update error:', error)
    return NextResponse.json({ error: 'db update failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
