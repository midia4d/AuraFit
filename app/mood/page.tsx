'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Label } from '@/components/ui/label'
import { Smile, Heart, Zap, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'
import { getMoodLogs, saveMoodLog, getMoodByDay } from '@/lib/storage'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

const MOOD_EMOJIS = ['😫','😞','😕','😐','🙂','😊','😁','💪','🔥','⚡']

const getMoodGradient = (energy: number, motivation: number) => {
  const avg = (energy + motivation) / 2
  if (avg >= 8) return 'linear-gradient(135deg, rgba(57,255,20,0.08), rgba(34,197,94,0.04))'
  if (avg >= 6) return 'linear-gradient(135deg, rgba(96,165,250,0.06), rgba(167,139,250,0.04))'
  if (avg >= 4) return 'linear-gradient(135deg, rgba(251,191,36,0.06), rgba(251,146,60,0.04))'
  return 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(236,72,153,0.03))'
}

const getMoodColor = (value: number, type: 'energy' | 'motivation') => {
  if (type === 'energy') {
    return value >= 8 ? '#39FF14' : value >= 5 ? '#fbbf24' : '#ef4444'
  }
  return value >= 8 ? '#60a5fa' : value >= 5 ? '#a78bfa' : '#f97316'
}

function MoodEmoji({ value }: { value: number }) {
  return <span className="text-3xl select-none">{MOOD_EMOJIS[Math.max(0, Math.min(9, value - 1))]}</span>
}

