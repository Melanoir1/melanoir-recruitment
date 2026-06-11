import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { tokenToSlug } from '@/lib/token'
import { sendSms } from '@/lib/sms'

export const dynamic = 'force-dynamic'

// 매일 실행: 시술일 D+180 경과 & 힐링 완료 & 6개월 사진 미등록 & 리마인드 미발송 → SMS 1회 발송
export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const cutoff = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const { data: regs } = await supabase
    .from('mnr_registrations')
    .select('reg_id, serial_token, customer_phone, longterm_photo_url, longterm_reminder_sent_at')
    .not('healing_photo_url', 'is', null)
    .is('longterm_photo_url', null)
    .is('longterm_reminder_sent_at', null)
    .not('customer_phone', 'is', null)
  if (!regs || regs.length === 0) return NextResponse.json({ sent: 0 })

  const tokens = regs.map(r => r.serial_token).filter(Boolean) as string[]
  const { data: procs } = await supabase
    .from('mnr_procedures')
    .select('serial_token, procedure_at')
    .in('serial_token', tokens)
    .lte('procedure_at', cutoff)
  const dueTokens = new Set((procs ?? []).map(p => p.serial_token))

  let sent = 0
  for (const reg of regs) {
    if (!reg.serial_token || !dueTokens.has(reg.serial_token)) continue
    const url = `https://verify.melanoir.co.kr/v/${tokenToSlug(reg.serial_token)}`
    await sendSms(
      reg.customer_phone!,
      `[멜라누아] 시술 6개월, 발색은 어떤가요? 현재 사진과 한 줄 평을 등록하면 10,000 크레딧을 드립니다. ${url}`
    )
    await supabase
      .from('mnr_registrations')
      .update({ longterm_reminder_sent_at: new Date().toISOString() })
      .eq('reg_id', reg.reg_id)
    sent++
  }
  return NextResponse.json({ sent })
}
