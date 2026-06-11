import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { tokenToSlug } from '@/lib/token'
import { sendSms } from '@/lib/sms'

export const dynamic = 'force-dynamic'

// 매일 실행: D+14 1차 + D+28 2차 힐링 리마인드 SMS
export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const cutoff14 = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const cutoff28 = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  let sent1 = 0
  let sent2 = 0

  // 1차: D+14, healing_reminder_sent_at IS NULL
  const { data: regs1 } = await supabase
    .from('mnr_registrations')
    .select('reg_id, serial_token, customer_phone, healing_photo_url, healing_reminder_sent_at')
    .is('healing_photo_url', null)
    .is('healing_reminder_sent_at', null)
    .not('customer_phone', 'is', null)

  if (regs1 && regs1.length > 0) {
    const tokens1 = regs1.map(r => r.serial_token).filter(Boolean) as string[]
    const { data: procs1 } = await supabase
      .from('mnr_procedures')
      .select('serial_token, procedure_at')
      .in('serial_token', tokens1)
      .lte('procedure_at', cutoff14)
    const dueTokens1 = new Set((procs1 ?? []).map(p => p.serial_token))

    for (const reg of regs1) {
      if (!reg.serial_token || !dueTokens1.has(reg.serial_token)) continue
      const url = `https://verify.melanoir.co.kr/v/${tokenToSlug(reg.serial_token)}`
      await sendSms(
        reg.customer_phone!,
        `[멜라누아] 힐링 사진과 후기를 등록하면 20,000 크레딧과 리터칭 잉크를 드립니다. ${url}`
      )
      await supabase
        .from('mnr_registrations')
        .update({ healing_reminder_sent_at: new Date().toISOString() })
        .eq('reg_id', reg.reg_id)
      sent1++
    }
  }

  // 2차: D+28, 1차 발송 완료 & 2차 미발송 & 힐링 사진 미등록
  const { data: regs2 } = await supabase
    .from('mnr_registrations')
    .select('reg_id, serial_token, customer_phone, healing_photo_url, healing_reminder_sent_at, healing_reminder2_sent_at')
    .is('healing_photo_url', null)
    .not('healing_reminder_sent_at', 'is', null)
    .is('healing_reminder2_sent_at', null)
    .not('customer_phone', 'is', null)

  if (regs2 && regs2.length > 0) {
    const tokens2 = regs2.map(r => r.serial_token).filter(Boolean) as string[]
    const { data: procs2 } = await supabase
      .from('mnr_procedures')
      .select('serial_token, procedure_at')
      .in('serial_token', tokens2)
      .lte('procedure_at', cutoff28)
    const dueTokens2 = new Set((procs2 ?? []).map(p => p.serial_token))

    for (const reg of regs2) {
      if (!reg.serial_token || !dueTokens2.has(reg.serial_token)) continue
      const url = `https://verify.melanoir.co.kr/v/${tokenToSlug(reg.serial_token)}`
      await sendSms(
        reg.customer_phone!,
        `[멜라누아] 리터칭 잉크 신청이 아직 완료되지 않았어요. 힐링 사진을 등록해 주세요. ${url}`
      )
      await supabase
        .from('mnr_registrations')
        .update({ healing_reminder2_sent_at: new Date().toISOString() })
        .eq('reg_id', reg.reg_id)
      sent2++
    }
  }

  return NextResponse.json({ sent: sent1 + sent2, sent1, sent2 })
}
