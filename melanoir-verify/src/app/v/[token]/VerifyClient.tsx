'use client'

import { useState, useEffect } from 'react'

/* ── 타입 ── */
interface PractitionerData {
  name: string
  shop_name: string
  region: string | null
}

interface ProcedureData {
  procedure_at: string
  technique: string
  mnr_practitioners: PractitionerData | PractitionerData[] | null
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
    longterm_photo_url: string | null
    credits_issued: boolean | null
    healing_credits_issued: boolean | null
  } | null
}

type Step =
  | 'role'           // 첫 화면: 시술자 / 고객 선택
  | 'pro_phone'      // 시술자: 전화번호 입력
  | 'pro_otp'        // 시술자: OTP 확인
  | 'pro_info'       // 시술자: 최초 방문 — 이름·샵 등록
  | 'pro_procedure'  // 시술자: 시술 정보 입력
  | 'pro_done'       // 시술자: 시술 등록 완료
  | 'no_procedure'   // 고객: 시술자 미등록 안내
  | 'register'       // 고객: 정품 등록 폼
  | 'healing'        // 고객: 힐링 사진 업로드
  | 'longterm'       // 고객: 6개월 경과 사진 업로드
  | 'done'           // 완료 (크레딧 지급)
  | 'complete'       // 모든 등록 완료

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

