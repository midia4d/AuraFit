'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Dumbbell, Apple, BookOpen, Moon, Smile, User } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'

const navItems = [
  { href: '/dashboard', icon: Home,     labelKey: 'nav.dashboard', color: '#39FF14' },
  { href: '/workouts',  icon: Dumbbell, labelKey: 'nav.workouts',  color: '#fb923c' },
  { href: '/diet',      icon: Apple,    labelKey: 'nav.diet',      color: '#34d399' },
  { href: '/library',   icon: BookOpen, labelKey: 'nav.library',   color: '#fbbf24' },
  { href: '/sleep',     icon: Moon,     labelKey: 'nav.sleep',     color: '#60a5fa' },
  { href: '/mood',      icon: Smile,    labelKey: 'nav.mood',      color: '#a78bfa' },
  { href: '/profile',   icon: User,     labelKey: 'nav.profile',   color: '#f472b6' },
]

export function Navigation() {
  const pathname  = usePathname()
  const { t }     = useLanguage()
  const activeItem = navItems.find(item => item.href === pathname)

  return (
    <>
      {/* ── Mobile Bottom Nav ─────────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div
          className="border-t border-white/[0.06] backdrop-blur-2xl"
          style={{
            background: 'rgba(5, 5, 5, 0.92)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          <div className="flex items-center justify-around px-1 py-2">
            {navItems.map(({ href, icon: Icon, labelKey, color }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative flex flex-col items-center gap-0.5 px-2 py-1 min-w-[44px] group"
                >
                  {/* Active glow indicator */}
                  {isActive && (
                    <span
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-full"
                      style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                    />
                  )}

                  <div
                    className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 ${
                      isActive ? '' : 'group-hover:bg-white/[0.05]'
                    }`}
                    style={
                      isActive
                        ? { background: `${color}18`, boxShadow: `0 0 12px ${color}20` }
                        : {}
                    }
                  >
                    <Icon
                      className="h-5 w-5 transition-all duration-300"
                      style={{ color: isActive ? color : 'rgba(255,255,255,0.35)' }}
                    />
                  </div>

                  <span
                    className="text-[9px] font-semibold tracking-wide transition-all duration-300"
                    style={{ color: isActive ? color : 'rgba(255,255,255,0.3)' }}
                  >
                    {t(labelKey)}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* ── Desktop Top Nav ───────────────────────────────────────────────── */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50">
        <div
          className="border-b border-white/[0.05] backdrop-blur-2xl"
          style={{ background: 'rgba(5, 5, 5, 0.9)' }}
        >
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">

            {/* Brand */}
            <Link href="/dashboard" className="flex items-center gap-0.5 select-none group">
              <span className="text-xl font-black text-white tracking-tight transition-all duration-300 group-hover:text-gray-200">
                AURA
              </span>
              <span
                className="text-xl font-black tracking-tight neon-glow-sm transition-all duration-300"
                style={{ color: '#39FF14' }}
              >
                FIT
              </span>
            </Link>

            {/* Nav links */}
            <div className="flex items-center gap-0.5">
              {navItems.map(({ href, icon: Icon, labelKey, color }) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive ? '' : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
                    }`}
                    style={
                      isActive
                        ? {
                            color,
                            background: `${color}12`,
                            border: `1px solid ${color}25`,
                          }
                        : {}
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span>{t(labelKey)}</span>
                  </Link>
                )
              })}
            </div>

            {/* Active page indicator pill */}
            {activeItem && (
              <div
                className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border"
                style={{
                  color: activeItem.color,
                  background: `${activeItem.color}10`,
                  borderColor: `${activeItem.color}30`,
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: activeItem.color }}
                />
                {t(activeItem.labelKey)}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
