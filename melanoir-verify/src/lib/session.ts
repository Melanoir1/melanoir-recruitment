import crypto from 'crypto'

const SECRET = process.env.COOKIE_SECRET ?? 'dev-secret-CHANGE-THIS'
export const COOKIE_PRO      = 'mnr_pro'
export const COOKIE_CUSTOMER = 'mnr_customer'
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60

export function signSession(payload: string): string {
  const b64 = Buffer.from(payload).toString('base64url')
  const sig  = crypto.createHmac('sha256', SECRET).update(b64).digest('hex')
  return `${b64}.${sig}`
}

export function verifySession(token: string): string | null {
  const dot = token.lastIndexOf('.')
  if (dot < 0) return null
  const b64 = token.slice(0, dot)
  const sig  = token.slice(dot + 1)
  const expected = crypto.createHmac('sha256', SECRET).update(b64).digest('hex')
  if (sig !== expected) return null
  return Buffer.from(b64, 'base64url').toString()
}

export function setCookie(headers: Headers, name: string, value: string, maxAge = SESSION_MAX_AGE) {
  const secure  = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  headers.append('Set-Cookie', `${name}=${value}; HttpOnly${secure}; SameSite=Strict; Max-Age=${maxAge}; Path=/`)
}

export function clearCookie(headers: Headers, name: string) {
  headers.append('Set-Cookie', `${name}=; HttpOnly; SameSite=Strict; Max-Age=0; Path=/`)
}
