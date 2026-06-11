import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySession, COOKIE_PRO } from '@/lib/session'
import { getCreditBalance } from '@/lib/credits'

export async function GET() {
  const raw = cookies().get(COOKIE_PRO)?.value
  const practitionerId = raw ? verifySession(raw) : null
  if (!practitionerId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  const balance = await getCreditBalance('practitioner', practitionerId)
  return NextResponse.json({ balance })
}
