import { NextRequest, NextResponse } from 'next/server'

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] }

export function middleware(req: NextRequest) {
  const expected = 'Basic ' + btoa(`admin:${process.env.ADMIN_PASSWORD ?? ''}`)
  if (!process.env.ADMIN_PASSWORD || req.headers.get('authorization') !== expected) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="melanoir-admin"' },
    })
  }
  return NextResponse.next()
}
