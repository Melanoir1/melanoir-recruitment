'use server'

export async function logoutPro() {
  const { cookies } = await import('next/headers')
  cookies().delete('mnr_pro')
}
