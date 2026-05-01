'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Moon, Zap, BarChart2, Plus } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'
import { getSleepLogs, saveSleepLog, getSleepByDay } from '@/lib/storage'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

type Quality = 'poor' | 'average' | 'good' | 'excellent'

const QUALITY_CONFIG: Record<Quality, { color: string; bg: string; border: string; emoji: string; label_pt: string; label_en: string }> = {
  poor:      { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',    border: 'rgba(239,68,68,0.25)',    emoji: '😴', label_pt: 'Ruim',      label_en: 'Poor' },
  average:   { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',   border: 'rgba(251,191,36,0.25)',   emoji: '😐', label_pt: 'Médio',     label_en: 'Average' },
  good:      { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',   border: 'rgba(96,165,250,0.25)',   emoji: '😊', label_pt: 'Bom',       label_en: 'Good' },
  excellent: { color: '#39FF14', bg: 'rgba(57,255,20,0.08)',    border: 'rgba(57,255,20,0.25)',    emoji: '⚡', label_pt: 'Excelente', label_en: 'Excellent' },
}

// ── Sleep Score Ring ──────────────────────────────────────────────────────────
function SleepScoreRing({ hours, quality }: { hours: number; quality: Quality }) {
  const maxHours = 10
  const pct = Math.min(hours / maxHours, 1)
  const cfg = QUALITY_CONFIG[quality]
  const size = 120, stroke = 8
  const radius = (size - stroke * 2) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - pct)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" strokeWidth={stroke} stroke="rgba(255,255,255,0.05)" />
          <circle
            cx={size/2} cy={size/2} r={radius} fill="none"
            strokeWidth={stroke} stroke={cfg.color} strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ filter: `drop-shadow(0 0 6px ${cfg.color}80)`, transition: 'stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl">{cfg.emoji}</span>
          <span className="text-sm font-black text-white">{hours}h</span>
        </div>
      </div>
      <span className="text-xs font-semibold" style={{ color: cfg.color }}>{cfg.label_pt}</span>
    </div>
  )
}

export default function SleepPage() {
  const { t, language } = useLanguage()
  const isPT = language === 'pt-BR'

  const [mounted, setMounted]           = useState(false)
  const [hours, setHours]               = useState('')
  const [quality, setQuality]           = useState<Quality>('good')
  const [logs, setLogs]                 = useState<any[]>([])
  const [averageHours, setAverageHours] = useState(0)
  const [chartData, setChartData]       = useState<any[]>([])
  const [showForm, setShowForm]         = useState(false)

  useEffect(() => { setMounted(true); refreshData() }, [])

  const refreshData = () => {
    const sleepLogs = getSleepLogs()
    setLogs(sleepLogs)
    if (sleepLogs.length > 0) {
      const last7 = sleepLogs.slice(-7)
      const avg = last7.reduce((s: number, l: any) => s + (l?.hours ?? 0), 0) / last7.length
      setAverageHours(Math.round(avg * 10) / 10)
    }
    setChartData(getSleepByDay(7, language))
  }

  const handleSave = () => {
    if (!hours) return
    const hoursNum = parseFloat(hours)
    if (hoursNum < 0 || hoursNum > 24) {
      toast.error(isPT ? 'Horas inválidas (0–24)' : 'Invalid hours (0–24)')
      return
    }
    saveSleepLog({ id: Date.now().toString(), date: new Date().toISOString(), hours: hoursNum, quality })
    refreshData()
    setHours('')
    setShowForm(false)
    toast.success(isPT ? `Sono registrado! ${QUALITY_CONFIG[quality].emoji} ${hoursNum}h` : `Sleep logged! ${QUALITY_CONFIG[quality].emoji} ${hoursNum}h`, { duration: 2500 })
  }

  const sleepScore: Quality = averageHours >= 8 ? 'excellent' : averageHours >= 7 ? 'good' : averageHours >= 6 ? 'average' : 'poor'
  const qualities: Quality[] = ['poor', 'average', 'good', 'excellent']

  if (!mounted) return null

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-14" style={{ background: '#050505' }}>
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 pt-8 animate-fade-in">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">{t('sleep.title')}</h1>
            <p className="text-white/30 text-sm mt-1">
              {isPT ? 'Monitore sua qualidade de sono' : 'Track your sleep quality'}
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm text-black transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #39FF14, #22c55e)', boxShadow: '0 0 16px rgba(57,255,20,0.3)' }}
          >
            <Plus className="h-4 w-4" />
            {isPT ? 'Registrar' : 'Log Sleep'}
          </button>
        </div>

        {/* Log Form (collapsible) */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -12, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div
                className="rounded-3xl p-6"
                style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}
              >
                <h2 className="text-lg font-bold text-white mb-5">{t('sleep.logSleep')}</h2>
                <div className="space-y-5">
                  {/* Hours */}
                  <div>
                    <Label className="text-white/40 text-sm mb-2 block">{t('sleep.hours')}</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="hours" type="number" step="0.5" min="0" max="24"
                        value={hours} onChange={(e) => setHours(e.target.value)}
                        placeholder="7.5"
                        className="w-32 text-2xl font-black text-center h-14 rounded-xl bg-white/[0.05] border-white/[0.08] text-white"
                      />
                      <span className="text-3xl font-black text-white/30">h</span>
                      {hours && parseFloat(hours) > 0 && (
                        <SleepScoreRing hours={parseFloat(hours)} quality={quality} />
                      )}
                    </div>
                  </div>

                  {/* Quality */}
                  <div>
                    <Label className="text-white/40 text-sm mb-3 block">{t('sleep.quality')}</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {qualities.map((q) => {
                        const cfg = QUALITY_CONFIG[q]
                        return (
                          <button
                            key={q}
                            onClick={() => setQuality(q)}
                            className="p-3 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-1"
                            style={{
                              borderColor: quality === q ? cfg.border : 'rgba(255,255,255,0.07)',
                              background: quality === q ? cfg.bg : 'rgba(255,255,255,0.02)',
                            }}
                          >
                            <span className="text-2xl">{cfg.emoji}</span>
                            <span
                              className="text-xs font-semibold"
                              style={{ color: quality === q ? cfg.color : 'rgba(255,255,255,0.35)' }}
                            >
                              {isPT ? cfg.label_pt : cfg.label_en}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={!hours}
                    className="w-full py-4 rounded-2xl font-black text-black transition-all duration-300 disabled:opacity-30 hover:scale-[1.01]"
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                      boxShadow: hours ? '0 0 20px rgba(59,130,246,0.3)' : 'none',
                    }}
                  >
                    <Moon className="h-5 w-5 inline mr-2" />
                    {t('common.save')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            {
              label: t('sleep.averageHours'),
              value: `${averageHours}h`,
              sub: t('sleep.last7days'),
              icon: Moon,
              color: '#60a5fa',
            },
            {
              label: isPT ? 'Qualidade Média' : 'Average Quality',
              value: `${QUALITY_CONFIG[sleepScore].emoji} ${isPT ? QUALITY_CONFIG[sleepScore].label_pt : QUALITY_CONFIG[sleepScore].label_en}`,
              sub: isPT ? 'baseado na média' : 'based on average',
              icon: Zap,
              color: QUALITY_CONFIG[sleepScore].color,
            },
            {
              label: isPT ? 'Total de registros' : 'Total logs',
              value: `${logs.length}`,
              sub: isPT ? 'noites registradas' : 'nights logged',
              icon: BarChart2,
              color: '#39FF14',
            },
          ].map(({ label, value, sub, icon: Icon, color }) => (
            <div
              key={label}
              className="rounded-2xl p-5 card-neon-hover"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-white/35 uppercase tracking-wider mb-2">{label}</p>
                  <p className="text-3xl font-black text-white">{value}</p>
                  <p className="text-xs text-white/25 mt-1">{sub}</p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}12` }}>
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sleep Chart */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <h2 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-5">
            {isPT ? 'Histórico de sono (7 dias)' : 'Sleep history (7 days)'}
          </h2>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 12]} tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: 'rgba(255,255,255,0.4)' }}
                  formatter={(val: any) => [`${val}h`, isPT ? 'Sono' : 'Sleep']}
                />
                <ReferenceLine y={8} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" label={{ value: '8h', fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} />
                <Area type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={2.5} fill="url(#sleepGrad)"
                  dot={{ fill: '#60a5fa', strokeWidth: 0, r: 3 }} activeDot={{ r: 5, fill: '#60a5fa' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Logs */}
        <div>
          <h2 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-3">
            {isPT ? 'Registros Recentes' : 'Recent Logs'}
          </h2>
          {logs.length === 0 ? (
            <div className="text-center py-16">
              <Moon className="h-12 w-12 mx-auto mb-3 text-white/10" />
              <p className="text-white/25 text-sm">
                {isPT ? 'Nenhum registro ainda' : 'No logs yet'}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 text-sm font-semibold hover:underline"
                style={{ color: '#3b82f6' }}
              >
                {isPT ? '+ Registrar primeira noite' : '+ Log first night'}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {[...logs].reverse().slice(0, 10).map((log: any) => {
                const cfg = QUALITY_CONFIG[log.quality as Quality] ?? QUALITY_CONFIG.average
                return (
                  <div
                    key={log.id}
                    className="p-4 rounded-2xl flex items-center justify-between card-neon-hover"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: cfg.bg }}
                      >
                        {cfg.emoji}
                      </div>
                      <div>
                        <p className="font-black text-white text-lg leading-none">{log.hours}h</p>
                        <p className="text-xs text-white/30 mt-0.5">
                          {new Date(log.date).toLocaleDateString(language, { weekday: 'short', day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold border"
                      style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.color }}
                    >
                      {isPT ? cfg.label_pt : cfg.label_en}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
