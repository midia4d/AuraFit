'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Toaster } from 'sonner'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()

  const isLoginPage = pathname === '/admin'

  const [checking, setChecking] = useState(!isLoginPage)
  const [admin,    setAdmin]    = useState<any>(null)

  useEffect(() => {
    if (isLoginPage) return

    const verifyAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/admin')
        return
      }

      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (!adminUser) {
        await supabase.auth.signOut()
        router.push('/admin')
        return
      }

      setAdmin(adminUser)
      setChecking(false)
    }

    verifyAdmin()
  }, [pathname])

  // Login page — no layout wrapper
  if (isLoginPage) {
    return (
      <>
        {children}
        <Toaster position="top-center" toastOptions={{ style: { background: '#111', border: '1px solid #374151', color: '#fff', borderRadius: '12px' } }} />
      </>
    )
  }

  // Loading auth check
  if (checking) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-black text-[#39FF14] animate-pulse mb-2">AURAFIT</div>
          <p className="text-gray-600 text-sm">Verificando acesso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080808] flex">
      <AdminSidebar admin={admin} />
      <main className="flex-1 overflow-y-auto min-h-screen">
        {children}
      </main>
      <Toaster position="top-right" toastOptions={{ style: { background: '#111', border: '1px solid #374151', color: '#fff', borderRadius: '12px' } }} />
    </div>
  )
}
