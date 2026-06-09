'use client'

import { useState } from 'react'

interface PractitionerData {
  name: string
  shop_name: string
  region: string | null
}

interface ProcedureData {
  procedure_at: string
  technique: string
  practitioners: PractitionerData | PractitionerData[] | null
}

interface VerifyData {
  token: string
  product: { lot_id: string | null; internal_id: number }
  lot: { manufactured_at: string; lot_id: string } | null
  shipment: { delivered_at: string | null; shipped_at: string | null } | null
  procedure: ProcedureData | null
  registration: {
    reg_id: string
    customer_name: string | null
    review_text: string | null
    photo_url: string | null
    healing_photo_url: string | null
    credits_issued: boolean
    healing_credits_issued: boolean
  } | null
}

const TECHNIQUE_LABELS: Record<string, string> = {
  hairstroke: '헤어스트로크',
  combo: '콤보',
  machine_gradient: '머신 그라데이션',
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  )
}

export default function VerifyClient({ data }: { data: VerifyData }) {
  const { token, lot, shipment, procedure, registration } = data
  const [step, setStep] = useState<'view' | 'register' | 'healing' | 'done'>('view')
  const [form, setForm] = useState({ name: '', phone: '', review: '' })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [healingFile, setHealingFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [creditsEarned, setCreditsEarned] = useState(0)

  const practitioner = procedure?.practitioners
    ? Array.isArray(procedure.practitioners)
      ? procedure.practitioners[0]
      : procedure.practitioners
    : null

  const isAuthentic = true // 토큰 검증은 서버에서 완료

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('token', token)
      formData.append('customer_name', form.name)
      formData.append('customer_phone', form.phone)
      formData.append('review_text', form.review)
      if (photoFile) formData.append('photo', photoFile)

      const res = await fetch('/api/registration', { method: 'POST', body: formData })
      const json = await res.json()

      if (!res.ok) throw new Error(json.error ?? '등록 실패')

      setCreditsEarned(json.credits_earned ?? 0)
      setStep('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  async function handleHealing(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('token', token)
      if (healingFile) formData.append('healing_photo', healingFile)

      const res = await fetch('/api/registration/healing', { method: 'POST', body: formData })
      const json = await res.json()

      if (!res.ok) throw new Error(json.error ?? '업로드 실패')

      setCreditsEarned(json.credits_earned ?? 0)
      setStep('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">

        {/* 정품 배지 */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${
            isAuthentic ? 'bg-black text-white' : 'bg-red-100 text-red-700'
          }`}>
            <span>{isAuthentic ? '✓' : '✗'}</span>
            <span>{isAuthentic ? '정품 인증' : '인증 실패'}</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">멜라누아 엠보</h1>
          <p className="text-gray-400 text-xs mt-1 font-mono">{token}</p>
        </div>

        {/* 제품 정보 카드 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">제품 이력</h2>
          <InfoRow label="제조일" value={formatDate(lot?.manufactured_at)} />
          <InfoRow label="배송 완료" value={formatDate(shipment?.delivered_at)} />
          {procedure ? (
            <>
              <InfoRow label="시술일" value={formatDate(procedure.procedure_at)} />
              <InfoRow label="시술 기법" value={TECHNIQUE_LABELS[procedure.technique] ?? procedure.technique} />
              {practitioner && (
                <>
                  <InfoRow label="시술자" value={practitioner.name} />
                  <InfoRow label="샵" value={`${practitioner.shop_name}${practitioner.region ? ` (${practitioner.region})` : ''}`} />
                </>
              )}
            </>
          ) : (
            <div className="py-3 text-sm text-gray-400">시술자 등록 대기 중</div>
          )}
        </div>

        {/* 고객 등록 섹션 */}
        {step === 'view' && !registration && procedure && (
          <button
            onClick={() => setStep('register')}
            className="w-full bg-black text-white rounded-2xl py-4 text-sm font-medium hover:bg-gray-900 transition-colors"
          >
            정품 등록하고 크레딧 받기
          </button>
        )}

        {step === 'view' && registration && !registration.healing_photo_url && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
            <p className="text-sm text-gray-600 mb-4">
              정품 등록이 완료되었습니다. 힐링 후 사진을 업로드하면 추가 크레딧과 리터칭 잉크를 받으실 수 있습니다.
            </p>
            <button
              onClick={() => setStep('healing')}
              className="w-full bg-black text-white rounded-2xl py-3 text-sm font-medium hover:bg-gray-900 transition-colors"
            >
              힐링 완료 사진 업로드
            </button>
          </div>
        )}

        {step === 'view' && registration?.healing_photo_url && (
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <p className="text-sm text-gray-500">모든 등록이 완료되었습니다. 감사합니다.</p>
          </div>
        )}

        {/* 등록 폼 */}
        {step === 'register' && (
          <form onSubmit={handleRegister} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold mb-2">정품 등록</h2>
            <div>
              <label className="block text-xs text-gray-500 mb-1">이름 *</label>
              <input
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="홍길동"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">연락처 *</label>
              <input
                required
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="01012345678"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">후기 (선택)</label>
              <textarea
                value={form.review}
                onChange={e => setForm(f => ({ ...f, review: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                rows={3}
                placeholder="시술 후 느낌을 자유롭게 작성해주세요."
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">시술 직후 사진 (선택)</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setPhotoFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700"
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-2xl py-3 text-sm font-medium disabled:opacity-50 hover:bg-gray-900 transition-colors"
            >
              {loading ? '등록 중...' : '등록 완료'}
            </button>
          </form>
        )}

        {/* 힐링 사진 업로드 */}
        {step === 'healing' && (
          <form onSubmit={handleHealing} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold mb-2">힐링 완료 사진</h2>
            <p className="text-xs text-gray-500">힐링 후 눈썹 사진을 업로드해주세요. 확인 후 리터칭 잉크를 발송해드립니다.</p>
            <div>
              <input
                type="file"
                accept="image/*"
                required
                onChange={e => setHealingFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700"
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-2xl py-3 text-sm font-medium disabled:opacity-50 hover:bg-gray-900 transition-colors"
            >
              {loading ? '업로드 중...' : '사진 업로드'}
            </button>
          </form>
        )}

        {/* 완료 */}
        {step === 'done' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <div className="text-4xl mb-4">✓</div>
            <h2 className="text-lg font-semibold mb-2">완료!</h2>
            {creditsEarned > 0 && (
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-black">{creditsEarned.toLocaleString()} 크레딧</span>이 적립되었습니다.
              </p>
            )}
          </div>
        )}

        <p className="text-center text-xs text-gray-300 mt-8">Melanoir · melanoir.co.kr</p>
      </div>
    </main>
  )
}
