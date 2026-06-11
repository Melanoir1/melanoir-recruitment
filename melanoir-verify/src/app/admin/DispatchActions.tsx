'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DispatchActions({ dispatchId, status }: { dispatchId: string; status: string | null }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function setStatus(next: 'approved' | 'dispatched') {
    setLoading(true)
    await fetch('/api/admin/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dispatch_id: dispatchId, status: next }),
    })
    setLoading(false)
    router.refresh()
  }

  if (status === 'dispatched') return <span className="text-xs text-gray-400">완료</span>
  return (
    <button
      onClick={() => setStatus(status === 'pending' ? 'approved' : 'dispatched')}
      disabled={loading}
      className="text-xs px-3 py-1.5 rounded-full bg-black text-white disabled:opacity-40"
    >
      {status === 'pending' ? '승인' : '발송 완료'}
    </button>
  )
}
