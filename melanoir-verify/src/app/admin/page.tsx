import { unstable_noStore as noStore } from 'next/cache'
import { createRawServiceClient, createServiceClient } from '@/lib/supabase'
import AdminCollectedData, { type WaitlistRow } from './AdminCollectedData'
import DispatchActions from './DispatchActions'

export const dynamic = 'force-dynamic'

interface Funnel {
  procedures: number; registrations: number; before_photos: number
  healing_photos: number; longterm_photos: number; avg_satisfaction: number | null
}
interface LotQuality { lot_id: string; registrations: number; avg_satisfaction: number | null; discomfort_count: number }
interface TechQuality { technique: string; area: string | null; is_retouch: boolean | null; registrations: number; avg_satisfaction: number | null }
interface Dispatch { dispatch_id: string; origin_serial: string | null; r_serial: string | null; status: string | null; created_at: string | null }
interface RegPhotos { serial_token: string; photo_url: string | null; healing_photo_url: string | null }

async function signedUrl(supabase: ReturnType<typeof createServiceClient>, path: string | null) {
  if (!path) return null
  const { data } = await supabase.storage.from('mnr-photos').createSignedUrl(path, 3600)
  return data?.signedUrl ?? null
}

async function fetchWaitlist(): Promise<{ rows: WaitlistRow[]; error: string | null }> {
  noStore()
  const { data, error } = await createRawServiceClient()
    .from('mnr_waitlist')
    .select('id, type, phone, name, shop_name, instagram, source, created_at, status, phone_verified_at, dm_code, dm_code_sent_at, dm_verified_at, technique, techniques_all, target, region, region_detail')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('[admin] waitlist fetch error:', error)
    return { rows: [], error: error.message }
  }
  return { rows: (data ?? []) as WaitlistRow[], error: null }
}

