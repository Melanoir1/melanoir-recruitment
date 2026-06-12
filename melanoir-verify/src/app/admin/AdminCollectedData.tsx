'use client'

import { useState } from 'react'

export interface WaitlistRow {
  id: number
  type: string
  phone: string
  name: string | null
  shop_name: string | null
  instagram: string | null
  source: string | null
  created_at: string
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

function WaitlistTable({ rows }: { rows: WaitlistRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr>
            <th className={th}>신청일</th>
            <th className={th}>이름</th>
            <th className={th}>전화번호</th>
            <th className={th}>샵명</th>
            <th className={th}>인스타그램</th>
            <th className={th}>유입</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <EmptyRow cols={6} />
          ) : (
            rows.map(row => (
              <tr key={row.id}>
                <td className={td}>{fmtDate(row.created_at)}</td>
                <td className={td}>{row.name ?? '—'}</td>
                <td className={td}>{row.phone}</td>
                <td className={td}>{row.shop_name ?? '—'}</td>
                <td className={td}>{row.instagram ? `@${row.instagram}` : '—'}</td>
                <td className={`${td} text-xs text-gray-500 max-w-[160px] truncate`} title={row.source ?? undefined}>
                  {row.source ?? '—'}
                </td>
              </tr>
            ))
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
  clubRegistrations,
  proPractitioners,
}: {
  waitlist: WaitlistRow[]
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
        <TabBar tabs={mainTabs} active={mainTab} onChange={setMainTab} />

        {mainTab === 'beta' && (
          <>
            <p className="text-xs text-gray-400 mb-3">
              엠보 베타테스터 모집 신청 · 선정·안내 대상 ({betaRows.length}건)
            </p>
            <WaitlistTable rows={betaRows} />
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
