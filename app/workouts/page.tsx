'use client'

import { useState, useEffect, useRef } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/lib/i18n/language-context'
import { saveWorkout, getWorkoutHistory } from '@/lib/storage'
import { supabase } from '@/lib/supabase'
import { calculateWorkoutXp } from '@/lib/gamification'
import { Dumbbell, Check, History, ChevronLeft, X, Trophy, Timer, Zap, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'abs' | 'cardio'
type CompletedData = Record<string, { sets: number; reps: number; weight: number }>

const GROUP_CONFIG: Record<MuscleGroup, { color: string; emoji: string }> = {
  chest:     { color: '#f97316', emoji: '🏋️' },
  back:      { color: '#60a5fa', emoji: '🔙' },
  legs:      { color: '#34d399', emoji: '🦵' },
  shoulders: { color: '#fbbf24', emoji: '💪' },
  arms:      { color: '#a78bfa', emoji: '💪' },
  abs:       { color: '#f472b6', emoji: '🔥' },
  cardio:    { color: '#fb923c', emoji: '🏃' },
}

function XpGain({ xp, onDone }: { xp: number; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 900)
    return () => clearTimeout(timer)
  }, [onDone])
  return (
    <div className="xp-gain" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 9999 }}>
      +{xp} XP ⚡
    </div>
  )
}