export default async function AdminPage() {
  noStore()
  const supabase = createServiceClient()
  const [funnelRes, lotRes, techRes, dispatchRes, waitlistRes, clubRes, proRes] = await Promise.all([
    supabase.from('mnr_v_funnel' as 'mnr_credits').select('*').single(),
    supabase.from('mnr_v_lot_quality' as 'mnr_credits').select('*'),
    supabase.from('mnr_v_technique_quality' as 'mnr_credits').select('*'),
    supabase.from('mnr_retouch_dispatches').select('*').order('created_at', { ascending: false }).limit(50),
    fetchWaitlist(),
    supabase.from('mnr_registrations').select('serial_token, customer_name, customer_phone, satisfaction, discomfort, photo_url, healing_photo_url, longterm_photo_url, registered_at, healing_registered_at').order('registered_at', { ascending: false }),
    supabase.from('mnr_practitioners').select('practitioner_id, name, shop_name, phone, region, tier, created_at').order('created_at', { ascending: false }),
  ])
  const funnel = funnelRes.data as unknown as Funnel | null
  const lots = (lotRes.data ?? []) as unknown as LotQuality[]
  const techs = (techRes.data ?? []) as unknown as TechQuality[]
  const dispatches = (dispatchRes.data ?? []) as unknown as Dispatch[]

  const serials = Array.from(new Set(dispatches.map(d => d.origin_serial).filter((s): s is string => !!s)))
  const { data: regs } = serials.length > 0
    ? await supabase.from('mnr_registrations').select('serial_token, photo_url, healing_photo_url').in('serial_token', serials)
    : { data: [] as RegPhotos[] }

  const photoMap = new Map<string, { before: string | null; healing: string | null }>()
  for (const reg of (regs ?? []) as RegPhotos[]) {
    const [before, healing] = await Promise.all([
      signedUrl(supabase, reg.photo_url),
      signedUrl(supabase, reg.healing_photo_url),
    ])
    photoMap.set(reg.serial_token, { before, healing })
  }

  type ClubRow = {
    serial_token: string; customer_name: string | null; customer_phone: string | null
    satisfaction: number | null; discomfort: string[] | null
    photo_url: string | null; healing_photo_url: string | null; longterm_photo_url: string | null
    registered_at: string | null; healing_registered_at: string | null
  }
  const clubRows = (clubRes.data ?? []) as ClubRow[]
  const clubRegistrations = await Promise.all(
    clubRows.map(async r => ({
      serial_token: r.serial_token,
      customer_name: r.customer_name,
      customer_phone: r.customer_phone,
      satisfaction: r.satisfaction,
      discomfort: r.discomfort,
      photo_before: await signedUrl(supabase, r.photo_url),
      photo_healing: await signedUrl(supabase, r.healing_photo_url),
      photo_longterm: await signedUrl(supabase, r.longterm_photo_url),
      registered_at: r.registered_at,
      healing_registered_at: r.healing_registered_at,
    }))
  )

  const AREA_KO: Record<string, string> = { eyebrow: '눈썹', eyeliner: '아이라인', lip: '입술' }
  const TECH_KO: Record<string, string> = { hairstroke: '헤어스트로크', combo: '콤보', machine_gradient: '머신 그라데이션' }

  const th = 'px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase'
  const td = 'px-3 py-2 text-sm border-t border-gray-100'

  return (
    <main className="min-h-screen bg-gray-50 p-8 space-y-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold">Melanoir 데이터 대시보드</h1>

      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase mb-3">수집 퍼널</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            ['시술 등록', funnel?.procedures], ['정품 등록', funnel?.registrations],
            ['직후 사진', funnel?.before_photos], ['힐링 사진', funnel?.healing_photos],
            ['6개월 사진', funnel?.longterm_photos], ['평균 만족도', funnel?.avg_satisfaction ?? '—'],
          ].map(([label, value]) => (
            <div key={String(label)} className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-xl font-semibold">{value ?? 0}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase mb-3">로트별 품질</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead><tr><th className={th}>로트</th><th className={th}>등록</th><th className={th}>평균 만족도</th><th className={th}>불편 신고</th></tr></thead>
            <tbody>
              {lots.map(l => (
                <tr key={l.lot_id} className={l.registrations > 0 && l.discomfort_count / l.registrations >= 0.2 ? 'bg-red-50' : ''}>
                  <td className={td}>{l.lot_id}</td>
                  <td className={td}>{l.registrations}</td>
                  <td className={td}>{l.avg_satisfaction ?? '—'}</td>
                  <td className={td}>{l.discomfort_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">붉은 행 = 불편 신고율 20% 이상 (점검 필요 시그널)</p>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase mb-3">기법·부위별 만족도</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead><tr><th className={th}>기법</th><th className={th}>부위</th><th className={th}>구분</th><th className={th}>건수</th><th className={th}>평균 만족도</th></tr></thead>
            <tbody>
              {techs.map((t, i) => (
                <tr key={i}>
                  <td className={td}>{TECH_KO[t.technique] ?? t.technique}</td>
                  <td className={td}>{t.area ? AREA_KO[t.area] ?? t.area : '—'}</td>
                  <td className={td}>{t.is_retouch === null ? '—' : t.is_retouch ? '리터치' : '첫 시술'}</td>
                  <td className={td}>{t.registrations}</td>
                  <td className={td}>{t.avg_satisfaction ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase mb-3">리터칭 잉크 발송 관리 (최근 50건)</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className={th}>요청일</th>
                <th className={th}>원 시리얼</th>
                <th className={th}>사진</th>
                <th className={th}>R 시리얼</th>
                <th className={th}>상태</th>
                <th className={th}>처리</th>
              </tr>
            </thead>
            <tbody>
              {dispatches.map(d => {
                const photos = d.origin_serial ? photoMap.get(d.origin_serial) : null
                return (
                  <tr key={d.dispatch_id}>
                    <td className={td}>{d.created_at?.slice(0, 10) ?? '—'}</td>
                    <td className={`${td} font-mono text-xs`}>{d.origin_serial}</td>
                    <td className={td}>
                      <div className="flex gap-2">
                        {photos?.before ? (
                          <a href={photos.before} target="_blank" rel="noopener noreferrer" title="직후 사진">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={photos.before} alt="직후" className="w-10 h-10 object-cover rounded border border-gray-200" />
                          </a>
                        ) : <span className="text-xs text-gray-300">—</span>}
                        {photos?.healing ? (
                          <a href={photos.healing} target="_blank" rel="noopener noreferrer" title="힐링 사진">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={photos.healing} alt="힐링" className="w-10 h-10 object-cover rounded border border-gray-200" />
                          </a>
                        ) : null}
                      </div>
                    </td>
                    <td className={`${td} font-mono text-xs`}>{d.r_serial}</td>
                    <td className={td}>{d.status}</td>
                    <td className={td}><DispatchActions dispatchId={d.dispatch_id} status={d.status} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <AdminCollectedData
        waitlist={waitlistRes.rows}
        waitlistError={waitlistRes.error}
        clubRegistrations={clubRegistrations}
        proPractitioners={(proRes.data ?? []) as Parameters<typeof AdminCollectedData>[0]['proPractitioners']}
      />
    </main>
  )
}
