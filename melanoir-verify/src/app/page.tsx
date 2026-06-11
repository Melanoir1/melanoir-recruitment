'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [serial, setSerial] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // 영숫자만 추출 후 4자리씩 하이픈 포맷
    const clean = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16)
    const formatted = clean.match(/.{1,4}/g)?.join('-') ?? clean
    setSerial(formatted)
    setError(null)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const slug = serial.replace(/-/g, '')
    if (slug.length !== 16) {
      setError('시리얼 번호 16자리를 정확히 입력해주세요.')
      return
    }
    router.push(`/v/${slug}`)
  }

  const isReady = serial.replace(/-/g, '').length === 16

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-16">

      {/* 로고 */}
      <p className="mb-12 text-xs font-bold uppercase text-gray-400" style={{ letterSpacing: '0.2em' }}>
        Melanoir
      </p>

      {/* 헤딩 */}
      <div className="text-center mb-10">
        <h1
          className="font-bold mb-3 leading-tight"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 8vw, 3.5rem)' }}
        >
          정품 확인.
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          보증서의 QR 코드를 스캔하거나<br />
          시리얼 번호를 직접 입력하세요.
        </p>
      </div>

      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
        <input
          value={serial}
          onChange={handleChange}
          placeholder="A7K2-9X4M-3P8Q-XXXX"
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="characters"
          className="w-full border border-gray-200 rounded-sm px-4 py-3.5 text-sm font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-black transition-shadow"
        />
        {error && <p className="text-xs text-red-500 text-center">{error}</p>}
        <button
          type="submit"
          disabled={!isReady}
          className="w-full bg-black text-white rounded-sm py-3.5 text-sm font-semibold disabled:opacity-30 hover:bg-gray-900 transition-colors"
        >
          정품 확인하기
        </button>
      </form>

      {/* OR 구분선 */}
      <div className="w-full max-w-sm my-8 flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-300">또는</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <p className="text-xs text-gray-400 text-center leading-relaxed">
        제품 보증서의 QR 코드를 스캔하면<br />
        이 페이지를 거치지 않고 바로 이동합니다.
      </p>

      {/* 하단 링크 */}
      <nav className="mt-16 flex gap-6 text-xs text-gray-300">
        <a href="https://melanoir.co.kr" className="hover:text-gray-500 transition-colors">melanoir.co.kr</a>
        <a href="https://melanoir.co.kr/register" className="hover:text-gray-500 transition-colors">정품 등록 안내</a>
        <a href="https://melanoir.co.kr/pro" className="hover:text-gray-500 transition-colors">멜라누아 프로</a>
      </nav>

    </main>
  )
}
