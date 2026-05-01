'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Plus, Edit2, Trash2, Eye, EyeOff, Crown, X, CheckSquare } from 'lucide-react'

const GOALS = ['bulking', 'cutting', 'definition', 'maintenance']

const goalLabels: Record<string, string> = {
  bulking: 'Ganho de Massa', cutting: 'Cutting', definition: 'Definição', maintenance: 'Manutenção'
}

interface DietPlan {
  id: string; name: string; name_en?: string; goal: string;
  is_premium: boolean; is_active: boolean; total_calories?: number;
  protein_g?: number; carbs_g?: number; fats_g?: number; description?: string;
}

const emptyForm: Omit<DietPlan, 'id'> = {
  name: '', name_en: '', goal: 'bulking', is_premium: false, is_active: true,
  total_calories: 2500, protein_g: 150, carbs_g: 300, fats_g: 70, description: '',
}

export default function AdminDietsPage() {
  const [plans,   setPlans]   = useState<DietPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(false)
  const [editing, setEditing] = useState<DietPlan | null>(null)
  const [form,    setForm]    = useState(emptyForm)
  const [saving,  setSaving]  = useState(false)

  useEffect(() => { fetchPlans() }, [])

  const fetchPlans = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('diet_plans')
      .select('*')
      .order('created_at', { ascending: false })
    setPlans(data ?? [])
    setLoading(false)
  }

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModal(true) }

  const openEdit = (plan: DietPlan) => {
    setEditing(plan)
    setForm({ name: plan.name, name_en: plan.name_en ?? '', goal: plan.goal, is_premium: plan.is_premium, is_active: plan.is_active, total_calories: plan.total_calories, protein_g: plan.protein_g, carbs_g: plan.carbs_g, fats_g: plan.fats_g, description: plan.description ?? '' })
    setModal(true)
  }

  const handleSave = async () => {
    if (!form.name) return
    setSaving(true)

    const { data: { session } } = await supabase.auth.getSession()
    const payload = { ...form, created_by: session?.user?.id }

    const { error } = editing
      ? await supabase.from('diet_plans').update(payload).eq('id', editing.id)
      : await supabase.from('diet_plans').insert(payload)

    if (error) { toast.error('Erro ao salvar: ' + error.message) }
    else {
      toast.success(editing ? 'Plano atualizado! ✅' : 'Plano criado! ✅')
      setModal(false)
      fetchPlans()
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deletar este plano? As refeições serão excluídas também.')) return
    const { error } = await supabase.from('diet_plans').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Plano excluído'); fetchPlans() }
  }

  const toggleField = async (id: string, field: 'is_active' | 'is_premium', current: boolean) => {
    await supabase.from('diet_plans').update({ [field]: !current }).eq('id', id)
    fetchPlans()
  }

  return (
    <div className="p-6 pt-16 md:pt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Planos de Dieta</h1>
          <p className="text-gray-500 text-sm mt-1">{plans.length} planos cadastrados</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#39FF14] hover:bg-[#2FD10F] text-black rounded-xl font-bold text-sm transition-all hover:shadow-[0_0_15px_rgba(57,255,20,0.3)]"
        >
          <Plus className="h-4 w-4" /> Novo Plano
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-800/50 rounded-lg animate-pulse" />)}
          </div>
        ) : plans.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-600 text-sm">Nenhum plano ainda. Crie o primeiro!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-left">
                  <th className="px-5 py-3 text-xs text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-5 py-3 text-xs text-gray-500 uppercase tracking-wider">Objetivo</th>
                  <th className="px-5 py-3 text-xs text-gray-500 uppercase tracking-wider">Calorias</th>
                  <th className="px-5 py-3 text-xs text-gray-500 uppercase tracking-wider">Premium</th>
                  <th className="px-5 py-3 text-xs text-gray-500 uppercase tracking-wider">Ativo</th>
                  <th className="px-5 py-3 text-xs text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {plans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-800/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-white">{plan.name}</p>
                      {plan.name_en && <p className="text-xs text-gray-600">{plan.name_en}</p>}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 bg-gray-800 text-gray-300 rounded text-xs">
                        {goalLabels[plan.goal] ?? plan.goal}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400">{plan.total_calories} kcal</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => toggleField(plan.id, 'is_premium', plan.is_premium)}>
                        {plan.is_premium
                          ? <Crown className="h-4 w-4 text-yellow-400" />
                          : <Crown className="h-4 w-4 text-gray-700 hover:text-yellow-400 transition-colors" />}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => toggleField(plan.id, 'is_active', plan.is_active)}>
                        {plan.is_active
                          ? <Eye className="h-4 w-4 text-[#39FF14]" />
                          : <EyeOff className="h-4 w-4 text-gray-600 hover:text-gray-400 transition-colors" />}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <a href={`/admin/diets/${plan.id}`} className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors" title="Editar refeições">
                          <CheckSquare className="h-4 w-4 text-blue-400" />
                        </a>
                        <button onClick={() => openEdit(plan)} className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors">
                          <Edit2 className="h-4 w-4 text-gray-400" />
                        </button>
                        <button onClick={() => handleDelete(plan.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4 text-red-500/70 hover:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="font-bold text-white">{editing ? 'Editar Plano' : 'Novo Plano de Dieta'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-500 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs text-gray-400 mb-1.5">Nome (PT-BR)</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#39FF14]/60" placeholder="Ex: Dieta Bulking Avançado" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-400 mb-1.5">Nome (EN)</label>
                  <input value={form.name_en} onChange={e => setForm(f => ({ ...f, name_en: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#39FF14]/60" placeholder="Advanced Bulking Diet" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Objetivo</label>
                  <select value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#39FF14]/60">
                    {GOALS.map(g => <option key={g} value={g}>{goalLabels[g]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Calorias Totais</label>
                  <input type="number" value={form.total_calories} onChange={e => setForm(f => ({ ...f, total_calories: +e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#39FF14]/60" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Proteína (g)</label>
                  <input type="number" value={form.protein_g} onChange={e => setForm(f => ({ ...f, protein_g: +e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#39FF14]/60" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Carboidratos (g)</label>
                  <input type="number" value={form.carbs_g} onChange={e => setForm(f => ({ ...f, carbs_g: +e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#39FF14]/60" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Gorduras (g)</label>
                  <input type="number" value={form.fats_g} onChange={e => setForm(f => ({ ...f, fats_g: +e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#39FF14]/60" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-400 mb-1.5">Descrição</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#39FF14]/60 resize-none" />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-xs text-gray-400">Premium</label>
                  <button type="button" onClick={() => setForm(f => ({ ...f, is_premium: !f.is_premium }))} className={`w-10 h-5 rounded-full transition-all ${form.is_premium ? 'bg-yellow-400' : 'bg-gray-700'}`}>
                    <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5 ${form.is_premium ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(false)} className="flex-1 py-2.5 bg-gray-800 text-gray-400 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors">Cancelar</button>
                <button onClick={handleSave} disabled={saving || !form.name} className="flex-1 py-2.5 bg-[#39FF14] hover:bg-[#2FD10F] text-black rounded-xl text-sm font-bold disabled:opacity-40 transition-all">
                  {saving ? 'Salvando...' : 'Salvar Plano'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
