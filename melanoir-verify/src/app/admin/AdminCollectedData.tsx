'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export interface WaitlistRow {
  id: number
  type: string
  phone: string
  name: string | null
  shop_name: string | null
  instagram: string | null
  source: string | null
  created_at: string
  status: string | null
  phone_verified_at: string | null
  dm_code: string | null
  dm_code_sent_at: string | null
  dm_verified_at: string | null
  technique: string | null
  target: string | null
}

export interface ClubRegistrationRow {
  serial_token: string
  customer_name: string | null
  customer_phone: string | null
  satisfaction: number | null
  discomfort: string[] | null
  photo_before: string | null
  photo_healing: string | null
  photo_longterm: string | null
  registered_at: string | null
  healing_registered_at: string | null
}

export interface ProPractitionerRow {
  practitioner_id: string
  name: string
  shop_name: string
  phone: string
  region: string | null
  tier: string
  created_at: string
}

const th = 'px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase whitespace-nowrap'
const td = 'px-3 py-2 text-sm border-t border-gray-100 whitespace-nowrap'

const TIER_KO: Record<string, string> = {
  basic: 'Basic',
  silver: 'Silver',
  gold: 'Gold',
  partner: 'Partner',
}

/** 출시 알림 = Club·Pro 웨이트리스트만 (베타테스터 모집과 별도 프로그램) */
const RELEASE_TABS = [
  { id: 'customer' as const, label: 'Club' },
  { id: 'pro' as const, label: 'Pro' },
]

type MainTabId = 'beta' | 'release' | 'club' | 'proMember'

function fmtDate(iso: string | null) {
  if (!iso) return '—'
  return iso.replace('T', ' ').slice(0, 16)
}

