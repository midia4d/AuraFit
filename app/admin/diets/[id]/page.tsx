'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { ArrowLeft, Plus, Trash2, Save, GripVertical } from 'lucide-react'

const MEAL_TYPES = [
  { key: 'breakfast', label: '☀️ Café da Manhã', labelEN: 'Breakfast' },
  { key: 'snack1',    label: '🍎 Lanche 1',      labelEN: 'Snack 1'   },
  { key: 'lunch',     label: '🍽️ Almoço',         labelEN: 'Lunch'     },
  { key: 'snack2',    label: '🥜 Lanche 2',       labelEN: 'Snack 2'   },
  { key: 'dinner',    label: '🌙 Jantar',          labelEN: 'Dinner'    },
  { key: 'snack3',    label: '🥛 Ceia',            labelEN: 'Supper'    },
]

interface Meal {
  id?: string
  plan_id: string
  meal_type: string
  name: string
  name_en: string
  calories: number
  protein_g: number
  carbs_g: number
  fats_g: number
  foods: string[]
  foods_en: string[]
  sort_order: number
}

export default function DietDetailPage() {
  const { id }   = useParams() as { id: string }
  const router   = useRouter()

  const [plan,   setPlan]   = useState<any>(null)
  const [meals,  setMeals]  = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)

  useEffect(() => { fetchData() }, [id])

  const fetchData = async () => {
    setLoading(true)
    const [{ data: planData }, { data: mealsData }] = await Promise.all([
      supabase.from('diet_plans').select('*').eq('id', id).single(),
      supabase.from('diet_meals').select('*').eq('plan_id', id).order('sort_order'),
    ])
    setPlan(planData)
    setMeals(mealsData ?? [])
    setLoading(false)
  }

  const getMeal = (type: string): Meal => {
    return meals.find(m => m.meal_type === type) || {
      plan_id: id, meal_type: type, name: '', name_en: '',
      calories: 0, protein_g: 0, carbs_g: 0, fats_g: 0,
      foods: [''], foods_en: [''], sort_order: MEAL_TYPES.findIndex(t => t.key === type),
    }
  }

  const updateMeal = (type: string, updates: Partial<Meal>) => {
    setMeals(prev => {
      const existing = prev.find(m => m.meal_type === type)
      if (existing) {
        return prev.map(m => m.meal_type === type ? { ...m, ...updates } : m)
      } else {
        return [...prev, { ...getMeal(type), ...updates }]
      }
    })
  }

  const addFood = (type: string, isEN = false) => {
    const meal = getMeal(type)
    if (isEN) updateMeal(type, { foods_en: [...meal.foods_en, ''] })
    else updateMeal(type, { foods: [...meal.foods, ''] })
  }

  const removeFood = (type: string, idx: number, isEN = false) => {
    const meal = getMeal(type)
    if (isEN) {
      const f = [...meal.foods_en]; f.splice(idx, 1)
      updateMeal(type, { foods_en: f })
    } else {
      const f = [...meal.foods]; f.splice(idx, 1)
      updateMeal(type, { foods: f })
    }
  }

  const updateFood = (type: string, idx: number, val: string, isEN = false) => {
    const meal = getMeal(type)
    if (isEN) {
      const f = [...meal.foods_en]; f[idx] = val
      updateMeal(type, { foods_en: f })
    } else {
      const f = [...meal.foods]; f[idx] = val
      updateMeal(type, { foods: f })
    }
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      // Delete all existing meals for this plan, then re-insert
      await supabase.from('diet_meals').delete().eq('plan_id', id)

      const mealsToSave = meals
        .filter(m => m.name.trim())
        .map((m, i) => ({
          plan_id:   id,
          meal_type: m.meal_type,
          name:      m.name,
          name_en:   m.name_en,
          calories:  m.calories,
          protein_g: m.protein_g,
          carbs_g:   m.carbs_g,
          fats_g:    m.fats_g,
          foods:     m.foods.filter(f => f.trim()),
          foods_en:  m.foods_en.filter(f => f.trim()),
          sort_order: m.sort_order ?? i,
        }))

      if (mealsToSave.length > 0) {
        const { error } = await supabase.from('diet_meals').insert(mealsToSave)
        if (error) throw error
      }

      toast.success('Refeições salvas! ✅')
      fetchData()
    } catch (e: any) {
      toast.error('Erro: ' + e.message)
    }
    setSaving(false)
  }

  if (loading) return (
    <div className="p-6 pt-16 md:pt-6 flex items-center justify-center h-64">
      <div className="text-[#39FF14] animate-pulse">Carregando...</div>
    </div>
  )

  return (
    <div className="p-6 pt-16 md:pt-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-800 rounded-xl transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-400" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-white">{plan?.name}</h1>
          <p className="text-gray-500 text-sm">{plan?.total_calories} kcal • {plan?.goal}</p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#39FF14] hover:bg-[#2FD10F] text-black rounded-xl font-bold text-sm transition-all disabled:opacity-40"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Salvando...' : 'Salvar Tudo'}
        </button>
      </div>

      {/* Meal sections */}
      <div className="space-y-4">
        {MEAL_TYPES.map(({ key, label, labelEN }) => {
          const meal = getMeal(key)
          return (
            <div key={key} className="bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden">
              {/* Meal header */}
              <div className="px-5 py-3 bg-gray-800/40 flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">{label}</h3>
                <span className="text-xs text-gray-500">{labelEN}</span>
              </div>

              <div className="p-5 space-y-4">
                {/* Name + EN name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Nome PT</label>
                    <input
                      value={meal.name}
                      onChange={e => updateMeal(key, { name: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]/60"
                      placeholder="Ex: Café com Ovos"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Nome EN</label>
                    <input
                      value={meal.name_en}
                      onChange={e => updateMeal(key, { name_en: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]/60"
                      placeholder="Eggs with Coffee"
                    />
                  </div>
                </div>

                {/* Macros */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { f: 'calories', l: 'Kcal', s: 'kcal' },
                    { f: 'protein_g', l: 'Proteína', s: 'g' },
                    { f: 'carbs_g', l: 'Carbs', s: 'g' },
                    { f: 'fats_g', l: 'Gorduras', s: 'g' },
                  ].map(({ f, l, s }) => (
                    <div key={f}>
                      <label className="block text-xs text-gray-500 mb-1">{l}</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={(meal as any)[f] ?? 0}
                          onChange={e => updateMeal(key, { [f]: +e.target.value } as any)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-2 pr-5 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]/60"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600">{s}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Foods */}
                <div className="grid grid-cols-2 gap-4">
                  {[{ label: 'Alimentos (PT)', isEN: false }, { label: 'Foods (EN)', isEN: true }].map(({ label: lbl, isEN }) => (
                    <div key={lbl}>
                      <label className="block text-xs text-gray-500 mb-2">{lbl}</label>
                      <div className="space-y-1.5">
                        {(isEN ? meal.foods_en : meal.foods).map((food, fi) => (
                          <div key={fi} className="flex gap-1.5">
                            <input
                              value={food}
                              onChange={e => updateFood(key, fi, e.target.value, isEN)}
                              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-[#39FF14]/60"
                              placeholder={isEN ? 'e.g. 3 Eggs' : 'ex: 3 Ovos'}
                            />
                            <button onClick={() => removeFood(key, fi, isEN)} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors">
                              <Trash2 className="h-3.5 w-3.5 text-red-400/60" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addFood(key, isEN)}
                          className="flex items-center gap-1 text-xs text-gray-600 hover:text-[#39FF14] transition-colors mt-1"
                        >
                          <Plus className="h-3 w-3" /> Adicionar item
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={handleSaveAll}
        disabled={saving}
        className="w-full mt-6 py-3.5 bg-[#39FF14] hover:bg-[#2FD10F] text-black rounded-xl font-black transition-all disabled:opacity-40 hover:shadow-[0_0_20px_rgba(57,255,20,0.3)]"
      >
        {saving ? 'Salvando...' : 'Salvar Todas as Refeições'}
      </button>
    </div>
  )
}
