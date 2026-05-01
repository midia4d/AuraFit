'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import {
  Flame, TrendingUp, Calendar, Dumbbell, Trophy,
  Apple, Moon, Smile, ChevronRight, Zap, BookOpen,
  CheckCircle2, Lock, Star, ArrowUpRight
} from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'
import {
  getUserData, updateUserStreak, getWorkoutsByDay,
  getWorkoutsThisWeek, saveUserData
} from '@/lib/storage'
import { calculateLevel, getXpForNextLevel, badges, checkBadges, getDailyQuests, DailyQuest, Badge } from '@/lib/gamification'
import { getDietPlanByGoal } from '@/lib/diet-data'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import Link from 'next/link'

// ── Ring Progress ─────────────────────────────────────────────────────────────
function RingProgress({
  value, max, size = 120, stroke = 8, color = '#39FF14', label, sublabel,
}: {
  value: number; max: number; size?: number; stroke?: number;
  color?: string; label: string; sublabel?: string;
}) {
  const radius = (size - stroke * 2) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(value / max, 1)
  const offset = circumference * (1 - progress)
  const cx = size / 2
  const cy = size / 2

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={cx} cy={cy} r={radius} fill="none" strokeWidth={stroke} stroke="rgba(255,255,255,0.06)" />
          <circle
            cx={cx} cy={cy} r={radius} fill="none"
            strokeWidth={stroke} stroke={color}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)',
              filter: `drop-shadow(0 0 6px ${color}80)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-black text-white">{label}</span>
        </div>
      </div>
      {sublabel && <p className="text-xs text-white/40 text-center">{sublabel}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { t, language } = useLanguage()

  const [mounted, setMounted]       = useState(false)
  const [userData, setUserData]     = useState<any>(null)
  const [level, setLevel]           = useState(1)
  const [xpProgress, setXpProgress] = useState(0)
  const [xpToNext, setXpToNext]     = useState(1000)
  const [weekWorkouts, setWeekWorkouts] = useState(0)
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [calories, setCalories]     = useState({ current: 0, target: 2000 })
  const [completedQuests, setCompletedQuests] = useState<string[]>([])
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([])
  const [dailyQuestsList, setDailyQuestsList] = useState<DailyQuest[]>([])

  const isPT = language === 'pt-BR'

  const getWorkoutHistory = () => {
    try {
      const data = localStorage.getItem('aurafi_workouts')
      return data ? JSON.parse(data) : []
    } catch { return [] }
  }

  useEffect(() => {
    setMounted(true)
    const user = getUserData()
    if (!user) { router.push('/onboarding'); return }
    setUserData(user)
    updateUserStreak()

    const currentLevel = calculateLevel(user.xp ?? 0)
    const xpForNext    = getXpForNextLevel(currentLevel)
    const currentXp    = (user.xp ?? 0) % xpForNext
    setLevel(currentLevel)
    setXpToNext(xpForNext - currentXp)
    setXpProgress((currentXp / xpForNext) * 100)

    setWeeklyData(getWorkoutsByDay(7, language))
    setWeekWorkouts(getWorkoutsThisWeek().length)
    setEarnedBadges(checkBadges(user, getWorkoutHistory().length))
    setDailyQuestsList(getDailyQuests())

    const plan = getDietPlanByGoal(user.goal, false)
    if (plan) {
      const target  = plan.totalCalories as number
      const current = Math.round(target * 0.87)
      setCalories({ current, target })
    }
  }, [])

  const handleCompleteQuest = (quest: DailyQuest) => {
    if (completedQuests.includes(quest.id)) return
    setCompletedQuests(prev => [...prev, quest.id])
    const newXp = (userData.xp ?? 0) + quest.xp
    const updatedUser = { ...userData, xp: newXp }
    setUserData(updatedUser)
    saveUserData(updatedUser)
    const newLevel = Math.floor(newXp / 1000) + 1
    setLevel(newLevel)
    const xpForNext = 1000
    const currentXp = newXp % xpForNext
    setXpToNext(xpForNext - currentXp)
    setXpProgress((currentXp / xpForNext) * 100)
    toast.success(`+${quest.xp} XP! ${isPT ? quest.title : quest.titleEN}`, {
      icon: '✨',
      className: 'bg-gray-900 border-[#39FF14] text-[#39FF14]',
    })
  }

  if (!mounted || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#050505' }}>
        <div className="text-center">
          <div className="text-5xl font-black animate-pulse-neon mb-8" style={{ color: '#39FF14' }}>
            AURAFIT
          </div>
          <div className="w-48 h-1 rounded-full mx-auto overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full animate-loading-bar rounded-full" style={{ background: 'linear-gradient(90deg, #39FF14, #22c55e)' }} />
          </div>
          <p className="text-white/30 text-xs mt-4 tracking-widest uppercase">
            {isPT ? 'Carregando...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  const weeklyGoal = userData.weeklyGoal ?? 5
  const weekPct    = Math.min((weekWorkouts / weeklyGoal) * 100, 100)
  const caloriePct = Math.min((calories.current / calories.target) * 100, 100)
  const streakPct  = Math.min(((userData.streak ?? 0) / 30) * 100, 100)

  const quickActions = [
    { href: '/workouts', icon: Dumbbell, label: t('nav.workouts'), color: '#fb923c', emoji: '💪' },
    { href: '/diet',     icon: Apple,    label: t('nav.diet'),     color: '#34d399', emoji: '🥗' },
    { href: '/sleep',    icon: Moon,     label: t('nav.sleep'),    color: '#60a5fa', emoji: '😴' },
    { href: '/mood',     icon: Smile,    label: t('nav.mood'),     color: '#a78bfa', emoji: '😊' },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="rounded-xl px-3 py-2 text-xs shadow-xl border" style={{ background: '#0d0d0d', borderColor: 'rgba(255,255,255,0.08)' }}>
        <p className="text-white/40 mb-1">{label}</p>
        <p className="font-bold" style={{ color: '#39FF14' }}>
          {payload[0].value} {isPT ? 'treino(s)' : 'workout(s)'}
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-14" style={{ background: '#050505' }}>
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 pt-8 animate-fade-in">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-white/30 text-sm mb-1 tracking-wide">
              {isPT ? 'Bem-vindo de volta 👋' : 'Welcome back 👋'}
            </p>
            <h1 className="text-4xl font-black text-white tracking-tight">
              {userData.name || (isPT ? 'Atleta'  : 'Athlete')}
            </h1>
            <p className="text-white/30 text-sm mt-1">
              {new Date().toLocaleDateString(language, { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <Link href="/profile">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center border transition-all hover:scale-105"
              style={{ background: 'rgba(57,255,20,0.08)', borderColor: 'rgba(57,255,20,0.2)' }}
            >
              <span className="text-sm font-black" style={{ color: '#39FF14' }}>
                L{level}
              </span>
            </div>
          </Link>
        </div>

        {/* ── XP Hero Card ─────────────────────────────────────────────────── */}
        <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
          <div
            className="rounded-3xl p-6 mb-5 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(57,255,20,0.08) 0%, rgba(34,197,94,0.04) 50%, rgba(57,255,20,0.06) 100%)',
              border: '1px solid rgba(57,255,20,0.15)',
            }}
          >
            {/* bg glow */}
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(57,255,20,0.12) 0%, transparent 70%)' }} />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <RingProgress
                  value={xpProgress}
                  max={100}
                  size={88}
                  stroke={6}
                  color="#39FF14"
                  label={`${Math.round(xpProgress)}%`}
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="h-4 w-4" style={{ color: '#39FF14' }} />
                    <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                      {t('dashboard.level')}
                    </span>
                  </div>
                  <p className="text-5xl font-black text-white leading-none">{level}</p>
                  <p className="text-sm text-white/40 mt-1">
                    {xpToNext.toLocaleString()} XP {isPT ? 'para o próximo' : 'to next level'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/30 uppercase tracking-wider mb-1">XP Total</p>
                <p className="text-3xl font-black" style={{ color: '#39FF14' }}>
                  {(userData.xp ?? 0).toLocaleString()}
                </p>
                <p className="text-xs text-white/30 mt-1">pontos</p>
              </div>
            </div>

            {/* XP bar */}
            <div className="mt-5">
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="h-full rounded-full relative overflow-hidden"
                  style={{
                    width: `${xpProgress}%`,
                    background: 'linear-gradient(90deg, #39FF14, #22c55e)',
                    boxShadow: '0 0 8px rgba(57,255,20,0.5)',
                    transition: 'width 0.8s cubic-bezier(0.22,1,0.36,1)',
                  }}
                >
                  <div className="absolute inset-0 shimmer" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Stats Row ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {[
            {
              label: t('dashboard.streak'),
              value: userData.streak ?? 0,
              unit: t('dashboard.days'),
              icon: Flame,
              iconColor: '#f97316',
              barColor: 'linear-gradient(90deg, #f97316, #ef4444)',
              barGlow: 'rgba(249,115,22,0.4)',
              pct: streakPct,
              footnote: isPT ? 'Meta: 30 dias' : 'Goal: 30 days',
            },
            {
              label: t('dashboard.weekProgress'),
              value: weekWorkouts,
              unit: `/${weeklyGoal} ${t('dashboard.workoutsCompleted')}`,
              icon: Calendar,
              iconColor: '#39FF14',
              barColor: 'linear-gradient(90deg, #39FF14, #22c55e)',
              barGlow: 'rgba(57,255,20,0.4)',
              pct: weekPct,
              footnote: `${Math.round(weekPct)}% ${isPT ? 'da meta' : 'of goal'}`,
            },
            {
              label: t('dashboard.calories'),
              value: calories.current.toLocaleString(),
              unit: `/ ${calories.target.toLocaleString()} kcal`,
              icon: TrendingUp,
              iconColor: '#60a5fa',
              barColor: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
              barGlow: 'rgba(59,130,246,0.4)',
              pct: caloriePct,
              footnote: `${Math.round(caloriePct)}% ${isPT ? 'da meta diária' : 'of daily goal'}`,
            },
          ].map(({ label, value, unit, icon: Icon, iconColor, barColor, barGlow, pct, footnote }) => (
            <div
              key={label}
              className="rounded-2xl p-5 card-neon-hover"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-white/35 uppercase tracking-wider mb-2">{label}</p>
                  <p className="text-5xl font-black text-white tabular-nums leading-none">{value}</p>
                  <p className="text-sm text-white/30 mt-1">{unit}</p>
                </div>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: `${iconColor}15` }}
                >
                  <Icon className="h-5 w-5" style={{ color: iconColor }} />
                </div>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: barColor,
                    boxShadow: `0 0 8px ${barGlow}`,
                    transition: 'width 0.8s cubic-bezier(0.22,1,0.36,1)',
                  }}
                />
              </div>
              <p className="text-xs text-white/20 mt-1.5">{footnote}</p>
            </div>
          ))}
        </div>

        {/* ── Daily Quests ──────────────────────────────────────────────── */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              {isPT ? 'Missões Diárias' : 'Daily Quests'}
            </h2>
            <span className="text-xs text-white/25">
              {completedQuests.length}/{dailyQuestsList.length} {isPT ? 'concluídas' : 'done'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <AnimatePresence>
              {dailyQuestsList.map((quest, i) => {
                const isCompleted = completedQuests.includes(quest.id)
                return (
                  <motion.div
                    key={quest.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ scale: isCompleted ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCompleteQuest(quest)}
                    className="relative overflow-hidden p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-300"
                    style={{
                      background: isCompleted ? 'rgba(57,255,20,0.07)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isCompleted ? 'rgba(57,255,20,0.25)' : 'rgba(255,255,255,0.06)'}`,
                    }}
                  >
                    {isCompleted && (
                      <div className="absolute inset-0 shimmer pointer-events-none" style={{ opacity: 0.5 }} />
                    )}
                    <div className="flex items-center gap-3 relative z-10">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                        style={{ background: isCompleted ? 'rgba(57,255,20,0.15)' : 'rgba(255,255,255,0.04)' }}
                      >
                        {quest.icon}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${isCompleted ? '' : 'text-white'}`}
                          style={{ color: isCompleted ? '#39FF14' : undefined }}>
                          {isPT ? quest.title : quest.titleEN}
                        </p>
                        <p className="text-xs text-yellow-400 font-bold">+{quest.xp} XP</p>
                      </div>
                    </div>
                    <div className="relative z-10">
                      {isCompleted ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                          <CheckCircle2 className="h-6 w-6" style={{ color: '#39FF14' }} />
                        </motion.div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-white/15" />
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Weekly Chart ──────────────────────────────────────────────── */}
        <div
          className="rounded-2xl p-5 mb-5"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider">
              {isPT ? 'Treinos esta semana' : "This week's workouts"}
            </h2>
            <Link href="/workouts">
              <span className="text-xs font-semibold flex items-center gap-1 hover:underline" style={{ color: '#39FF14' }}>
                {isPT ? 'Ver todos' : 'View all'} <ArrowUpRight className="h-3 w-3" />
              </span>
            </Link>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <ReferenceLine y={0} stroke="rgba(255,255,255,0.05)" />
                <Bar dataKey="count" radius={[8, 8, 4, 4]}>
                  {weeklyData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.count > 0 ? '#39FF14' : 'rgba(255,255,255,0.05)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Quick Actions ─────────────────────────────────────────────── */}
        <p className="text-xs text-white/25 uppercase tracking-widest mb-3">
          {isPT ? 'Acesso Rápido' : 'Quick Access'}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <div
                className="p-5 rounded-2xl border cursor-pointer group transition-all duration-300 hover:scale-105"
                style={{
                  background: `${action.color}08`,
                  borderColor: `${action.color}15`,
                }}
              >
                <div className="text-2xl mb-3">{action.emoji}</div>
                <p className="font-bold text-sm text-white">{action.label}</p>
                <ChevronRight
                  className="h-4 w-4 mt-1 opacity-30 group-hover:opacity-80 transition-all group-hover:translate-x-0.5"
                  style={{ color: action.color }}
                />
              </div>
            </Link>
          ))}
        </div>

        {/* ── Library shortcut ──────────────────────────────────────────── */}
        <Link href="/library">
          <div
            className="p-4 rounded-2xl border flex items-center justify-between group transition-all duration-300 hover:scale-[1.01] mb-5"
            style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.1)' }}>
                <BookOpen className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">{t('nav.library')}</p>
                <p className="text-xs text-white/30">
                  {isPT ? '45 exercícios com instruções' : '45 exercises with instructions'}
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        {/* ── Badges Showcase ───────────────────────────────────────────── */}
        <div
          className="rounded-2xl p-5"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              {isPT ? 'Conquistas' : 'Badges'}
            </h2>
            <span className="text-xs text-white/25">{earnedBadges.length} / {badges.length}</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {badges.map((badge, i) => {
              const isEarned = earnedBadges.some(b => b.id === badge.id)
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (i * 0.07) }}
                  className="snap-center flex-shrink-0 w-24 p-3 rounded-2xl flex flex-col items-center text-center transition-all"
                  style={{
                    background: isEarned ? 'rgba(251,191,36,0.07)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isEarned ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.05)'}`,
                    opacity: isEarned ? 1 : 0.4,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2"
                    style={{
                      background: isEarned ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.04)',
                      boxShadow: isEarned ? '0 0 12px rgba(251,191,36,0.25)' : 'none',
                    }}
                  >
                    {isEarned ? badge.icon : <Lock className="w-4 h-4 text-white/20" />}
                  </div>
                  <p className="text-[9px] uppercase tracking-wider font-bold text-white leading-tight">
                    {isPT ? badge.name : badge.nameEN}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