function TabBar<T extends string>({
  tabs,
  active,
  onChange,
  size = 'md',
}: {
  tabs: { id: T; label: string }[]
  active: T
  onChange: (id: T) => void
  size?: 'sm' | 'md'
}) {
  const pad = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3 mb-4">
      {tabs.map(tab => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`rounded-full font-medium transition-colors ${pad} ${
            active === tab.id
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

function EmptyRow({ cols }: { cols: number }) {
  return (
    <tr>
      <td colSpan={cols} className={`${td} text-center text-gray-400 py-8`}>
        등록된 데이터가 없습니다.
      </td>
    </tr>
  )
}

const STATUS_KO: Record<string, { label: string; cls: string }> = {
  applied: { label: '신청', cls: 'bg-gray-100 text-gray-600' },
  selected: { label: '선정·DM 대기', cls: 'bg-amber-100 text-amber-700' },
  confirmed: { label: '확정', cls: 'bg-green-100 text-green-700' },
}

const TECH_LABEL: Record<string, string> = { embo: '엠보', hairstroke: '헤어스트로크', combo: '콤보브로우' }
const TARGET_LABEL: Record<string, string> = { female: '여성', male: '남성', both: '둘 다' }

function BetaActions({ row }: { row: WaitlistRow }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function act(action: 'select' | 'confirm_dm') {
    const who = row.name ?? row.phone
    const ask =
      action === 'select'
        ? `${who} — 선정 처리하고 DM 인증 코드를 SMS로 발송할까요?`
        : `@${row.instagram ?? '?'} 계정에서 코드 ${row.dm_code ?? ''} DM을 확인했나요? 최종 확정 SMS가 발송됩니다.`
    if (!window.confirm(ask)) return
    setLoading(true)
    await fetch('/api/admin/waitlist/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: row.id, action }),
    })
    setLoading(false)
    router.refresh()
  }

  const btnCls = 'text-xs px-3 py-1.5 rounded-full disabled:opacity-40'
  if (row.status === 'confirmed') return <span className="text-xs text-gray-400">완료</span>
  if (row.status === 'selected') {
    return (
      <div className="flex gap-1.5">
        <button onClick={() => act('confirm_dm')} disabled={loading} className={`${btnCls} bg-black text-white`}>
          DM 확인
        </button>
        <button onClick={() => act('select')} disabled={loading} className={`${btnCls} bg-gray-100 text-gray-600`}>
          재발송
        </button>
      </div>
    )
  }
  return (
    <button onClick={() => act('select')} disabled={loading} className={`${btnCls} bg-black text-white`}>
      선정
    </button>
  )
}

function WaitlistTable({ rows, beta = false }: { rows: WaitlistRow[]; beta?: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${beta ? 'min-w-[980px]' : 'min-w-[640px]'}`}>
        <thead>
          <tr>
            <th className={th}>신청일</th>
            <th className={th}>이름</th>
            <th className={th}>전화번호</th>
            <th className={th}>샵명</th>
            <th className={th}>인스타그램</th>
            {beta && <th className={th}>기법</th>}
            {beta && <th className={th}>대상</th>}
            <th className={th}>유입</th>
            {beta && <th className={th}>휴대폰 인증</th>}
            {beta && <th className={th}>상태</th>}
            {beta && <th className={th}>DM 코드</th>}
            {beta && <th className={th}>액션</th>}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <EmptyRow cols={beta ? 12 : 6} />
          ) : (
            rows.map(row => {
              const st = STATUS_KO[row.status ?? 'applied'] ?? STATUS_KO.applied
              return (
                <tr key={row.id}>
                  <td className={td}>{fmtDate(row.created_at)}</td>
                  <td className={td}>{row.name ?? '—'}</td>
                  <td className={td}>{row.phone}</td>
                  <td className={td}>{row.shop_name ?? '—'}</td>
                  <td className={td}>{row.instagram ? `@${row.instagram}` : '—'}</td>
                  {beta && <td className={td}>{row.technique ? TECH_LABEL[row.technique] ?? row.technique : '—'}</td>}
                  {beta && <td className={td}>{row.target ? TARGET_LABEL[row.target] ?? row.target : '—'}</td>}
                  <td className={`${td} text-xs text-gray-500 max-w-[160px] truncate`} title={row.source ?? undefined}>
                    {row.source ?? '—'}
                  </td>
                  {beta && (
                    <td className={td}>
                      {row.phone_verified_at ? (
                        <span className="text-xs text-green-600">✓ 인증</span>
                      ) : (
                        <span className="text-xs text-gray-400">미인증</span>
                      )}
                    </td>
                  )}
                  {beta && (
                    <td className={td}>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
                    </td>
                  )}
                  {beta && <td className={`${td} font-mono text-xs`}>{row.dm_code ?? '—'}</td>}
                  {beta && <td className={td}><BetaActions row={row} /></td>}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

function ClubTable({ rows }: { rows: ClubRegistrationRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px]">
        <thead>
          <tr>
            <th className={th}>등록일</th>
            <th className={th}>시리얼</th>
            <th className={th}>이름</th>
            <th className={th}>전화번호</th>
            <th className={th}>만족도</th>
            <th className={th}>사진</th>
            <th className={th}>힐링 등록</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <EmptyRow cols={7} />
          ) : (
            rows.map(row => (
              <tr key={row.serial_token}>
                <td className={td}>{fmtDate(row.registered_at)}</td>
                <td className={`${td} font-mono text-xs`}>{row.serial_token}</td>
                <td className={td}>{row.customer_name ?? '—'}</td>
                <td className={td}>{row.customer_phone ?? '—'}</td>
                <td className={td}>{row.satisfaction ?? '—'}</td>
                <td className={td}>
                  <div className="flex gap-1">
                    {[
                      { url: row.photo_before, label: '직후' },
                      { url: row.photo_healing, label: '힐링' },
                      { url: row.photo_longterm, label: '6개월' },
                    ].map(p =>
                      p.url ? (
                        <a
                          key={p.label}
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={p.label}
                          className="text-xs px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200"
                        >
                          {p.label}
                        </a>
                      ) : null
                    )}
                    {!row.photo_before && !row.photo_healing && !row.photo_longterm && (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </div>
                </td>
                <td className={td}>{fmtDate(row.healing_registered_at)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

function ProTable({ rows }: { rows: ProPractitionerRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr>
            <th className={th}>가입일</th>
            <th className={th}>이름</th>
            <th className={th}>샵명</th>
            <th className={th}>전화번호</th>
            <th className={th}>지역</th>
            <th className={th}>등급</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <EmptyRow cols={6} />
          ) : (
            rows.map(row => (
              <tr key={row.practitioner_id}>
                <td className={td}>{fmtDate(row.created_at)}</td>
                <td className={td}>{row.name}</td>
                <td className={td}>{row.shop_name}</td>
                <td className={td}>{row.phone}</td>
                <td className={td}>{row.region ?? '—'}</td>
                <td className={td}>{TIER_KO[row.tier] ?? row.tier}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default function AdminCollectedData({
  waitlist,
  waitlistError,
  clubRegistrations,
  proPractitioners,
}: {
  waitlist: WaitlistRow[]
  waitlistError?: string | null
  clubRegistrations: ClubRegistrationRow[]
  proPractitioners: ProPractitionerRow[]
}) {
  const [mainTab, setMainTab] = useState<MainTabId>('beta')
  const [releaseTab, setReleaseTab] = useState<'customer' | 'pro'>('customer')

  const betaRows = waitlist.filter(w => w.type === 'beta')
  const releaseCounts = {
    customer: waitlist.filter(w => w.type === 'customer').length,
    pro: waitlist.filter(w => w.type === 'pro').length,
  }
  const releaseRows = waitlist.filter(w => w.type === releaseTab)
  const releaseTotal = releaseCounts.customer + releaseCounts.pro

  const mainTabs: { id: MainTabId; label: string }[] = [
    { id: 'beta', label: `베타테스터 (${betaRows.length})` },
    { id: 'release', label: `출시 알림 (${releaseTotal})` },
    { id: 'club', label: `Club 정품 등록 (${clubRegistrations.length})` },
    { id: 'proMember', label: `Pro 시술자 (${proPractitioners.length})` },
  ]

  return (
    <section>
      <h2 className="text-sm font-semibold text-gray-400 uppercase mb-3">수집 데이터</h2>
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        {waitlistError ? (
          <p className="text-sm text-red-600 mb-4">웨이트리스트 조회 오류: {waitlistError}</p>
        ) : null}
        <TabBar tabs={mainTabs} active={mainTab} onChange={setMainTab} />

        {mainTab === 'beta' && (
          <>
            <p className="text-xs text-gray-400 mb-3">
              엠보 베타테스터 모집 신청 · 선정·안내 대상 ({betaRows.length}건)
            </p>
            <WaitlistTable rows={betaRows} beta />
          </>
        )}

        {mainTab === 'release' && (
          <>
            <TabBar
              tabs={RELEASE_TABS.map(t => ({
                ...t,
                label: `${t.label} (${releaseCounts[t.id]})`,
              }))}
              active={releaseTab}
              onChange={setReleaseTab}
              size="sm"
            />
            <p className="text-xs text-gray-400 mb-3">
              정식 출시 전 알림 신청 · {releaseTab === 'customer' ? 'Club (/register)' : 'Pro (/pro)'} ({releaseRows.length}건)
            </p>
            <WaitlistTable rows={releaseRows} />
          </>
        )}

        {mainTab === 'club' && (
          <>
            <p className="text-xs text-gray-400 mb-3">
              정품 QR 등록 완료 고객 · 실제 Club 참여 ({clubRegistrations.length}건)
            </p>
            <ClubTable rows={clubRegistrations} />
          </>
        )}

        {mainTab === 'proMember' && (
          <>
            <p className="text-xs text-gray-400 mb-3">
              Pro 프로그램 가입 시술자 · 실제 Pro 참여 ({proPractitioners.length}건)
            </p>
            <ProTable rows={proPractitioners} />
          </>
        )}
      </div>
    </section>
  )
}
