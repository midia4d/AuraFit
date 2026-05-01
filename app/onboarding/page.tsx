'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Target, TrendingUp, Dumbbell, Zap, Globe, ChevronRight, Check } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'
import { motion, AnimatePresence } from 'framer-motion'

type Goal  = 'bulking' | 'cutting' | 'definition' | 'maintenance'
type Level = 'beginner' | 'intermediate' | 'advanced' | 'gymrat'

const TOTAL_STEPS = 4

export default function OnboardingPage() {
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()
  const [step, setStep] = useState(1)
  const [goal, setGoal] = useState<Goal | null>(null)
  const [level, setLevel] = useState<Level | null>(null)
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [name, setName] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<'pt-BR' | 'en-US'>(language)

  const handleComplete = () => {
    if (!goal || !level || !weight || !height) return
    const userData = {
      name: name || 'Atleta',
      goal,
      level,
      weight: parseFloat(weight),
      height: parseFloat(height),
      createdAt: new Date().toISOString(),
      streak: 0,
      xp: 0,
      totalLevel: 1,
    }
    localStorage?.setItem('aurafi_user', JSON.stringify(userData))
    setLanguage(selectedLanguage)
    router.push('/dashboard')
  }

  const goals: Array<{ id: Goal; icon: any; label: string; desc: string; color: string }> = [
    { id: 'bulking',      icon: TrendingUp, label: t('onboarding.goal.bulking'),     desc: 'Ganhar massa muscular e força',      color: '#39FF14' },
    { id: 'cutting',      icon: Target,     label: t('onboarding.goal.cutting'),     desc: 'Perder gordura mantendo o músculo',  color: '#60a5fa' },
    { id: 'definition',   icon: Dumbbell,   label: t('onboarding.goal.definition'),  desc: 'Definir e tonificar o corpo',        color: '#fb923c' },
    { id: 'maintenance',  icon: Zap,        label: t('onboarding.goal.maintenance'), desc: 'Manter o peso e a saúde em dia',    color: '#a78bfa' },
  ]

  const levels: Array<{ id: Level; label: string; desc: string; emoji: string }> = [
    { id: 'beginner',     label: t('onboarding.level.beginner'),     desc: 'Menos de 6 meses de treino',  emoji: '🌱' },
    { id: 'intermediate', label: t('onboarding.level.intermediate'), desc: '6 meses a 2 anos de treino',  emoji: '⚡' },
    { id: 'advanced',     label: t('onboarding.level.advanced'),     desc: '2 a 5 anos de treino',        emoji: '🔥' },
    { id: 'gymrat',       label: t('onboarding.level.gymrat'),       desc: 'Mais de 5 anos treinando',    emoji: '💪' },
  ]

  const stepConfig = [
    { title: 'Objetivo', subtitle: 'Qual é sua meta principal?' },
    { title: 'Nível',    subtitle: 'Qual é sua experiência?' },
    { title: 'Dados',    subtitle: 'Vamos personalizar seu plano' },
    { title: 'Idioma',   subtitle: 'Escolha seu idioma preferido' },
  ]

  const current = stepConfig[step - 1]

  return (
    <div
      className="min-h-screen flex"
      style={{ background: '#050505' }}
    >
      {/* ── Left Panel (decorative) ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-2/5 relative overflow-hidden flex-col items-center justify-center p-12"
        style={{
          background: 'linear-gradient(135deg, rgba(57,255,20,0.06) 0%, rgba(0,0,0,0) 60%)',
          borderRight: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        {/* Orbs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 orb orb-green opacity-30" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 orb orb-blue opacity-20" />

        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="mb-12">
            <h1 className="text-6xl font-black">
              <span className="text-white">AURA</span>
              <span className="neon-glow" style={{ color: '#39FF14' }}>FIT</span>
            </h1>
            <p className="text-white/40 mt-3 text-lg">Transforme seu corpo</p>
          </div>

          {/* Step preview */}
          <div className="space-y-3">
            {stepConfig.map((s, i) => {
              const isDone = i + 1 < step
              const isActive = i + 1 === step
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 transition-all duration-300"
                  style={{ opacity: isActive ? 1 : isDone ? 0.8 : 0.25 }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 transition-all duration-300"
                    style={{
                      background: isDone ? '#39FF14' : isActive ? 'rgba(57,255,20,0.15)' : 'rgba(255,255,255,0.05)',
                      border: isActive ? '1px solid rgba(57,255,20,0.5)' : isDone ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      color: isDone ? '#000' : isActive ? '#39FF14' : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-white/50'}`}>
                    {s.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Right Panel (form) ──────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <h1 className="text-4xl font-black">
              <span className="text-white">AURA</span>
              <span className="neon-glow-sm" style={{ color: '#39FF14' }}>FIT</span>
            </h1>
          </div>

          {/* Progress dots (mobile) */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-500"
                style={{
                  width: i + 1 === step ? 24 : 8,
                  height: 8,
                  background: i + 1 <= step ? '#39FF14' : 'rgba(255,255,255,0.1)',
                  boxShadow: i + 1 === step ? '0 0 8px #39FF14' : 'none',
                }}
              />
            ))}
          </div>

          {/* Step header */}
          <div className="mb-8">
            <p className="text-sm font-semibold mb-2" style={{ color: '#39FF14' }}>
              Passo {step} de {TOTAL_STEPS}
            </p>
            <h2 className="text-3xl font-black text-white mb-1">{current.title}</h2>
            <p className="text-white/40">{current.subtitle}</p>
          </div>

          {/* Progress bar */}
          <div className="h-1 rounded-full mb-10 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(step / TOTAL_STEPS) * 100}%`,
                background: 'linear-gradient(90deg, #39FF14, #22c55e)',
                boxShadow: '0 0 8px rgba(57,255,20,0.5)',
              }}
            />
          </div>

          {/* Steps */}
          <AnimatePresence mode="wait">

            {/* Step 1: Goal */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 gap-3">
                  {goals.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setGoal(g.id)}
                      className="flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-300"
                      style={{
                        borderColor: goal === g.id ? g.color : 'rgba(255,255,255,0.07)',
                        background: goal === g.id ? `${g.color}10` : 'rgba(255,255,255,0.02)',
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: goal === g.id ? `${g.color}20` : 'rgba(255,255,255,0.05)' }}
                      >
                        <g.icon
                          className="h-6 w-6 transition-colors"
                          style={{ color: goal === g.id ? g.color : 'rgba(255,255,255,0.3)' }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold text-sm ${goal === g.id ? 'text-white' : 'text-white/60'}`}>
                          {g.label}
                        </p>
                        <p className="text-xs text-white/30 mt-0.5">{g.desc}</p>
                      </div>
                      {goal === g.id && (
                        <Check className="h-5 w-5 flex-shrink-0" style={{ color: g.color }} />
                      )}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setStep(2)}
                  disabled={!goal}
                  className="w-full py-4 rounded-2xl font-black text-black transition-all duration-300 disabled:opacity-30 disabled:scale-100 hover:scale-[1.02] flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #39FF14, #22c55e)',
                    boxShadow: goal ? '0 0 20px rgba(57,255,20,0.3)' : 'none',
                  }}
                >
                  Próximo <ChevronRight className="h-5 w-5" />
                </button>
              </motion.div>
            )}

            {/* Step 2: Level */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="grid grid-cols-2 gap-3">
                  {levels.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLevel(l.id)}
                      className="flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300"
                      style={{
                        borderColor: level === l.id ? '#39FF14' : 'rgba(255,255,255,0.07)',
                        background: level === l.id ? 'rgba(57,255,20,0.08)' : 'rgba(255,255,255,0.02)',
                      }}
                    >
                      <span className="text-3xl">{l.emoji}</span>
                      <div className="text-center">
                        <p className={`font-bold text-sm ${level === l.id ? 'text-white' : 'text-white/50'}`}>
                          {l.label}
                        </p>
                        <p className="text-xs text-white/25 mt-0.5">{l.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 rounded-2xl font-semibold text-white/50 border border-white/[0.08] hover:bg-white/[0.04] transition-all"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!level}
                    className="flex-1 py-4 rounded-2xl font-black text-black transition-all duration-300 disabled:opacity-30 hover:scale-[1.02] flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #39FF14, #22c55e)',
                      boxShadow: level ? '0 0 20px rgba(57,255,20,0.3)' : 'none',
                    }}
                  >
                    Próximo <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Stats */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="space-y-4">
                  <div>
                    <Label className="text-white/50 text-sm mb-2 block">
                      Seu nome (opcional)
                    </Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: João Silva"
                      className="bg-white/[0.04] border-white/[0.08] text-white text-base h-12 rounded-xl focus:border-[#39FF14]/50"
                    />
                  </div>
                  <div>
                    <Label className="text-white/50 text-sm mb-2 block">
                      {t('onboarding.stats.weight')} (kg)
                    </Label>
                    <Input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="75"
                      className="bg-white/[0.04] border-white/[0.08] text-white text-base h-12 rounded-xl focus:border-[#39FF14]/50"
                    />
                  </div>
                  <div>
                    <Label className="text-white/50 text-sm mb-2 block">
                      {t('onboarding.stats.height')} (cm)
                    </Label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="175"
                      className="bg-white/[0.04] border-white/[0.08] text-white text-base h-12 rounded-xl focus:border-[#39FF14]/50"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 rounded-2xl font-semibold text-white/50 border border-white/[0.08] hover:bg-white/[0.04] transition-all"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    disabled={!weight || !height}
                    className="flex-1 py-4 rounded-2xl font-black text-black transition-all duration-300 disabled:opacity-30 hover:scale-[1.02] flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #39FF14, #22c55e)',
                      boxShadow: (weight && height) ? '0 0 20px rgba(57,255,20,0.3)' : 'none',
                    }}
                  >
                    Próximo <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Language */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'pt-BR' as const, flag: '🇧🇷', label: 'Português Brasileiro', desc: 'Idioma principal' },
                    { id: 'en-US' as const, flag: '🇺🇸', label: 'English (US)', desc: 'Secondary language' },
                  ].map(({ id, flag, label, desc }) => (
                    <button
                      key={id}
                      onClick={() => setSelectedLanguage(id)}
                      className="flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-300"
                      style={{
                        borderColor: selectedLanguage === id ? '#39FF14' : 'rgba(255,255,255,0.07)',
                        background: selectedLanguage === id ? 'rgba(57,255,20,0.08)' : 'rgba(255,255,255,0.02)',
                      }}
                    >
                      <span className="text-3xl">{flag}</span>
                      <div className="flex-1">
                        <p className={`font-bold ${selectedLanguage === id ? 'text-white' : 'text-white/50'}`}>
                          {label}
                        </p>
                        <p className="text-xs text-white/30 mt-0.5">{desc}</p>
                      </div>
                      {selectedLanguage === id && (
                        <Check className="h-5 w-5 flex-shrink-0" style={{ color: '#39FF14' }} />
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-4 rounded-2xl font-semibold text-white/50 border border-white/[0.08] hover:bg-white/[0.04] transition-all"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleComplete}
                    className="flex-1 py-4 rounded-2xl font-black text-black transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #39FF14, #22c55e)',
                      boxShadow: '0 0 24px rgba(57,255,20,0.4)',
                    }}
                  >
                    <Zap className="h-5 w-5" />
                    Começar!
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
