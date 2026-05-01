'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  LayoutDashboard, UtensilsCrossed, Dumbbell, Trophy,
  Users, Settings, LogOut, ChevronRight, Zap, BookOpen,
  ClipboardList, Menu, X
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const navItems = [
  { href: '/admin/dashboard',  icon: LayoutDashboard, label: 'Dashboard'         },
  { href: '/admin/diets',      icon: UtensilsCrossed, label: 'Planos de Dieta'   },
  { href: '/admin/exercises',  icon: Dumbbell,        label: 'Exercícios'         },
  { href: '/admin/workouts',   icon: ClipboardList,   label: 'Planos de Treino'  },
  { href: '/admin/challenges', icon: Trophy,          label: 'Desafios'          },
  { href: '/admin/users',      icon: Users,           label: 'Usuários'          },
]

export function AdminSidebar({ admin }: { admin: any }) {
  const pathname = usePathname()
  const router   = useRouter()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Sessão encerrada')
    router.push('/admin')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-6 border-b border-gray-800/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#39FF14]/15 border border-[#39FF14]/30 flex items-center justify-center">
            <Zap className="h-5 w-5 text-[#39FF14]" />
          </div>
          <div>
            <p className="font-black text-sm text-white leading-tight">
              AURA<span className="text-[#39FF14]">FIT</span>
            </p>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest">Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/20'
                  : 'text-gray-500 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-[#39FF14]' : 'text-gray-600 group-hover:text-gray-400'}`} />
              <span>{label}</span>
              {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-60" />}
            </Link>
          )
        })}
      </nav>

      {/* Admin info + Logout */}
      <div className="px-3 py-4 border-t border-gray-800/60">
        <div className="px-3 py-2 mb-2">
          <p className="text-xs font-semibold text-white truncate">{admin?.name ?? 'Admin'}</p>
          <p className="text-[10px] text-gray-600 truncate">{admin?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 bg-gray-900/80 border-r border-gray-800/60 flex-col sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile header + drawer */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-gray-900/95 border-b border-gray-800 flex items-center justify-between px-4 h-14 backdrop-blur-xl">
        <span className="font-black text-sm">
          AURA<span className="text-[#39FF14]">FIT</span>
          <span className="text-gray-600 text-xs ml-2">Admin</span>
        </span>
        <button onClick={() => setOpen(!open)} className="text-gray-400 hover:text-white transition-colors">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/60" onClick={() => setOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside className={`md:hidden fixed top-14 left-0 bottom-0 z-30 w-64 bg-gray-900 border-r border-gray-800 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>
    </>
  )
}
