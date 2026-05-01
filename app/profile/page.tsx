'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  User, Trophy, Flame, TrendingUp, Globe, Award,
  Bell, AlertTriangle, Target, Scale, Copy, Crown,
  ChevronDown, ChevronRight, Settings, Shield, Zap
} from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'
import {
  getUserData, getWorkoutHistory, saveUserData,
  getNotificationPrefs, saveNotificationPrefs,
} from '@/lib/storage'
import { calculateLevel, badges, checkBadges } from '@/lib/gamification'
import { supabase, getDeviceId } from '@/lib/supabase'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

// ── Collapsible Section ───────────────────────────────────────────────────────
function Section({
  title, icon: Icon, iconColor = '#39FF14', defaultOpen = true, children
}: {
  title: string; icon: any; iconColor?: string; defaultOpen?: boolean; children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div
      className="rounded-2xl overflow-hidden mb-4"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${iconColor}15` }}>
            <Icon className="h-4 w-4" style={{ color: iconColor }} />
          </div>
          <span className="font-bold text-white text-sm">{title}</span>
        </div>
        <ChevronDown
          className="h-4 w-4 text-white/30 transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-5 pb-5 border-t border-white/[0.04]">
              <div className="pt-4">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const { t, language, setLanguage } = useLanguage()
  const isPT = language === 'pt-BR'

  const [mounted, setMounted]             = useState(false)
  const [userData, setUserData]           = useState<any>(null)
  const [earnedBadges, setEarnedBadges]   = useState<any[]>([])
  const [totalWorkouts, setTotalWorkouts] = useState(0)
  const [deviceId, setDeviceId]           = useState('')
  const [isPremium, setIsPremium]         = useState(false)
  const [premiumExpires, setPremiumExpires] = useState<string | null>(null)
  const [notifEnabled, setNotifEnabled]   = useState(false)
  const [notifTime, setNotifTime]         = useState('08:00')
  const [permDenied, setPermDenied]       = useState(false)
  const [editWeight, setEditWeight]       = useState('')
  const [editHeight, setEditHeight]       = useState('')
  const [editName, setEditName]           = useState('')

  useEffect(() => {
    setMounted(true)
    const user = getUserData()
    if (!user) { router.push('/onboarding'); return }
    setUserData(user)
    setEditWeight(user.weight?.toString() ?? '')
    setEditHeight(user.height?.toString() ?? '')
    setEditName(user.name ?? '')
    const history = getWorkoutHistory()
    setTotalWorkouts(history?.length ?? 0)
    setEarnedBadges(checkBadges(user, history?.length ?? 0))
    const prefs = getNotificationPrefs()
    setNotifEnabled(prefs.enabled)
    setNotifTime(prefs.time ?? '08:00')
    if ('Notification' in window && Notification.permission === 'denied') setPermDenied(true)
    const fetchPremium = async () => {
      const did = getDeviceId()
      setDeviceId(did)
      const { data } = await supabase
        .from('user_subscriptions').select('*')
        .eq('device_id', did).eq('plan', 'premium')
        .gt('expires_at', new Date().toISOString()).single()
      if (data) { setIsPremium(true); setPremiumExpires(data.expires_at) }
    }
    fetchPremium()
  }, [])

  const handleSaveStats = () => {
    const user = getUserData()
    if (!user) return
    user.weight = parseFloat(editWeight) || user.weight
    user.height = parseFloat(editHeight) || user.height
    user.name   = editName
    saveUserData(user)
    setUserData(user)
    toast.success(isPT ? 'Dados atualizados! ✅' : 'Data updated! ✅')
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(deviceId)
    toast.success(isPT ? 'Device ID copiado!' : 'Device ID copied!')
  }

  const handleNotifToggle = async (checked: boolean) => {
    if (checked) {
      if (!('Notification' in window)) { toast.error(isPT ? 'Não suportado' : 'Not supported'); return }
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') { setPermDenied(true); toast.error(isPT ? 'Permissão negada.' : 'Permission denied.', { duration: 4000 }); return }
    }
    setNotifEnabled(checked)
    saveNotificationPrefs({ enabled: checked, time: notifTime })
    toast.success(checked ? (isPT ? `Lembretes às ${notifTime} 🔔` : `Reminders set for ${notifTime} 🔔`) : (isPT ? 'Lembretes desativados' : 'Reminders disabled'), { duration: 2000 })
  }

  const handleTimeChange = (time: string) => {
    setNotifTime(time)
    if (notifEnabled) { saveNotificationPrefs({ enabled: true, time }); toast.success(isPT ? `Horário: ${time} 🕐` : `Time: ${time} 🕐`, { duration: 1500 }) }
  }

  const handleWeeklyGoalChange = (goal: number) => {
    const user = getUserData()
    if (!user) return
    user.weeklyGoal = goal
    saveUserData(user)
    setUserData({ ...user })
    toast.success(isPT ? `Meta semanal: ${goal} treinos ✅` : `Weekly goal: ${goal} workouts ✅`, { duration: 1500 })
  }

  const handleReset = () => {
    if (!confirm(isPT ? 'Tem certeza? Esta ação não pode ser desfeita.' : 'Are you sure? This cannot be undone.')) return
    localStorage.clear()
    router.push('/')
  }

  if (!mounted || !userData) return null

  const level = calculateLevel(userData.xp ?? 0)
  const xpPct = ((userData.xp ?? 0) % 1000) / 10

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-14" style={{ background: '#050505' }}>
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 pt-8 animate-fade-in">

        {/* ── Profile Hero ─────────────────────────────────────────────── */}
        <div
          className="rounded-3xl p-6 mb-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(57,255,20,0.06) 0%, rgba(34,197,94,0.03) 50%, rgba(57,255,20,0.05) 100%)',
            border: '1px solid rgba(57,255,20,0.12)',
          }}
        >
          {/* bg glow */}
          <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(57,255,20,0.1) 0%, transparent 70%)' }} />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            {/* Avatar ring */}
            <div className="relative flex-shrink-0">
              <svg className="absolute inset-0 -m-1.5" width="92" height="92" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="46" cy="46" r="42" fill="none" strokeWidth="3" stroke="rgba(57,255,20,0.08)" />
                <circle
                  cx="46" cy="46" r="42" fill="none"
                  strokeWidth="3" stroke="#39FF14" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - xpPct / 100)}`}
                  style={{ filter: 'drop-shadow(0 0 4px rgba(57,255,20,0.6))', transition: 'all 1s ease' }}
                />
              </svg>
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(57,255,20,0.1)', border: '1px solid rgba(57,255,20,0.2)' }}
              >
                <User className="h-10 w-10" style={{ color: '#39FF14' }} />
              </div>
              {isPremium && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 p-1.5 rounded-full shadow-lg text-black">
                  <Crown className="h-3 w-3" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h1 className="text-3xl font-black text-white">
                  {userData.name || (isPT ? 'Atleta' : 'Athlete')}
                </h1>
                {isPremium && (
                  <span className="premium-badge self-start mx-auto md:mx-0">PREMIUM</span>
                )}
              </div>
              <p className="text-white/40 text-sm mb-4">
                {t(`onboarding.goal.${userData.goal}`)} • {t(`onboarding.level.${userData.level}`)}
              </p>
              {isPremium && premiumExpires && (
                <p className="text-xs text-yellow-500/60">
                  {isPT ? 'Válido até:' : 'Valid until:'} {new Date(premiumExpires).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3 mt-6">
            {[
              { icon: Trophy, value: level, label: t('dashboard.level'), color: '#39FF14' },
              { icon: Flame,  value: userData.streak ?? 0, label: t('dashboard.streak'), color: '#f97316' },
              { icon: Zap,    value: `${userData.xp ?? 0}`, label: 'XP', color: '#60a5fa' },
              { icon: Award,  value: totalWorkouts, label: isPT ? 'Treinos' : 'Workouts', color: '#fbbf24' },
            ].map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="text-center py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <Icon className="h-5 w-5 mx-auto mb-1.5" style={{ color }} />
                <p className="text-xl font-black" style={{ color }}>{value}</p>
                <p className="text-xs text-white/30 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Premium Access ────────────────────────────────────────────── */}
        <Section title={isPT ? 'Acesso Premium' : 'Premium Access'} icon={Crown} iconColor="#fbbf24">
          <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/40">{isPT ? 'Status da Conta' : 'Account Status'}</span>
              <span className="text-sm font-bold" style={{ color: isPremium ? '#fbbf24' : 'rgba(255,255,255,0.25)' }}>
                {isPremium ? (isPT ? '⭐ Premium Ativo' : '⭐ Premium Active') : (isPT ? 'Plano Gratuito' : 'Free Plan')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/40">{isPT ? 'Seu Device ID' : 'Your Device ID'}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-white/40 bg-white/[0.05] px-2 py-1 rounded-lg">
                  {deviceId.slice(0, 14)}...
                </span>
                <button onClick={handleCopyId} className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors">
                  <Copy className="h-3.5 w-3.5 text-white/30" />
                </button>
              </div>
            </div>
            {!isPremium && (
              <p className="text-xs text-white/25 leading-relaxed pt-1">
                {isPT
                  ? 'Copie seu Device ID e envie para os administradores via WhatsApp para liberar acesso VIP vitalício.'
                  : 'Copy your Device ID and send it to admins via WhatsApp to unlock lifetime VIP access.'}
              </p>
            )}
          </div>
        </Section>

        {/* ── Physical Data ─────────────────────────────────────────────── */}
        <Section title={isPT ? 'Dados Físicos' : 'Physical Data'} icon={Scale} iconColor="#39FF14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {[
              { label: isPT ? 'Nome' : 'Name', value: editName, onChange: setEditName, placeholder: isPT ? 'Seu nome' : 'Your name', type: 'text' },
              { label: `${t('onboarding.stats.weight')} (kg)`, value: editWeight, onChange: setEditWeight, placeholder: '75', type: 'number' },
              { label: `${t('onboarding.stats.height')} (cm)`, value: editHeight, onChange: setEditHeight, placeholder: '175', type: 'number' },
            ].map(({ label, value, onChange, placeholder, type }) => (
              <div key={label}>
                <Label className="text-white/40 text-xs mb-1.5 block">{label}</Label>
                <Input
                  type={type} value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  className="bg-white/[0.04] border-white/[0.08] text-white rounded-xl h-11 focus:border-[#39FF14]/50"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleSaveStats}
            className="px-6 py-2.5 rounded-xl font-bold text-sm text-black transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #39FF14, #22c55e)', boxShadow: '0 0 12px rgba(57,255,20,0.25)' }}
          >
            {t('common.save')}
          </button>
        </Section>

        {/* ── Weekly Goal ───────────────────────────────────────────────── */}
        <Section title={isPT ? 'Meta Semanal de Treinos' : 'Weekly Workout Goal'} icon={Target} iconColor="#fb923c">
          <p className="text-sm text-white/35 mb-4">
            {isPT ? 'Quantos treinos por semana?' : 'How many workouts per week?'}
          </p>
          <div className="flex gap-2 flex-wrap">
            {[3, 4, 5, 6, 7].map((n) => (
              <button
                key={n}
                onClick={() => handleWeeklyGoalChange(n)}
                className="w-12 h-12 rounded-xl font-black text-lg transition-all duration-200 hover:scale-110"
                style={
                  (userData.weeklyGoal ?? 5) === n
                    ? { background: 'rgba(251,146,60,0.15)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.4)', boxShadow: '0 0 12px rgba(251,146,60,0.2)' }
                    : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.07)' }
                }
              >
                {n}
              </button>
            ))}
          </div>
        </Section>

        {/* ── Notifications ─────────────────────────────────────────────── */}
        <Section title={isPT ? 'Lembretes de Treino' : 'Workout Reminders'} icon={Bell} iconColor="#a78bfa">
          {permDenied && (
            <div className="flex items-start gap-2 p-3 rounded-xl mb-4 text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{isPT ? 'Permissão negada. Ative nas configurações do navegador.' : 'Permission denied. Enable in browser settings.'}</span>
            </div>
          )}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white text-sm">{isPT ? 'Ativar lembretes diários' : 'Enable daily reminders'}</p>
                <p className="text-xs text-white/30 mt-0.5">{isPT ? 'Não esqueça de treinar!' : "Don't forget to train!"}</p>
              </div>
              <Switch checked={notifEnabled} onCheckedChange={handleNotifToggle} disabled={permDenied} />
            </div>
            {notifEnabled && !permDenied && (
              <div className="animate-slide-down">
                <Label className="text-white/35 text-xs mb-2 block">{isPT ? 'Horário do lembrete' : 'Reminder time'}</Label>
                <Input
                  type="time" value={notifTime} onChange={(e) => handleTimeChange(e.target.value)}
                  className="bg-white/[0.04] border-white/[0.08] text-white w-36 font-mono rounded-xl"
                />
              </div>
            )}
          </div>
        </Section>

        {/* ── Achievements ──────────────────────────────────────────────── */}
        <Section title={isPT ? 'Conquistas' : 'Achievements'} icon={Trophy} iconColor="#fbbf24" defaultOpen={false}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {badges.map((badge) => {
              const earned = earnedBadges.some((b) => b.id === badge.id)
              return (
                <div
                  key={badge.id}
                  className="p-4 rounded-2xl border-2 text-center transition-all duration-300"
                  style={{
                    borderColor: earned ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.06)',
                    background: earned ? 'rgba(251,191,36,0.06)' : 'rgba(255,255,255,0.02)',
                    opacity: earned ? 1 : 0.4,
                  }}
                >
                  <div
                    className="text-3xl mb-2 mx-auto w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: earned ? 'rgba(251,191,36,0.12)' : 'rgba(255,255,255,0.04)' }}
                  >
                    {badge.icon}
                  </div>
                  <p className="font-bold text-sm text-white">{isPT ? badge.name : badge.nameEN}</p>
                  <p className="text-xs text-white/30 mt-1">{isPT ? badge.description : badge.descriptionEN}</p>
                  {earned && (
                    <span className="inline-block mt-2 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(57,255,20,0.1)', color: '#39FF14' }}>
                      ✓ {isPT ? 'Conquistado' : 'Earned'}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </Section>

        {/* ── Language ──────────────────────────────────────────────────── */}
        <Section title={isPT ? 'Idioma' : 'Language'} icon={Globe} iconColor="#60a5fa" defaultOpen={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(['pt-BR', 'en-US'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className="p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.01]"
                style={{
                  borderColor: language === lang ? 'rgba(96,165,250,0.4)' : 'rgba(255,255,255,0.07)',
                  background: language === lang ? 'rgba(96,165,250,0.08)' : 'rgba(255,255,255,0.02)',
                }}
              >
                <p className="font-bold text-sm" style={{ color: language === lang ? '#60a5fa' : 'rgba(255,255,255,0.5)' }}>
                  {lang === 'pt-BR' ? '🇧🇷 Português Brasileiro' : '🇺🇸 English (US)'}
                </p>
              </button>
            ))}
          </div>
        </Section>

        {/* ── Danger Zone ───────────────────────────────────────────────── */}
        <div
          className="rounded-2xl p-5 mb-8"
          style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <h3 className="font-bold text-red-400 text-sm">{isPT ? 'Zona de Perigo' : 'Danger Zone'}</h3>
          </div>
          <p className="text-xs text-white/25 mb-4">
            {isPT ? 'Esta ação irá deletar todos os seus dados permanentemente.' : 'This will permanently delete all your data.'}
          </p>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl font-bold text-sm border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
          >
            {isPT ? 'Resetar Todos os Dados' : 'Reset All Data'}
          </button>
        </div>
      </div>
    </div>
  )
}
