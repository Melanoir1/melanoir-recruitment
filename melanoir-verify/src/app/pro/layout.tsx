import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Melanoir Pro — 시술자 포털',
}

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