/* ── 메인 컴포넌트 ── */
export default function VerifyClient({ data }: { data: VerifyData }) {
  const { token, lot, shipment, procedure, registration } = data

  /* 초기 step 결정 */
  function initialStep(): Step {
    if (registration?.healing_photo_url && registration?.longterm_photo_url) return 'complete'
    return 'role'
  }

  const [step, setStep] = useState<Step>(initialStep)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [creditsEarned, setCreditsEarned] = useState(0)

  /* 시술자 로그인 상태 */
  const [proPhone, setProPhone] = useState('')
  const [proOtp, setProOtp] = useState('')
  const [proName, setProName] = useState('')
  const [proShop, setProShop] = useState('')
  const [proRegion, setProRegion] = useState('')
  const [practitionerId, setPractitionerId] = useState<string | null>(null)

  /* 시술 정보 */
  const [technique, setTechnique] = useState('hairstroke')
  const [procedureAt, setProcedureAt] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [customerPhone, setCustomerPhone] = useState('')
  const [procArea, setProcArea] = useState('eyebrow')
  const [procIsRetouch, setProcIsRetouch] = useState(false)
  const [showProDetail, setShowProDetail] = useState(false)
  const [procSkinType, setProcSkinType] = useState('')
  const [procDeviceType, setProcDeviceType] = useState('')
  const [procNeedle, setProcNeedle] = useState('')
  const [procDilution, setProcDilution] = useState('')

  /* 고객 등록 폼 */
  const [custName, setCustName] = useState('')
  const [custPhone, setCustPhone] = useState('')
  const [custPhoto, setCustPhoto] = useState<File | null>(null)
  const [photoConsent, setPhotoConsent] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [healingReview, setHealingReview] = useState('')
  const [longtermReview, setLongtermReview] = useState('')
  const [longtermSatisfaction, setLongtermSatisfaction] = useState(0)
  const [creditBalance, setCreditBalance] = useState<number | null>(null)

  const practitioner = procedure?.mnr_practitioners
    ? Array.isArray(procedure.mnr_practitioners)
      ? procedure.mnr_practitioners[0]
      : procedure.mnr_practitioners
    : null

  /* ── 시술자: OTP 전송 ── */
  async function sendOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: proPhone }),
    })
    setLoading(false)
    if (res.ok) { setStep('pro_otp') }
    else { const j = await res.json(); setError(j.error ?? '전송 실패') }
  }

  /* ── 시술자: OTP 확인 ── */
  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: proPhone, code: proOtp }),
    })
    const j = await res.json()
    setLoading(false)
    if (!res.ok) { setError(j.error ?? '인증 실패'); return }
    if (j.need_registration) { setStep('pro_info'); return }
    setPractitionerId(j.practitioner.practitioner_id)
    setStep('pro_procedure')
  }

  /* ── 시술자: 최초 등록 ── */
  async function registerPro(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: proPhone, code: proOtp, name: proName, shop_name: proShop, region: proRegion }),
    })
    const j = await res.json()
    setLoading(false)
    if (!res.ok) { setError(j.error ?? '등록 실패'); return }
    setPractitionerId(j.practitioner.practitioner_id)
    setStep('pro_procedure')
  }

  /* ── 시술자: 시술 등록 ── */
  async function submitProcedure(e: React.FormEvent) {
    e.preventDefault()
    if (!practitionerId) return
    setLoading(true); setError(null)
    const res = await fetch('/api/procedure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        practitioner_id: practitionerId,
        procedure_at: procedureAt,
        technique,
        customer_phone: customerPhone || null,
        area: procArea,
        is_retouch: procIsRetouch,
        skin_type: procSkinType || null,
        device_type: procDeviceType || null,
        needle_type: procNeedle || null,
        dilution: procDilution || null,
      }),
    })
    const j = await res.json()
    setLoading(false)
    if (!res.ok) { setError(j.error ?? '등록 실패'); return }
    setStep('pro_done')
  }

  /* ── 고객: 역할 선택 후 분기 ── */
  function selectCustomer() {
    if (!procedure) { setStep('no_procedure'); return }
    if (registration?.healing_photo_url) {
      setStep(registration?.longterm_photo_url ? 'complete' : 'longterm')
      return
    }
    if (registration) { setStep('healing'); return }
    setStep('register')
  }

  useEffect(() => {
    if (step !== 'complete') return
    fetch(`/api/credits/balance?token=${encodeURIComponent(token)}`)
      .then(r => r.ok ? r.json() : null)
      .then(j => { if (j?.balance != null) setCreditBalance(j.balance) })
      .catch(() => {})
  }, [step, token])

  /* ── 고객: 정품 등록 ── */
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!custPhoto) { setError('시술 부위 사진을 첨부해주세요.'); return }
    if (!photoConsent) { setError('시술 부위 사진 수집·이용 동의가 필요합니다.'); return }
    setLoading(true); setError(null)
    const formData = new FormData()
    formData.append('token', token)
    formData.append('customer_name', custName)
    formData.append('customer_phone', custPhone)
    formData.append('photo_consent', String(photoConsent))
    formData.append('marketing_consent', String(marketingConsent))
    formData.append('photo', custPhoto)
    const res = await fetch('/api/registration', { method: 'POST', body: formData })
    const j = await res.json()
    setLoading(false)
    if (!res.ok) { setError(j.error ?? '등록 실패'); return }
    setCreditsEarned(j.credits_earned ?? 0)
    setStep('done')
  }

  /* ── 고객: 힐링 사진 업로드 ── */
  const [healingFile, setHealingFile] = useState<File | null>(null)
  const [longtermFile, setLongtermFile] = useState<File | null>(null)
  async function handleLongterm(e: React.FormEvent) {
    e.preventDefault()
    if (longtermSatisfaction === 0) { setError('만족도를 선택해주세요.'); return }
    setLoading(true); setError(null)
    const formData = new FormData()
    formData.append('token', token)
    formData.append('satisfaction', String(longtermSatisfaction))
    if (longtermReview.trim()) formData.append('review_text', longtermReview)
    if (longtermFile) formData.append('longterm_photo', longtermFile)
    const res = await fetch('/api/registration/longterm', { method: 'POST', body: formData })
    const j = await res.json()
    setLoading(false)
    if (!res.ok) { setError(j.error ?? '업로드 실패'); return }
    setCreditsEarned(j.credits_earned ?? 0)
    setStep('done')
  }
  async function handleHealing(e: React.FormEvent) {
    e.preventDefault()
    if (!healingReview.trim()) { setError('후기를 입력해주세요.'); return }
    setLoading(true); setError(null)
    const formData = new FormData()
    formData.append('token', token)
    formData.append('review_text', healingReview)
    if (healingFile) formData.append('healing_photo', healingFile)
    const res = await fetch('/api/registration/healing', { method: 'POST', body: formData })
    const j = await res.json()
    setLoading(false)
    if (!res.ok) { setError(j.error ?? '업로드 실패'); return }
    setCreditsEarned(j.credits_earned ?? 0)
    setStep('done')
  }

  /* ── 공통 UI 요소 ── */
  const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white rounded-2xl p-6 shadow-sm ${className}`}>{children}</div>
  )

  const PrimaryBtn = ({ children, disabled, type = 'submit' }: {
    children: React.ReactNode; disabled?: boolean; type?: 'submit' | 'button'
  }) => (
    <button
      type={type}
      disabled={disabled}
      className="w-full bg-black text-white rounded-2xl py-3.5 text-sm font-medium disabled:opacity-40 hover:bg-gray-900 transition-colors"
    >
      {children}
    </button>
  )

  const GhostBtn = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
    <button type="button" onClick={onClick} className="w-full text-xs text-gray-400 mt-2 hover:text-gray-600">
      {children}
    </button>
  )

  const InputField = ({ label, required, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}{required && ' *'}</label>
      <input
        required={required}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        {...props}
      />
    </div>
  )

  /* ── 제품 정보 카드 (공통) ── */
  const ProductCard = () => (
    <Card className="mb-4">
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
    </Card>
  )

  /* ── 렌더 ── */
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">

        {/* 정품 배지 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm font-medium mb-4">
            <span>✓</span><span>정품 인증</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">멜라누아 엠보</h1>
          <p className="text-gray-400 text-xs mt-1 font-mono">{token}</p>
        </div>

        {/* ══ 역할 선택 ══ */}
        {step === 'role' && (
          <>
            <ProductCard />
            <div className="space-y-3">
              <button
                onClick={() => setStep('pro_phone')}
                className="w-full bg-black text-white rounded-2xl py-4 text-sm font-medium hover:bg-gray-900 transition-colors"
              >
                시술자입니다
              </button>
              <button
                onClick={selectCustomer}
                className="w-full bg-white border border-gray-200 text-gray-900 rounded-2xl py-4 text-sm font-medium hover:border-gray-400 transition-colors"
              >
                시술을 받았습니다 (고객)
              </button>
            </div>
          </>
        )}

        {/* ══ 시술자: 전화번호 ══ */}
        {step === 'pro_phone' && (
          <Card>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">멜라누아 프로 — 시술 등록</p>
            <form onSubmit={sendOtp} className="space-y-4">
              <InputField label="휴대폰 번호" required value={proPhone} onChange={e => setProPhone(e.target.value)} placeholder="01012345678" />
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <PrimaryBtn disabled={loading}>{loading ? '전송 중...' : '인증번호 받기'}</PrimaryBtn>
              <GhostBtn onClick={() => setStep('role')}>← 돌아가기</GhostBtn>
            </form>
          </Card>
        )}

        {/* ══ 시술자: OTP ══ */}
        {step === 'pro_otp' && (
          <Card>
            <p className="text-sm text-gray-600 mb-4">{proPhone}로 인증번호를 발송했습니다.</p>
            <form onSubmit={verifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">인증번호 6자리 *</label>
                <input
                  required value={proOtp} onChange={e => setProOtp(e.target.value)}
                  placeholder="000000" maxLength={6}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <PrimaryBtn disabled={loading}>{loading ? '확인 중...' : '확인'}</PrimaryBtn>
              <GhostBtn onClick={() => setStep('pro_phone')}>번호 다시 입력</GhostBtn>
            </form>
          </Card>
        )}

        {/* ══ 시술자: 최초 등록 ══ */}
        {step === 'pro_info' && (
          <Card>
            <p className="text-sm text-gray-600 mb-4">처음 방문하셨습니다. 정보를 입력해주세요.</p>
            <form onSubmit={registerPro} className="space-y-4">
              <InputField label="이름" required value={proName} onChange={e => setProName(e.target.value)} placeholder="홍길동" />
              <InputField label="샵 이름" required value={proShop} onChange={e => setProShop(e.target.value)} placeholder="○○ 뷰티샵" />
              <InputField label="활동 지역" value={proRegion} onChange={e => setProRegion(e.target.value)} placeholder="활동 지역 (예: 서울 강남구)" />
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <PrimaryBtn disabled={loading}>{loading ? '등록 중...' : '계속'}</PrimaryBtn>
            </form>
          </Card>
        )}

        {/* ══ 시술자: 시술 정보 입력 ══ */}
        {step === 'pro_procedure' && (
          <Card>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">시술 정보 등록</p>
            <form onSubmit={submitProcedure} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">시술 기법 *</label>
                <select
                  value={technique}
                  onChange={e => setTechnique(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="hairstroke">헤어스트로크</option>
                  <option value="combo">콤보</option>
                  <option value="machine_gradient">머신 그라데이션</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">시술일 *</label>
                <input
                  type="date" required
                  value={procedureAt}
                  onChange={e => setProcedureAt(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">시술 부위 *</label>
                <select
                  value={procArea} onChange={e => setProcArea(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="eyebrow">눈썹</option>
                  <option value="eyeliner">아이라인</option>
                  <option value="lip">입술</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">시술 구분 *</label>
                <select
                  value={procIsRetouch ? 'retouch' : 'first'}
                  onChange={e => setProcIsRetouch(e.target.value === 'retouch')}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="first">첫 시술</option>
                  <option value="retouch">리터치</option>
                </select>
              </div>
              <div className="border border-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setShowProDetail(v => !v)}
                  className="w-full px-4 py-3 text-xs text-left text-gray-600 font-medium"
                >
                  {showProDetail ? '▾' : '▸'} 상세 데이터 입력 (선택 — 2개 이상 작성 시 프로 1,000P)
                </button>
                {showProDetail && (
                  <div className="px-4 pb-4 space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">고객 피부 타입</label>
                      <select
                        value={procSkinType} onChange={e => setProcSkinType(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="">선택 안 함</option>
                        <option value="oily">지성</option>
                        <option value="dry">건성</option>
                        <option value="combination">복합성</option>
                        <option value="sensitive">민감성</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">시술 방식</label>
                      <select
                        value={procDeviceType} onChange={e => setProcDeviceType(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="">선택 안 함</option>
                        <option value="machine">머신</option>
                        <option value="manual">수지</option>
                      </select>
                    </div>
                    <InputField label="니들 종류" value={procNeedle} onChange={e => setProcNeedle(e.target.value)} placeholder="예: 1R 0.25" />
                    <InputField label="희석 비율" value={procDilution} onChange={e => setProcDilution(e.target.value)} placeholder="예: 원액 / 1:1" />
                  </div>
                )}
              </div>
              <InputField
                label="고객 연락처 (선택)"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="01012345678"
              />
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <PrimaryBtn disabled={loading}>{loading ? '등록 중...' : '시술 등록'}</PrimaryBtn>
            </form>
          </Card>
        )}

        {/* ══ 시술자: 등록 완료 ══ */}
        {step === 'pro_done' && (
          <Card className="text-center">
            <div className="text-4xl mb-4">✓</div>
            <h2 className="text-lg font-semibold mb-2">시술 등록 완료</h2>
            <p className="text-sm text-gray-500">고객이 QR을 스캔하면 정품 등록과 크레딧 지급이 진행됩니다.</p>
          </Card>
        )}

        {/* ══ 고객: 시술자 미등록 안내 ══ */}
        {step === 'no_procedure' && (
          <Card>
            <div className="text-center py-2">
              <div className="text-3xl mb-4">⚠️</div>
              <h2 className="text-base font-semibold mb-2">시술 등록 전입니다</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                정품 등록은 시술자가 먼저 QR을 통해 시술을 등록한 후 이용할 수 있습니다.<br /><br />
                <strong>시술자에게 QR 등록을 먼저 요청해주세요.</strong>
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <GhostBtn onClick={() => setStep('role')}>← 처음으로</GhostBtn>
            </div>
          </Card>
        )}

        {/* ══ 고객: 정품 등록 폼 ══ */}
        {step === 'register' && (
          <>
            <ProductCard />
            <form onSubmit={handleRegister} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">정품 등록 — 크레딧 받기</p>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  시술 직후 사진으로 <strong className="text-black">정품 시술 여부를 확인</strong>합니다.
                  확인된 고객은 힐링 완료 시 <strong className="text-black">리터칭 케어(잉크 무상 지급) 대상</strong>이 됩니다.
                  등록 완료 시 <strong className="text-black">20,000 크레딧</strong>이 적립됩니다.
                </p>
              </div>
              <InputField label="이름" required value={custName} onChange={e => setCustName(e.target.value)} placeholder="홍길동" />
              <InputField label="연락처" required value={custPhone} onChange={e => setCustPhone(e.target.value)} placeholder="01012345678" />
              <div>
                <div className="flex items-start gap-3 rounded-xl bg-gray-50 border border-gray-200 p-3 mb-3">
                  <img
                    src="https://res.cloudinary.com/dssuxurpt/image/upload/v1781193672/review_example_yy8hfg.jpg"
                    alt="시술 부위 사진 예시"
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <p className="text-xs text-gray-500 leading-relaxed">
                    예시처럼 시술 부위(눈썹)만 선명히 보이면 됩니다.<br />
                    <strong className="text-black">얼굴 전체 사진은 필요하지 않습니다.</strong>
                  </p>
                </div>
                <label className="block text-xs text-gray-500 mb-1">시술 부위 사진 *</label>
                <input
                  type="file" accept="image/*" required
                  onChange={e => setCustPhoto(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700"
                />
              </div>
              <div className="space-y-2 pt-1">
                <label className="flex items-start gap-2 text-xs text-gray-600">
                  <input type="checkbox" checked={photoConsent} onChange={e => setPhotoConsent(e.target.checked)} className="mt-0.5" />
                  <span>[필수] 실고객 확인을 위한 시술 부위 사진 수집·이용에 동의합니다</span>
                </label>
                <label className="flex items-start gap-2 text-xs text-gray-500">
                  <input type="checkbox" checked={marketingConsent} onChange={e => setMarketingConsent(e.target.checked)} className="mt-0.5" />
                  <span>[선택] 사례 소개(마케팅) 활용에 동의합니다</span>
                </label>
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <PrimaryBtn disabled={loading || !custPhoto || !photoConsent}>
                {loading ? '등록 중...' : '등록 완료'}
              </PrimaryBtn>
              <GhostBtn onClick={() => setStep('role')}>← 돌아가기</GhostBtn>
            </form>
          </>
        )}

        {/* ══ 고객: 힐링 사진 업로드 ══ */}
        {step === 'healing' && (
          <form onSubmit={handleHealing} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">힐링 완료 사진</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              힐링 사진과 후기를 등록하면 <strong className="text-black">20,000 크레딧과 리터칭 잉크</strong>를 드립니다.
              시술 후 <strong className="text-black">7~30일 사이</strong> 등록을 권장합니다.
            </p>
            <div>
              <p className="text-xs text-gray-400 mb-2">시술 부위만 선명히 — 얼굴 전체 사진은 필요하지 않습니다.</p>
              <label className="block text-xs text-gray-500 mb-1">힐링 사진 *</label>
              <input
                type="file" accept="image/*" required
                onChange={e => setHealingFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">후기 *</label>
              <textarea
                required value={healingReview} onChange={e => setHealingReview(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                rows={3} placeholder="시술 경험과 힐링 결과를 들려주세요"
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <PrimaryBtn disabled={loading || !healingReview.trim()}>
              {loading ? '업로드 중...' : '등록 완료'}
            </PrimaryBtn>
            <GhostBtn onClick={() => setStep('role')}>← 돌아가기</GhostBtn>
          </form>
        )}

        {/* ══ 고객: 6개월 경과 사진 ══ */}
        {step === 'longterm' && (
          <form onSubmit={handleLongterm} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">6개월 기록</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              6개월이 지난 지금의 사진과 한 줄 평을 남겨주세요.
              <strong className="text-black"> 10,000 크레딧</strong>을 드립니다.
            </p>
            <div>
              <p className="text-xs text-gray-400 mb-2">시술 부위만 선명히 — 얼굴 전체 사진은 필요하지 않습니다.</p>
              <label className="block text-xs text-gray-500 mb-1">현재 사진 *</label>
              <input
                type="file" accept="image/*" required
                onChange={e => setLongtermFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">한 줄 후기 (선택)</label>
              <input
                value={longtermReview} onChange={e => setLongtermReview(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="지금 발색·만족도를 한 줄로 남겨주세요"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">만족도 *</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n} type="button"
                    onClick={() => setLongtermSatisfaction(n)}
                    className={`flex-1 py-3 rounded-xl border text-lg transition-colors ${
                      longtermSatisfaction >= n ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-300'
                    }`}
                  >★</button>
                ))}
              </div>
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <PrimaryBtn disabled={loading || longtermSatisfaction === 0}>
              {loading ? '업로드 중...' : '등록 완료'}
            </PrimaryBtn>
            <GhostBtn onClick={() => setStep('role')}>← 돌아가기</GhostBtn>
          </form>
        )}

        {/* ══ 크레딧 지급 완료 ══ */}
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

        {/* ══ 모든 등록 완료 ══ */}
        {step === 'complete' && (
          <>
            <ProductCard />
            <Card className="text-center">
              <p className="text-sm text-gray-500 mb-3">모든 등록이 완료되었습니다. 감사합니다.</p>
              {creditBalance != null && (
                <p className="text-sm text-gray-600">
                  누적 <span className="font-semibold text-black">{creditBalance.toLocaleString()} 크레딧</span>
                  {' · '}유효기간 24개월
                </p>
              )}
            </Card>
          </>
        )}

        <p className="text-center text-xs text-gray-300 mt-8">Melanoir · melanoir.co.kr</p>
      </div>
    </main>
  )
}
