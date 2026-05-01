'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Lock, Flame, Beef, Wheat, Droplets, ChevronRight, Crown } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'
import { getUserData } from '@/lib/storage'
import { supabase, getDeviceId } from '@/lib/supabase'
import Link from 'next/link'

// ── Macro Ring ────────────────────────────────────────────────────────────────
function MacroRing({
  protein, carbs, fats, calories
}: {
  protein: number; carbs: number; fats: number; calories: number;
}) {
  const total = protein + carbs + fats || 1
  const proteinPct = protein / total
  const carbsPct   = carbs / total
  const fatsPct    = fats / total

  const size = 140
  const stroke = 10
  const radius = (size - stroke * 2) / 2
  const circumference = 2 * Math.PI * radius
  const cx = size / 2, cy = size / 2

  // Segments: protein (green), carbs (orange), fats (yellow)
  const segments = [
    { pct: proteinPct, color: '#39FF14', offset: 0 },
    { pct: carbsPct,   color: '#fb923c', offset: proteinPct },
    { pct: fatsPct,    color: '#fbbf24', offset: proteinPct + carbsPct },
  ]

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle cx={cx} cy={cy} r={radius} fill="none" strokeWidth={stroke} stroke="rgba(255,255,255,0.05)" />
          {/* Segments */}
          {segments.map((seg, i) => {
            const dashArray = circumference * seg.pct
            const dashOffset = circumference * (1 - seg.offset) - dashArray
            return (
              <circle
                key={i}
                cx={cx} cy={cy} r={radius} fill="none"
                strokeWidth={stroke}
                stroke={seg.color}
                strokeLinecap="butt"
                strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                strokeDashoffset={circumference - circumference * seg.offset}
                style={{ filter: `drop-shadow(0 0 4px ${seg.color}60)`, transition: 'all 0.8s cubic-bezier(0.22,1,0.36,1)' }}
              />
            )
          })}
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-white">{calories}</span>
          <span className="text-xs text-white/30">kcal</span>
        </div>
      </div>
    </div>
  )
}

