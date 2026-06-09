import { createHmac } from 'crypto'

const HMAC_SECRET = process.env.HMAC_SECRET!

/**
 * 내부 ID → HMAC 토큰 생성 (형식: A7K2-9X4M-3P8Q-XXXX)
 */
export function generateToken(internalId: number): string {
  if (!HMAC_SECRET) throw new Error('HMAC_SECRET is not set')
  const raw = createHmac('sha256', HMAC_SECRET)
    .update(internalId.toString())
    .digest('hex')
    .slice(0, 16)
    .toUpperCase()
  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}`
}

/**
 * 토큰 검증
 */
export function verifyToken(token: string, internalId: number): boolean {
  return generateToken(internalId) === token.toUpperCase()
}

/**
 * URL용 토큰 (하이픈 제거)
 */
export function tokenToSlug(token: string): string {
  return token.replace(/-/g, '')
}

/**
 * URL 슬러그 → 표시 형식 토큰 (XXXX-XXXX-XXXX-XXXX)
 */
export function slugToToken(slug: string): string {
  const s = slug.toUpperCase().replace(/-/g, '')
  if (s.length !== 16) throw new Error('Invalid token length')
  return `${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}`
}
