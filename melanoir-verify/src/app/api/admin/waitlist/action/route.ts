import { NextRequest, NextResponse } from 'next/server'
import { createRawServiceClient } from '@/lib/supabase'
import { sendSms } from '@/lib/sms'

const INSTAGRAM_HANDLE = process.env.INSTAGRAM_OFFICIAL_HANDLE ?? '@melanoir_official'

// 혼동 문자(0/O/1/I/L) 제외 4자리
function generateDmCode(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return 'MNR-' + s
}

export async function POST(req: NextRequest) {
  let body: { id?: number; action?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 })
  }
  const { id, action } = body
  if (!id || !action || !['select', 'confirm_dm'].includes(action)) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 })
  }

  const supabase = createRawServiceClient()
  const { data: row } = await supabase
    .from('mnr_waitlist')
    .select('id, type, phone, name, instagram, status, dm_code')
    .eq('id', id)
    .single()

  if (!row || row.type !== 'beta') {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  const now = new Date().toISOString()

  if (action === 'select') {
    // 재발송 시 기존 코드 유지 (코드가 바뀌면 이미 DM 보낸 신청자와 어긋남)
    const code = row.dm_code ?? generateDmCode()
    const { error } = await supabase
      .from('mnr_waitlist')
      .update({ status: 'selected', dm_code: code, dm_code_sent_at: now, updated_at: now })
      .eq('id', id)
    if (error) {
      return NextResponse.json({ error: 'update failed' }, { status: 500 })
    }
    await sendSms(
      row.phone,
      `[멜라누아] 베타테스터에 선정되었습니다! 본인 확인을 위해, 신청하신 인스타그램 계정(@${row.instagram})으로 ${INSTAGRAM_HANDLE} 계정에 인증 코드 ${code} 를 DM으로 보내주세요. DM 확인 후 최종 확정됩니다.`
    )
    return NextResponse.json({ success: true, dm_code: code })
  }

  // confirm_dm: 관리자가 인스타 DM에서 코드 수신을 직접 확인한 뒤 누른다
  const { error } = await supabase
    .from('mnr_waitlist')
    .update({ status: 'confirmed', dm_verified_at: now, updated_at: now })
    .eq('id', id)
  if (error) {
    return NextResponse.json({ error: 'update failed' }, { status: 500 })
  }
  await sendSms(
    row.phone,
    '[멜라누아] DM 인증이 확인되어 베타테스터로 최종 확정되었습니다. 샘플 발송 일정은 문자로 안내드릴게요.'
  )
  return NextResponse.json({ success: true })
}
