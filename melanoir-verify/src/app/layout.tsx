import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Melanoir — 정품 확인',
  description: '멜라누아 엠보 정품 여부를 확인하세요.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  )
}