export default function DietPage() {
  const { t, language } = useLanguage()
  const isPT = language === 'pt-BR'

  const [mounted, setMounted]   = useState(false)
  const [loading, setLoading]   = useState(true)
  const [currentPlan, setCurrentPlan] = useState<any>(null)
  const [meals, setMeals]       = useState<any[]>([])
  const [premiumPlans, setPremiumPlans] = useState<any[]>([])
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => { setMounted(true); fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const user = getUserData()
      const deviceId = getDeviceId()

      const { data: subData } = await supabase
        .from('user_subscriptions').select('*')
        .eq('device_id', deviceId).eq('plan', 'premium')
        .gt('expires_at', new Date().toISOString()).single()

      const userIsPremium = !!subData
      setIsPremium(userIsPremium)

      const { data: allPlans } = await supabase.from('diet_plans').select('*').eq('is_active', true)

      if (allPlans) {
        setPremiumPlans(allPlans.filter(p => p.is_premium))
        const goal = user?.goal || 'maintenance'
        let targetPlan = userIsPremium ? allPlans.find(p => p.goal === goal && p.is_premium) : null
        if (!targetPlan) targetPlan = allPlans.find(p => p.goal === goal && !p.is_premium)
        if (!targetPlan && allPlans.length > 0) targetPlan = allPlans[0]
        setCurrentPlan(targetPlan)

        if (targetPlan) {
          const { data: mealsData } = await supabase
            .from('diet_meals').select('*')
            .eq('plan_id', targetPlan.id).order('sort_order')
          setMeals(mealsData || [])
        }
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  if (!mounted) return null

  const totalCalories = currentPlan?.total_calories || meals.reduce((acc, m) => acc + (m.calories || 0), 0)
  const totalProtein  = currentPlan?.protein_g || meals.reduce((acc, m) => acc + (m.protein_g || 0), 0)
  const totalCarbs    = currentPlan?.carbs_g || meals.reduce((acc, m) => acc + (m.carbs_g || 0), 0)
  const totalFats     = currentPlan?.fats_g || meals.reduce((acc, m) => acc + (m.fats_g || 0), 0)

  const mealIcons = ['☀️', '🥙', '🌿', '🍽️', '🌙', '⚡']

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-14" style={{ background: '#050505' }}>
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 pt-8">
        <h1 className="text-3xl font-black text-white mb-6">{t('diet.title')}</h1>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-52 rounded-3xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
            <div className="h-36 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
            <div className="h-36 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
          </div>
        ) : currentPlan ? (
          <>
            {/* Current Plan Header */}
            <div
              className="rounded-3xl p-6 mb-6 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(57,255,20,0.07) 0%, rgba(34,197,94,0.04) 50%, rgba(57,255,20,0.05) 100%)',
                border: '1px solid rgba(57,255,20,0.15)',
              }}
            >
              {/* Decorative glow */}
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(57,255,20,0.1) 0%, transparent 70%)' }} />

              {currentPlan.is_premium && (
                <div className="premium-badge inline-flex items-center gap-1 mb-4">
                  <Crown className="h-3 w-3" />
                  PREMIUM
                </div>
              )}

              <p className="text-xs text-white/35 mb-1">{t('diet.currentPlan')}</p>
              <h2 className="text-2xl font-black text-white mb-6">
                {isPT ? currentPlan.name : currentPlan.name_en || currentPlan.name}
              </h2>

              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Macro Ring */}
                <MacroRing
                  protein={totalProtein}
                  carbs={totalCarbs}
                  fats={totalFats}
                  calories={totalCalories}
                />

                {/* Macro details */}
                <div className="flex-1 grid grid-cols-3 gap-4">
                  {[
                    { icon: Beef, label: t('diet.protein'), value: `${totalProtein}g`, color: '#39FF14', bg: 'rgba(57,255,20,0.08)' },
                    { icon: Wheat, label: t('diet.carbs'), value: `${totalCarbs}g`, color: '#fb923c', bg: 'rgba(251,146,60,0.08)' },
                    { icon: Droplets, label: t('diet.fats'), value: `${totalFats}g`, color: '#fbbf24', bg: 'rgba(251,191,36,0.08)' },
                  ].map(({ icon: Icon, label, value, color, bg }) => (
                    <div key={label} className="text-center p-4 rounded-2xl" style={{ background: bg }}>
                      <Icon className="h-5 w-5 mx-auto mb-2" style={{ color }} />
                      <p className="text-xl font-black" style={{ color }}>{value}</p>
                      <p className="text-xs text-white/35 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Meals Timeline */}
            <div className="mb-8">
              <h2 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-4">
                {isPT ? 'Refeições do Dia' : "Today's Meals"}
              </h2>
              <div className="space-y-3">
                {meals.map((meal, idx) => (
                  <div
                    key={meal.id}
                    className="rounded-2xl overflow-hidden card-neon-hover"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{mealIcons[idx % mealIcons.length]}</span>
                          <div>
                            <h3 className="font-bold text-white">
                              {isPT ? meal.name : meal.name_en || meal.name}
                            </h3>
                            <p className="text-xs text-white/30 mt-0.5">
                              {meal.calories} kcal • {meal.protein_g}g prot • {meal.carbs_g}g carbs • {meal.fats_g}g gord
                            </p>
                          </div>
                        </div>
                        <div
                          className="px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                          style={{ background: 'rgba(249,115,22,0.1)', color: '#fb923c' }}
                        >
                          <Flame className="h-3 w-3" />
                          {meal.calories}
                        </div>
                      </div>

                      {/* Macro mini bars */}
                      <div className="flex gap-1.5 mb-4">
                        {[
                          { pct: (meal.protein_g / (meal.protein_g + meal.carbs_g + meal.fats_g || 1)) * 100, color: '#39FF14' },
                          { pct: (meal.carbs_g / (meal.protein_g + meal.carbs_g + meal.fats_g || 1)) * 100,   color: '#fb923c' },
                          { pct: (meal.fats_g / (meal.protein_g + meal.carbs_g + meal.fats_g || 1)) * 100,    color: '#fbbf24' },
                        ].map((bar, i) => (
                          <div key={i} className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <div className="h-full rounded-full" style={{ width: `${bar.pct}%`, background: bar.color, transition: 'width 0.8s ease' }} />
                          </div>
                        ))}
                      </div>

                      {/* Foods list */}
                      <ul className="space-y-1">
                        {(isPT ? meal.foods : meal.foods_en || meal.foods).map((food: string, i: number) => (
                          <li key={i} className="text-sm text-white/50 flex items-start gap-2 leading-snug">
                            <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: '#39FF14' }}>▸</span>
                            {food}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}

                {meals.length === 0 && (
                  <div className="text-center py-12 text-white/25 text-sm">
                    {isPT ? 'Refeições ainda não cadastradas para este plano.' : 'No meals added for this plan yet.'}
                  </div>
                )}
              </div>
            </div>

            {/* Premium Teaser */}
            {!isPremium && premiumPlans.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  {isPT ? 'Planos Premium' : 'Premium Plans'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {premiumPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="rounded-2xl p-6 relative overflow-hidden group cursor-pointer"
                      style={{
                        background: 'rgba(251,191,36,0.04)',
                        border: '1px solid rgba(251,191,36,0.15)',
                      }}
                    >
                      <div className="premium-badge inline-flex items-center gap-1 mb-3">
                        <Crown className="h-3 w-3" />
                        PREMIUM
                      </div>
                      <h3 className="font-black text-xl text-white mb-1">
                        {isPT ? plan.name : plan.name_en || plan.name}
                      </h3>
                      <p className="text-sm text-white/35">{plan.total_calories} kcal</p>

                      {/* Lock overlay */}
                      <div className="absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(8px)' }}>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-black transition-all hover:scale-105"
                          style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', boxShadow: '0 0 20px rgba(251,191,36,0.4)' }}
                        >
                          <Lock className="h-4 w-4" />
                          {isPT ? 'Desbloquear' : 'Unlock'}
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 text-white/25">
            {isPT ? 'Nenhum plano ativo encontrado.' : 'No active plan found.'}
          </div>
        )}
      </div>
    </div>
  )
}