export default function WorkoutsPage() {
  const { t, language } = useLanguage()
  const isPT = language === 'pt-BR'

  const [mounted, setMounted]             = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<MuscleGroup>('chest')
  const [exercises, setExercises]         = useState<any[]>([])
  const [completed, setCompleted]         = useState<CompletedData>({})
  const [showHistory, setShowHistory]     = useState(false)
  const [history, setHistory]             = useState<any[]>([])
  const [xpGain, setXpGain]               = useState<number | null>(null)
  const [elapsedSec, setElapsedSec]       = useState(0)
  const [loading, setLoading]             = useState(false)
  const startTime = useRef<number | null>(null)
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setMounted(true)
    loadExercises('chest')
    setHistory(getWorkoutHistory())
  }, [])

  useEffect(() => {
    if (Object.keys(completed).length === 1 && !timerRef.current) {
      startTime.current = Date.now()
      timerRef.current = setInterval(() => {
        setElapsedSec(Math.floor((Date.now() - (startTime.current ?? 0)) / 1000))
      }, 1000)
    }
    if (Object.keys(completed).length === 0 && timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
      setElapsedSec(0)
    }
  }, [completed])

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  const loadExercises = async (group: MuscleGroup) => {
    setSelectedGroup(group)
    setLoading(true)
    const { data } = await supabase
      .from('exercises')
      .select('*')
      .eq('muscle_group', group)
      .eq('is_active', true)
      .order('name')
    setExercises(data ?? [])
    setCompleted({})
    setLoading(false)
  }

  const handleExerciseComplete = (id: string, sets: number, reps: number, weight: number) => {
    setCompleted((prev) => ({ ...prev, [id]: { sets, reps, weight } }))
    toast.success(isPT ? 'Exercício concluído! 💪' : 'Exercise done! 💪', { duration: 1500 })
  }

  const handleUndoExercise = (id: string) => {
    setCompleted((prev) => { const next = { ...prev }; delete next[id]; return next })
  }

  const handleSaveWorkout = () => {
    const completedCount = Object.keys(completed).length
    if (completedCount === 0) return
    const totalSets = Object.values(completed).reduce((s, ex) => s + (ex?.sets ?? 0), 0)
    const durationMinutes = Math.round(elapsedSec / 60)
    const workout = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      muscleGroup: selectedGroup,
      exercises: Object.entries(completed).map(([id, data]) => ({ id, sets: data.sets, reps: data.reps, weight: data.weight })),
      xpEarned: calculateWorkoutXp(completedCount, totalSets),
      durationMinutes,
    }
    saveWorkout(workout)
    setXpGain(workout.xpEarned)
    setCompleted({})
    setElapsedSec(0)
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    setHistory(getWorkoutHistory())
    toast.success(isPT ? `Treino salvo! +${workout.xpEarned} XP 🏆` : `Workout saved! +${workout.xpEarned} XP 🏆`, { duration: 3000, icon: '⚡' })
  }

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const muscleGroups: Array<{ id: MuscleGroup; labelKey: string }> = [
    { id: 'chest',     labelKey: 'workouts.muscleGroups.chest' },
    { id: 'back',      labelKey: 'workouts.muscleGroups.back' },
    { id: 'legs',      labelKey: 'workouts.muscleGroups.legs' },
    { id: 'shoulders', labelKey: 'workouts.muscleGroups.shoulders' },
    { id: 'arms',      labelKey: 'workouts.muscleGroups.arms' },
    { id: 'abs',       labelKey: 'workouts.muscleGroups.abs' },
    { id: 'cardio',    labelKey: 'workouts.muscleGroups.cardio' },
  ]

  if (!mounted) return null

  const completedCount = Object.keys(completed).length
  const totalExercises = exercises.length
  const progressPct    = totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0
  const groupConfig    = GROUP_CONFIG[selectedGroup]

  // ── History View ──────────────────────────────────────────────────────────
  if (showHistory) {
    return (
      <div className="min-h-screen pb-24 md:pb-8 md:pt-14" style={{ background: '#050505' }}>
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 pt-8 animate-slide-in-up">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setShowHistory(false)}
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/[0.08] hover:bg-white/[0.04] transition-all"
            >
              <ArrowLeft className="h-5 w-5 text-white/50" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-white">{t('workouts.history')}</h1>
              <p className="text-sm text-white/30">{history.length} {isPT ? 'treinos registrados' : 'workouts logged'}</p>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <Dumbbell className="h-10 w-10 text-white/15" />
              </div>
              <p className="text-white/30 text-sm">
                {isPT ? 'Nenhum treino registrado ainda' : 'No workouts logged yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...history].reverse().map((workout: any) => {
                const cfg = GROUP_CONFIG[workout.muscleGroup as MuscleGroup] ?? { color: '#39FF14', emoji: '💪' }
                return (
                  <div
                    key={workout.id}
                    className="p-4 rounded-2xl flex items-center gap-4 card-neon-hover"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: `${cfg.color}12` }}
                    >
                      {cfg.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm">
                        {t(`workouts.muscleGroups.${workout.muscleGroup}`)}
                      </p>
                      <div className="flex items-center gap-3 text-xs mt-1">
                        <span className="font-semibold" style={{ color: cfg.color }}>
                          {workout.exercises.length} {isPT ? 'exercícios' : 'exercises'}
                        </span>
                        <span className="text-yellow-400 font-bold">+{workout.xpEarned} XP</span>
                        {workout.durationMinutes > 0 && (
                          <span className="text-white/30">{workout.durationMinutes} min</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-white/25 flex-shrink-0">
                      {new Date(workout.date).toLocaleDateString(language, { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Main View ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-14" style={{ background: '#050505' }}>
      <Navigation />

      {xpGain !== null && <XpGain xp={xpGain} onDone={() => setXpGain(null)} />}

      {/* Workout progress bar (sticky) */}
      {completedCount > 0 && (
        <div className="fixed top-0 left-0 right-0 z-40 h-1 md:top-14">
          <div
            className="h-full transition-all duration-700"
            style={{
              width: `${progressPct}%`,
              background: `linear-gradient(90deg, ${groupConfig.color}, ${groupConfig.color}aa)`,
              boxShadow: `0 0 8px ${groupConfig.color}80`,
            }}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 pt-8 animate-fade-in">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-white">{t('workouts.title')}</h1>
            {completedCount > 0 && (
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1.5">
                  <Timer className="h-4 w-4" style={{ color: groupConfig.color }} />
                  <span className="font-mono font-bold text-sm" style={{ color: groupConfig.color }}>
                    {formatTime(elapsedSec)}
                  </span>
                </div>
                <span className="text-white/30 text-sm">•</span>
                <span className="text-white/50 text-sm">
                  {completedCount}/{totalExercises} {isPT ? 'concluídos' : 'done'}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.08] text-sm text-white/50 hover:bg-white/[0.04] hover:text-white transition-all"
          >
            <History className="h-4 w-4" />
            {t('workouts.history')}
          </button>
        </div>

        {/* Muscle Group Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {muscleGroups.map((group) => {
            const isActive = selectedGroup === group.id
            const cfg = GROUP_CONFIG[group.id]
            return (
              <button
                key={group.id}
                onClick={() => loadExercises(group.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap text-sm font-semibold transition-all duration-200 flex-shrink-0"
                style={
                  isActive
                    ? {
                        background: `${cfg.color}15`,
                        border: `1px solid ${cfg.color}40`,
                        color: cfg.color,
                        boxShadow: `0 0 12px ${cfg.color}20`,
                      }
                    : {
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        color: 'rgba(255,255,255,0.35)',
                      }
                }
              >
                <span>{cfg.emoji}</span>
                {t(group.labelKey)}
              </button>
            )
          })}
        </div>

        {/* Exercise Cards */}
        <div className="space-y-3 mb-6">
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 rounded-2xl shimmer" style={{ background: 'rgba(255,255,255,0.03)' }} />
              ))}
            </div>
          ) : exercises.length === 0 ? (
            <div className="text-center py-16 text-white/25 text-sm">
              {isPT ? 'Nenhum exercício encontrado para este grupo.' : 'No exercises found for this group.'}
            </div>
          ) : exercises.map((exercise: any) => {
            const isDone = !!completed[exercise.id]
            const name   = isPT ? exercise.name : exercise.name_en || exercise.name
            return (
              <motion.div
                key={exercise.id}
                layout
                animate={{ opacity: 1 }}
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: isDone ? `${groupConfig.color}08` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isDone ? `${groupConfig.color}30` : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                <div className="flex gap-4 p-4">
                  {/* Image */}
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <Image
                      src={exercise.image}
                      alt={name}
                      fill
                      className={`object-cover transition-all duration-300 ${isDone ? 'opacity-40' : ''}`}
                    />
                    {isDone && (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: `${groupConfig.color}20` }}
                      >
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                          <Check className="h-8 w-8" style={{ color: groupConfig.color }} />
                        </motion.div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-white mb-0.5 truncate">{name}</h3>
                    <p className="text-xs text-white/30 mb-3">
                      {isPT ? exercise.muscles_worked : exercise.muscles_worked_en || exercise.muscles_worked}
                    </p>

                    {!isDone ? (
                      <ExerciseInputRow
                        exercise={exercise}
                        isPT={isPT}
                        color={groupConfig.color}
                        onComplete={(sets, reps, weight) => handleExerciseComplete(exercise.id, sets, reps, weight)}
                        setsLabel={t('workouts.sets')}
                        repsLabel={t('workouts.reps')}
                        weightLabel={t('workouts.weight')}
                      />
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold" style={{ color: groupConfig.color }}>
                          {completed[exercise.id].sets} × {completed[exercise.id].reps}
                          {completed[exercise.id].weight > 0 ? ` @ ${completed[exercise.id].weight} kg` : ''}
                        </span>
                        <button
                          onClick={() => handleUndoExercise(exercise.id)}
                          className="text-xs text-white/25 hover:text-white/50 flex items-center gap-1 transition-colors"
                        >
                          <X className="h-3 w-3" />
                          {isPT ? 'Desfazer' : 'Undo'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Save Workout CTA */}
        <AnimatePresence>
          {completedCount > 0 && (
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="sticky bottom-20 md:bottom-4"
            >
              <button
                onClick={handleSaveWorkout}
                className="w-full py-5 rounded-2xl font-black text-black text-base flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg, ${groupConfig.color}, ${groupConfig.color}cc)`,
                  boxShadow: `0 0 30px ${groupConfig.color}50, 0 8px 32px rgba(0,0,0,0.4)`,
                }}
              >
                <Trophy className="h-5 w-5" />
                {isPT ? 'Finalizar Treino' : 'Finish Workout'}
                {' '}({completedCount} {isPT ? 'exercícios' : 'exercises'})
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── ExerciseInputRow ──────────────────────────────────────────────────────────

function ExerciseInputRow({
  exercise, isPT, color, onComplete, setsLabel, repsLabel, weightLabel,
}: {
  exercise: any; isPT: boolean; color: string;
  onComplete: (sets: number, reps: number, weight: number) => void;
  setsLabel: string; repsLabel: string; weightLabel: string;
}) {
  const [sets,   setSets]   = useState('')
  const [reps,   setReps]   = useState('')
  const [weight, setWeight] = useState('')

  const handleSubmit = () => {
    const s = parseInt(sets)
    const r = parseInt(reps)
    const w = parseFloat(weight) || 0
    if (s > 0 && r > 0) onComplete(s, r, w)
  }

  const inputStyle = "h-8 text-xs px-2 rounded-lg text-center font-bold"
  const inputClass = "bg-white/[0.06] border-white/[0.08] text-white"

  return (
    <div className="flex gap-1.5 flex-wrap items-center">
      <Input
        type="number" placeholder={setsLabel} value={sets}
        onChange={(e) => setSets(e.target.value)}
        className={`w-16 ${inputStyle} ${inputClass}`} min="1"
      />
      <span className="text-white/20 text-xs">×</span>
      <Input
        type="number" placeholder={repsLabel} value={reps}
        onChange={(e) => setReps(e.target.value)}
        className={`w-16 ${inputStyle} ${inputClass}`} min="1"
      />
      <Input
        type="number" placeholder={isPT ? 'Peso' : 'Wt'} value={weight}
        onChange={(e) => setWeight(e.target.value)}
        className={`w-20 ${inputStyle} ${inputClass}`} min="0" step="0.5"
      />
      <button
        onClick={handleSubmit}
        disabled={!sets || !reps}
        className="h-8 px-3 rounded-lg font-black text-black text-xs transition-all duration-200 disabled:opacity-30 hover:scale-105"
        style={{ background: color, boxShadow: `0 0 8px ${color}60` }}
      >
        <Check className="h-4 w-4" />
      </button>
    </div>
  )
}
