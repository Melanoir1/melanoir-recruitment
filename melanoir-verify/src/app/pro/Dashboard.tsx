'use client'

import { useState, useEffect, useRef } from 'react'
import type { Practitioner } from './types'
import { logoutPro } from './actions'

const TECHNIQUE_LABELS: Record<string, string> = {
  hairstroke: '헤어스트로크',
  combo: '콤보',
  machine_gradient: '머신 그라데이션',
}

const TIER_LABELS: Record<string, string> = {
  basic: '기본',
  silver: '실버',
  gold: '골드',
  partner: '파트너',
}

interface ProcedureRecord {
  procedure_id: string
  serial_token: string
  procedure_at: string
  technique: string
  registered_at: string
}

interface Props {
  practitionerId: string
  practitioner: Practitioner
}

export default function Dashboard({ practitionerId, practitioner }: Props) {
  const [tab, setTab] = useState<'scan' | 'history'>('scan')
  const [token, setToken] = useState('')
  const [procedureAt, setProcedureAt] = useState(new Date().toISOString().split('T')[0])
  const [technique, setTechnique] = useState('hairstroke')
  const [procArea, setProcArea] = useState('eyebrow')
  const [procIsRetouch, setProcIsRetouch] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [procedures, setProcedures] = useState<ProcedureRecord[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [proBalance, setProBalance] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (tab === 'history') loadHistory()
  }, [tab])

  useEffect(() => {
    fetch('/api/credits/pro-balance')
      .then(r => r.json())
      .then(d => { if (typeof d.balance === 'number') setProBalance(d.balance) })
      .catch(() => {})
  }, [])

  async function loadHistory() {
    setLoadingHistory(true)
    const res = await fetch(`/api/procedure?practitioner_id=${practitionerId}`)
    if (res.ok) {
      const j = await res.json()
      setProcedures(j.procedures ?? [])
    }
    setLoadingHistory(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const res = await fetch('/api/procedure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: token.replace(/-/g, ''),
        practitioner_id: practitionerId,
        procedure_at: procedureAt,
        technique,
        area: procArea,
        is_retouch: procIsRetouch,
      }),
    })

    const j = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(j.error ?? '등록 실패')
    } else {
      setSuccess(true)
      setToken('')
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-sm">Melanoir Pro</h1>
          <p className="text-xs text-gray-400">{practitioner.shop_name} · {TIER_LABELS[practitioner.tier] ?? practitioner.tier}</p>
          {proBalance !== null && (
            <div style={{ marginTop: 8, padding: '10px 16px', background: '#f5f5f7', borderRadius: 10, display: 'inline-block' }}>
              <span style={{ fontSize: 13, color: '#6e6e73' }}>포인트 잔액 </span>
              <span style={{ fontSize: 18, fontWeight: 700 }}>{proBalance.toLocaleString('ko-KR')}</span>
              <span style={{ fontSize: 12, color: '#6e6e73', marginLeft: 4 }}>P</span>
              <span style={{ fontSize: 11, color: '#86868b', marginLeft: 8 }}>유효기간 12개월</span>
            </div>
          )}
        </div>
        <form action={logoutPro} style={{ display: 'inline' }}>
          <button type="submit" style={{ fontSize: 12, color: '#6e6e73', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>로그아웃</button>
        </form>
      </header>

      {/* 탭 */}
      <div className="flex border-b border-gray-100 bg-white">
        <button
          onClick={() => setTab('scan')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'scan' ? 'text-black border-b-2 border-black' : 'text-gray-400'}`}
        >
          시술 등록
        </button>
        <button
          onClick={() => setTab('history')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'history' ? 'text-black border-b-2 border-black' : 'text-gray-400'}`}
        >
          시술 이력
        </button>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* 시술 등록 탭 */}
        {tab === 'scan' && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">제품 시리얼</h2>
              <input
                ref={inputRef}
                required
                value={token}
                onChange={e => setToken(e.target.value)}
                placeholder="QR 스캔 또는 수동 입력 (A7K2-9X4M-...)"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black"
              />
              <p className="text-xs text-gray-400 mt-2">QR 코드를 스캔하면 자동으로 입력됩니다.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">시술 정보</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">시술일 *</label>
                  <input
                    type="date"
                    required
                    value={procedureAt}
                    onChange={e => setProcedureAt(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">기법 *</label>
                  <select
                    value={technique}
                    onChange={e => setTechnique(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  >
                    {Object.entries(TECHNIQUE_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">시술 부위 *</label>
                  <select
                    value={procArea}
                    onChange={e => setProcArea(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
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
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  >
                    <option value="first">첫 시술</option>
                    <option value="retouch">리터치</option>
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 rounded-xl px-4 py-3 text-red-600 text-sm">{error}</div>
            )}
            {success && (
              <div className="bg-green-50 rounded-xl px-4 py-3 text-green-700 text-sm">시술 등록이 완료되었습니다.</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-2xl py-4 text-sm font-medium disabled:opacity-50 hover:bg-gray-900 transition-colors"
            >
              {loading ? '등록 중...' : '시술 등록'}
            </button>
          </form>
        )}

        {/* 이력 탭 */}
        {tab === 'history' && (
          <div className="mt-4">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <span className="text-sm font-medium">총 {procedures.length}건</span>
                <span className="text-xs text-gray-400">등급: {TIER_LABELS[practitioner.tier]}</span>
              </div>
              {loadingHistory ? (
                <div className="px-6 py-8 text-center text-sm text-gray-400">불러오는 중...</div>
              ) : procedures.length === 0 ? (
                <div className="px-6 py-8 text-center text-sm text-gray-400">아직 등록된 시술이 없습니다.</div>
              ) : (
                <ul>
                  {procedures.map(p => (
                    <li key={p.procedure_id} className="px-6 py-4 border-b border-gray-50 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium font-mono">{p.serial_token}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{TECHNIQUE_LABELS[p.technique] ?? p.technique}</p>
                        </div>
                        <span className="text-xs text-gray-400">{p.procedure_at}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
