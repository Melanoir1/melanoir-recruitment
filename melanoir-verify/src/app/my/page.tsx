import { cookies } from 'next/headers'
import { verifySession, COOKIE_CUSTOMER } from '@/lib/session'
import MyPageClient from './MyPageClient'

export const metadata = { title: '내 등록 이력 — Melanoir' }

export default function MyPage() {
  const raw = cookies().get(COOKIE_CUSTOMER)?.value
  const phone = raw ? verifySession(raw) : null
  return <MyPageClient initialPhone={phone} />
}
