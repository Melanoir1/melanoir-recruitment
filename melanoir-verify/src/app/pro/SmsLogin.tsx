'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Step = 'phone' | 'otp' | 'register'

export default function SmsLogin() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [shopName, setShopName] = useState('')
  const [region, setRegion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    })
    setLoading(false)
    if (res.ok) {
      setStep('otp')
    } else {
      const j = await res.json()
      setError(j.error ?? '전송 실패')
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code: otp }),
    })
    const j = await res.json()
    setLoading(false)
    if (!res.ok) { setError(j.error ?? '인증 실패'); return }
    if (j.need_registration) { setStep('register'); return }
    router.refresh()
  }

  async function register(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code: otp, name, shop_name: shopName, region }),
    })
    const j = await res.json()
    setLoading(false)
    if (!res.ok) { setError(j.error ?? '등록 실패'); return }
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Melanoir Pro</h1>
          <p className="text-gray-400 text-sm mt-1">시술자 전용 포털</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          {step === 'phone' && (
            <form onSubmit={sendOtp} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">휴대폰 번호</label>
                <input
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="01012345678"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white rounded-2xl py-3 text-sm font-medium disabled:opacity-50"
              >
                {loading ? '전송 중...' : '인증번호 받기'}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={verifyOtp} className="space-y-4">
              <p className="text-sm text-gray-600">{phone}로 인증번호를 발송했습니다.</p>
              <div>
                <label className="block text-xs text-gray-500 mb-1">인증번호 6자리</label>
                <input
                  required
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white rounded-2xl py-3 text-sm font-medium disabled:opacity-50"
              >
                {loading ? '확인 중...' : '확인'}
              </button>
              <button type="button" onClick={() => setStep('phone')} className="w-full text-xs text-gray-400">
                번호 다시 입력
              </button>
            </form>
          )}

          {step === 'register' && (
            <form onSubmit={register} className="space-y-4">
              <p className="text-sm text-gray-600">처음 방문하셨습니다. 정보를 입력해주세요.</p>
              <div>
                <label className="block text-xs text-gray-500 mb-1">이름 *</label>
                <input
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="홍길동"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">샵 이름 *</label>
                <input
                  required
                  value={shopName}
                  onChange={e => setShopName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="○○ 뷰티샵"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">활동 지역</label>
                <input
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="활동 지역 (예: 서울 강남구)"
                />
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white rounded-2xl py-3 text-sm font-medium disabled:opacity-50"
              >
                {loading ? '등록 중...' : '계정 만들기'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
