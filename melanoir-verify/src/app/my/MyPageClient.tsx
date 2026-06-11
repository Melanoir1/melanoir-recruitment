'use client'
import { useState, useEffect } from 'react'

interface Registration {
  reg_id: string
  created_at: string
  credits_issued: boolean | null
  healing_credits_issued: boolean | null
  healing_photo_url: string | null
  longterm_photo_url: string | null
  serial_token: string
  mnr_procedures?: {
    procedure_at: string
    technique: string
    mnr_practitioners?: { name: string; shop_name: string } | { name: string; shop_name: string }[] | null
  } | null
}

type Step = 'phone' | 'otp' | 'data'

const TECHNIQUE_LABELS: Record<string, string> = {
  hairstroke: '헤어스트로크',
  combo: '콤보',
  machine_gradient: '머신 그라데이션',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function MyPageClient({ initialPhone }: { initialPhone: string | null }) {
  const [step, setStep]       = useState<Step>(initialPhone ? 'data' : 'phone')
  const [phone, setPhone]     = useState(initialPhone ?? '')
  const [otp, setOtp]         = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [regs, setRegs]       = useState<Registration[]>([])

  useEffect(() => { if (step === 'data') loadData() }, [step])

  async function loadData() {
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/my')
      if (res.status === 401) { setStep('phone'); return }
      const d = await res.json()
      setBalance(d.balance)
      setRegs(d.registrations)
    } catch { setError('데이터를 불러오지 못했습니다.') }
    finally { setLoading(false) }
  }

  async function sendOtp() {
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const d = await res.json()
      if (!res.ok) { setError(d.error ?? '발송 실패'); return }
      setStep('otp')
    } catch { setError('발송 중 오류') }
    finally { setLoading(false) }
  }

  async function verifyOtp() {
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp, type: 'customer' }),
      })
      const d = await res.json()
      if (!res.ok) { setError(d.error ?? '인증 실패'); return }
      setStep('data')
    } catch { setError('인증 중 오류') }
    finally { setLoading(false) }
  }

  // ── 전화번호 입력 ──────────────────────────────────────
  if (step === 'phone') return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <p className="text-xs text-gray-400 tracking-widest uppercase mb-2">Melanoir Club</p>
      <h1 className="text-2xl font-bold mb-2 tracking-tight">내 등록 이력</h1>
      <p className="text-sm text-gray-500 mb-8 text-center max-w-xs">
        시술 받을 때 등록한 휴대폰 번호로 확인합니다.
      </p>
      <div className="w-full max-w-sm space-y-3">
        <input
          type="tel" placeholder="휴대폰 번호 (숫자만)"
          value={phone} onChange={e => setPhone(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button
          onClick={sendOtp} disabled={loading || phone.replace(/\D/g, '').length < 10}
          className="w-full bg-black text-white rounded-xl py-3 text-sm font-medium disabled:opacity-40"
        >
          {loading ? '발송 중…' : '인증번호 받기'}
        </button>
      </div>
    </div>
  )

  // ── OTP 입력 ──────────────────────────────────────────
  if (step === 'otp') return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <h1 className="text-2xl font-bold mb-2 tracking-tight">인증번호 입력</h1>
      <p className="text-sm text-gray-500 mb-8 text-center">{phone}으로 발송된 6자리를 입력하세요.</p>
      <div className="w-full max-w-sm space-y-3">
        <input
          type="text" inputMode="numeric" maxLength={6} placeholder="인증번호 6자리"
          value={otp} onChange={e => setOtp(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-center tracking-widest focus:outline-none focus:border-gray-400"
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button
          onClick={verifyOtp} disabled={loading || otp.length !== 6}
          className="w-full bg-black text-white rounded-xl py-3 text-sm font-medium disabled:opacity-40"
        >
          {loading ? '확인 중…' : '확인'}
        </button>
        <button onClick={() => { setStep('phone'); setOtp('') }} className="w-full text-xs text-gray-400 py-2">
          번호 다시 입력
        </button>
      </div>
    </div>
  )

  // ── 데이터 화면 ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-4 py-10">
        {/* 헤더 */}
        <div className="mb-8">
          <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">Melanoir Club</p>
          <h1 className="text-2xl font-bold tracking-tight mb-4">내 등록 이력</h1>
          {balance !== null && (
            <div className="inline-flex items-baseline gap-1 bg-gray-50 rounded-xl px-5 py-3">
              <span className="text-xl font-bold">{balance.toLocaleString('ko-KR')}</span>
              <span className="text-sm text-gray-500">크레딧</span>
              <span className="text-xs text-gray-400 ml-2">유효기간 24개월</span>
            </div>
          )}
        </div>

        {/* 목록 */}
        {loading && <p className="text-sm text-gray-400 text-center py-12">불러오는 중…</p>}
        {error   && <p className="text-sm text-red-500 text-center py-4">{error}</p>}
        {!loading && regs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm text-gray-400 mb-4">등록된 이력이 없습니다.</p>
            <a href="https://verify.melanoir.co.kr" className="text-sm font-medium underline underline-offset-2">
              정품 등록하러 가기 →
            </a>
          </div>
        )}
        <div className="space-y-4">
          {regs.map(r => {
            const proc  = r.mnr_procedures
            const pracRaw = proc?.mnr_practitioners
            const prac  = Array.isArray(pracRaw) ? pracRaw[0] : pracRaw
            const earned =
              (r.credits_issued         ? 20000 : 0) +
              (r.healing_credits_issued ? 20000 : 0) +
              (r.longterm_photo_url     ? 10000 : 0)
            const slug = r.serial_token.replace(/-/g, '')
            return (
              <div key={r.reg_id} className="border border-gray-100 rounded-2xl p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs text-gray-400">{formatDate(r.created_at)} 등록</p>
                    {proc && (
                      <p className="text-sm font-medium mt-0.5">
                        {TECHNIQUE_LABELS[proc.technique] ?? proc.technique}
                        {prac ? ` · ${prac.shop_name}` : ''}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-semibold">+{earned.toLocaleString('ko-KR')} cr</span>
                </div>
                {/* 진행 상태 배지 */}
                <div className="flex gap-2 text-xs flex-wrap">
                  <span className={`px-2 py-1 rounded-full ${r.credits_issued ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>정품등록</span>
                  <span className={`px-2 py-1 rounded-full ${r.healing_photo_url ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>힐링</span>
                  <span className={`px-2 py-1 rounded-full ${r.longterm_photo_url ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>6개월</span>
                </div>
                {/* 미완료 단계 CTA */}
                {r.credits_issued && !r.healing_photo_url && (
                  <a href={`/v/${slug}`} className="mt-3 block text-xs text-center py-2 border border-gray-200 rounded-xl text-gray-600 hover:border-gray-400 transition-colors">
                    힐링 사진 등록 → 20,000 cr + 리터칭 잉크
                  </a>
                )}
                {r.healing_photo_url && !r.longterm_photo_url && (
                  <a href={`/v/${slug}`} className="mt-3 block text-xs text-center py-2 border border-gray-200 rounded-xl text-gray-600 hover:border-gray-400 transition-colors">
                    6개월 기록 등록 → 10,000 cr
                  </a>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
