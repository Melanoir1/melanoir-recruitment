'use client'

import { useState } from 'react'
import SmsLogin from './SmsLogin'
import Dashboard from './Dashboard'

export interface Practitioner {
  practitioner_id: string
  name: string
  shop_name: string
  phone: string
  tier: string
}

export default function ProPage() {
  const [practitioner, setPractitioner] = useState<Practitioner | null>(null)

  if (!practitioner) {
    return <SmsLogin onLogin={setPractitioner} />
  }

  return <Dashboard practitioner={practitioner} onLogout={() => setPractitioner(null)} />
}
