import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

function tierFromCount(count: number): 'basic' | 'silver' | 'gold' | 'partner' {
  if (count >= 24) return 'partner'
  if (count >= 12) return 'gold'
  if (count >= 6) return 'silver'
  return 'basic'
}

// 매일 실행: 최근 6개월 시술 등록 횟수로 시술자 등급 갱신
export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  const cutoff = sixMonthsAgo.toISOString().split('T')[0]

  const { data: practitioners } = await supabase
    .from('mnr_practitioners')
    .select('practitioner_id, tier')

  if (!practitioners || practitioners.length === 0) {
    return NextResponse.json({ updated: 0 })
  }

  let updated = 0
  for (const p of practitioners) {
    const { count } = await supabase
      .from('mnr_procedures')
      .select('procedure_id', { count: 'exact', head: true })
      .eq('practitioner_id', p.practitioner_id)
      .gte('procedure_at', cutoff)

    const newTier = tierFromCount(count ?? 0)
    if (newTier !== p.tier) {
      await supabase
        .from('mnr_practitioners')
        .update({ tier: newTier, tier_updated_at: new Date().toISOString() })
        .eq('practitioner_id', p.practitioner_id)
      updated++
    }
  }

  return NextResponse.json({ updated })
}
