import { cookies } from 'next/headers'
import { verifySession, COOKIE_PRO } from '@/lib/session'
import { createServiceClient } from '@/lib/supabase'
import Dashboard from './Dashboard'
import SmsLogin from './SmsLogin'

export default async function ProPage() {
  const raw = cookies().get(COOKIE_PRO)?.value
  const practitionerId = raw ? verifySession(raw) : null
  if (practitionerId) {
    const supabase = createServiceClient()
    const { data: practitioner } = await supabase
      .from('mnr_practitioners')
      .select('practitioner_id, name, shop_name, phone, tier')
      .eq('practitioner_id', practitionerId)
      .single()
    if (practitioner) {
      return (
        <Dashboard
          practitionerId={practitionerId}
          practitioner={{ ...practitioner, tier: practitioner.tier ?? 'basic' }}
        />
      )
    }
  }
  return <SmsLogin />
}