export default function MoodPage() {
  const { t, language } = useLanguage()
  const isPT = language === 'pt-BR'

  const [mounted, setMounted]       = useState(false)
  const [energy, setEnergy]         = useState(5)
  const [motivation, setMotivation] = useState(5)
  const [logs, setLogs]             = useState<any[]>([])
  const [chartData, setChartData]   = useState<any[]>([])
  const [savedToday, setSavedToday] = useState(false)

  useEffect(() => { setMounted(true); refreshData() }, [])

  const refreshData = () => {
    const moodLogs = getMoodLogs()
    setLogs(moodLogs)
    setChartData(getMoodByDay(7, language))
    const today = new Date().toDateString()
    const todayLog = moodLogs.find((l: any) => new Date(l.date).toDateString() === today)
    if (todayLog) {
      setEnergy(todayLog.energy)
      setMotivation(todayLog.motivation)
      setSavedToday(true)
    }
  }

  const handleSave = () => {
    saveMoodLog({ id: Date.now().toString(), date: new Date().toISOString(), energy, motivation })
    setSavedToday(true)
    refreshData()
    const avg = Math.round((energy + motivation) / 2)
    const emoji = MOOD_EMOJIS[Math.max(0, Math.min(9, avg - 1))]
    toast.success(isPT ? `Check-in salvo! ${emoji} ${avg}/10` : `Check-in saved! ${emoji} ${avg}/10`, { duration: 2500 })
  }

  const avg = Math.round((energy + motivation) / 2)
  const bgGradient = getMoodGradient(energy, motivation)

  if (!mounted) return null

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-14" style={{ background: '#050505' }}>
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 pt-8 animate-fade-in">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">{t('mood.title')}</h1>
          <p className="text-white/30 text-sm mt-1">
            {isPT ? 'Como você está hoje?' : 'How are you feeling today?'}
          </p>
        </div>

        {/* ── Check-in Card ──────────────────────────────────────────────── */}
        <motion.div
          animate={{ background: bgGradient }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl p-6 mb-6 border"
          style={{
            background: bgGradient,
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Header row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <MoodEmoji value={avg} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{t('mood.howFeeling')}</h2>
                <p className="text-sm text-white/30">{isPT ? `Média: ${avg}/10` : `Average: ${avg}/10`}</p>
              </div>
            </div>
            {savedToday && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(57,255,20,0.1)', color: '#39FF14', border: '1px solid rgba(57,255,20,0.2)' }}>
                <CheckCircle2 className="h-3.5 w-3.5" />
                {isPT ? 'Salvo hoje' : 'Saved today'}
              </div>
            )}
          </div>

          <div className="space-y-8">
            {/* Energy Slider */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-white/60 font-semibold flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(57,255,20,0.12)' }}>
                    <Heart className="h-3.5 w-3.5" style={{ color: '#39FF14' }} />
                  </div>
                  {t('mood.energy')}
                </Label>
                <div className="flex items-center gap-3">
                  <MoodEmoji value={energy} />
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-3xl font-black tabular-nums" style={{ color: getMoodColor(energy, 'energy') }}>
                      {energy}
                    </span>
                    <span className="text-white/30 text-sm">/10</span>
                  </div>
                </div>
              </div>

              {/* Emoji track */}
              <div className="flex justify-between mb-2 px-1">
                {[1,2,3,4,5,6,7,8,9,10].map(v => (
                  <span key={v} className="text-sm transition-all duration-200" style={{ opacity: v === energy ? 1 : 0.2, transform: v === energy ? 'scale(1.4)' : 'scale(1)' }}>
                    {MOOD_EMOJIS[v-1]}
                  </span>
                ))}
              </div>

              <input
                type="range" min="1" max="10" value={energy}
                onChange={(e) => setEnergy(parseInt(e.target.value))}
                className="w-full"
                style={{ background: `linear-gradient(to right, #39FF14 0%, #39FF14 ${(energy / 10) * 100}%, rgba(255,255,255,0.08) ${(energy / 10) * 100}%, rgba(255,255,255,0.08) 100%)` }}
              />
              <div className="flex justify-between text-xs text-white/25 mt-1">
                <span>{t('mood.low')}</span>
                <span>{t('mood.medium')}</span>
                <span>{t('mood.high')}</span>
              </div>
            </div>

            {/* Motivation Slider */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-white/60 font-semibold flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(96,165,250,0.12)' }}>
                    <Zap className="h-3.5 w-3.5" style={{ color: '#60a5fa' }} />
                  </div>
                  {t('mood.motivation')}
                </Label>
                <div className="flex items-center gap-3">
                  <MoodEmoji value={motivation} />
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-3xl font-black tabular-nums" style={{ color: getMoodColor(motivation, 'motivation') }}>
                      {motivation}
                    </span>
                    <span className="text-white/30 text-sm">/10</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mb-2 px-1">
                {[1,2,3,4,5,6,7,8,9,10].map(v => (
                  <span key={v} className="text-sm transition-all duration-200" style={{ opacity: v === motivation ? 1 : 0.2, transform: v === motivation ? 'scale(1.4)' : 'scale(1)' }}>
                    {MOOD_EMOJIS[v-1]}
                  </span>
                ))}
              </div>

              <input
                type="range" min="1" max="10" value={motivation}
                onChange={(e) => setMotivation(parseInt(e.target.value))}
                className="w-full"
                style={{ background: `linear-gradient(to right, #60a5fa 0%, #60a5fa ${(motivation / 10) * 100}%, rgba(255,255,255,0.08) ${(motivation / 10) * 100}%, rgba(255,255,255,0.08) 100%)` }}
              />
              <div className="flex justify-between text-xs text-white/25 mt-1">
                <span>{t('mood.low')}</span>
                <span>{t('mood.medium')}</span>
                <span>{t('mood.high')}</span>
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              className="w-full py-4 rounded-2xl font-black text-base transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
              style={{
                background: avg >= 7
                  ? 'linear-gradient(135deg, #39FF14, #22c55e)'
                  : avg >= 5
                  ? 'linear-gradient(135deg, #60a5fa, #a78bfa)'
                  : 'linear-gradient(135deg, #fbbf24, #f97316)',
                color: '#000',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              <Smile className="h-5 w-5" />
              {savedToday ? (isPT ? 'Atualizar Check-in' : 'Update Check-in') : t('mood.save')}
            </button>
          </div>
        </motion.div>

        {/* ── Mood Chart ─────────────────────────────────────────────────── */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <h2 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-5">
            {isPT ? 'Histórico de humor (7 dias)' : 'Mood history (7 days)'}
          </h2>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: 'rgba(255,255,255,0.4)' }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                  formatter={(value) => (
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {value === 'energy' ? (isPT ? 'Energia' : 'Energy') : (isPT ? 'Motivação' : 'Motivation')}
                    </span>
                  )}
                />
                <Line type="monotone" dataKey="energy" stroke="#39FF14" strokeWidth={2.5}
                  dot={{ fill: '#39FF14', r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} connectNulls={false}
                />
                <Line type="monotone" dataKey="motivation" stroke="#60a5fa" strokeWidth={2.5}
                  dot={{ fill: '#60a5fa', r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Recent Check-ins ───────────────────────────────────────────── */}
        <div>
          <h2 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-3">
            {isPT ? 'Check-ins Recentes' : 'Recent Check-ins'}
          </h2>
          {logs.length === 0 ? (
            <div className="text-center py-16">
              <Smile className="h-12 w-12 mx-auto mb-3 text-white/10" />
              <p className="text-white/25 text-sm">
                {isPT ? 'Nenhum check-in ainda' : 'No check-ins yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {[...logs].reverse().slice(0, 10).map((log: any) => {
                const logAvg = Math.round((log.energy + log.motivation) / 2)
                const energyColor = getMoodColor(log.energy, 'energy')
                const motivColor  = getMoodColor(log.motivation, 'motivation')
                return (
                  <div
                    key={log.id}
                    className="p-4 rounded-2xl flex items-center justify-between card-neon-hover"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{MOOD_EMOJIS[Math.max(0, Math.min(9, logAvg - 1))]}</span>
                      <div>
                        <p className="text-xs text-white/30 mb-1.5">
                          {new Date(log.date).toLocaleDateString(language, { weekday: 'short', day: 'numeric', month: 'short' })}
                        </p>
                        <div className="flex gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" style={{ color: energyColor }} />
                            <span className="font-bold" style={{ color: energyColor }}>{log.energy}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3" style={{ color: motivColor }} />
                            <span className="font-bold" style={{ color: motivColor }}>{log.motivation}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/25">{isPT ? 'Média' : 'Avg'}</p>
                      <p className="text-2xl font-black text-white">
                        {logAvg}<span className="text-sm text-white/25">/10</span>
                      </p>
                    </div>
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
