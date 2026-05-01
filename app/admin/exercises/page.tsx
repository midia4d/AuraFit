'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Plus, Edit2, Trash2, Eye, EyeOff, Search } from 'lucide-react'

// Array with localized group names
const MUSCLE_GROUPS = [
  { id: 'chest',     label: 'Peito' },
  { id: 'back',      label: 'Costas' },
  { id: 'legs',      label: 'Pernas' },
  { id: 'shoulders', label: 'Ombros' },
  { id: 'arms',      label: 'Braços' },
  { id: 'abs',       label: 'Abdômen' },
  { id: 'cardio',    label: 'Cardio' }
]

const emptyForm = {
  id: '', name: '', name_en: '', muscle_group: 'chest', 
  muscles_worked: '', muscles_worked_en: '', difficulty: 'intermediate',
  description: '', description_en: '', image_url: '', is_active: true
}

export default function AdminExercisesPage() {
  const [exercises, setExercises] = useState<any[]>([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [group,     setGroup]     = useState('all')

  const [modal,     setModal]     = useState(false)
  const [editing,   setEditing]   = useState<boolean>(false)
  const [form,      setForm]      = useState(emptyForm)
  const [saving,    setSaving]    = useState(false)

  useEffect(() => { fetchExercises() }, [])

  const fetchExercises = async () => {
    setLoading(true)
    const { data } = await supabase.from('exercises').select('*').order('name')
    setExercises(data ?? [])
    setLoading(false)
  }

  const openCreate = () => { setEditing(false); setForm(emptyForm); setModal(true) }
  const openEdit   = (ex: any) => { setEditing(true); setForm(ex); setModal(true) }

  const handleSave = async () => {
    if (!form.id || !form.name) {
      toast.error('O ID e Nome são obrigatórios')
      return
    }

    setSaving(true)
    const actionId = form.id.toLowerCase().replace(/\s+/g, '-')
    const payload = { ...form, id: actionId }

    if (editing) {
      const { error } = await supabase.from('exercises').update(payload).eq('id', form.id)
      if (error) toast.error(error.message)
      else { toast.success('Exercício atualizado! ✅'); setModal(false); fetchExercises() }
    } else {
      const { error } = await supabase.from('exercises').insert(payload)
      if (error) {
        if (error.code === '23505') toast.error('Ops! Esse ID de exercício já existe.')
        else toast.error(error.message)
      } else {
        toast.success('Exercício criado! ✅'); setModal(false); fetchExercises()
      }
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente deletar este exercício?')) return
    const { error } = await supabase.from('exercises').delete().eq('id', id)
    if (error) toast.error('Erro ao deletar: O exercício pode estar em algum plano de treino cadastrado.')
    else { toast.success('Excluído com sucesso'); fetchExercises() }
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('exercises').update({ is_active: !current }).eq('id', id)
    fetchExercises()
  }

  const filtered = exercises.filter(ex => {
    if (group !== 'all' && ex.muscle_group !== group) return false
    const str = `${ex.name} ${ex.name_en} ${ex.id}`.toLowerCase()
    return str.includes(search.toLowerCase())
  })

  return (
    <div className="p-6 pt-16 md:pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Exercícios</h1>
          <p className="text-gray-500 text-sm mt-1">Biblioteca de {exercises.length} movimentos</p>
        </div>
        
        <div className="flex gap-3">
          <select value={group} onChange={(e) => setGroup(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-300 outline-none">
            <option value="all">Todos os Grupos</option>
            {MUSCLE_GROUPS.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
          </select>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#39FF14] hover:bg-[#2FD10F] text-black rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(57,255,20,0.2)]">
            <Plus className="h-4 w-4" /> Novo Exercício
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
        <input 
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou ID..."
          className="w-full bg-gray-900/80 border border-gray-800 focus:border-[#39FF14]/50 rounded-2xl pl-11 pr-4 py-3 text-sm text-white transition-all outline-none"
        />
      </div>

      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-16 bg-gray-800/50 rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-500">Nenhum exercício encontrado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-800/30">
                <tr className="border-b border-gray-800 text-left">
                  <th className="px-5 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Mídia</th>
                  <th className="px-5 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Exercício</th>
                  <th className="px-5 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Grupo</th>
                  <th className="px-5 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Dificuldade</th>
                  <th className="px-5 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filtered.map(ex => (
                  <tr key={ex.id} className="hover:bg-gray-800/20 transition-colors">
                    <td className="px-5 py-3">
                      {ex.image_url ? (
                        <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden border border-gray-700">
                          <img src={ex.image_url} alt={ex.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-[10px] text-gray-600">Sem image</div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-bold text-white">{ex.name}</p>
                      <p className="text-xs text-gray-500">{ex.name_en}</p>
                      <p className="text-[10px] text-gray-600 font-mono mt-0.5">ID: {ex.id}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2.5 py-1 rounded bg-[#39FF14]/10 text-[#39FF14] text-xs font-medium uppercase tracking-wider">
                        {ex.muscle_group}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 capitalize">{ex.difficulty}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => toggleActive(ex.id, ex.is_active)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                          {ex.is_active ? <Eye className="h-4 w-4 text-[#39FF14]" /> : <EyeOff className="h-4 w-4 text-gray-600" />}
                        </button>
                        <button onClick={() => openEdit(ex)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                          <Edit2 className="h-4 w-4 text-gray-400 hover:text-white" />
                        </button>
                        <button onClick={() => handleDelete(ex.id)} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group">
                          <Trash2 className="h-4 w-4 text-gray-600 group-hover:text-red-400" />
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

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl my-8">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">
                {editing ? 'Editar Exercício' : 'Novo Exercício'}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">ID Único (key)</label>
                  <input disabled={editing} value={form.id} onChange={e => setForm(f => ({...f, id: e.target.value}))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:border-[#39FF14]/50 outline-none disabled:opacity-50" placeholder="ex: supino-reto" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Mídia (URL Imagem/GIF)</label>
                  <input value={form.image_url} onChange={e => setForm(f => ({...f, image_url: e.target.value}))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:border-[#39FF14]/50 outline-none" placeholder="https://" />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Nome (PT-BR)</label>
                  <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:border-[#39FF14]/50 outline-none" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Nome (EN-US)</label>
                  <input value={form.name_en} onChange={e => setForm(f => ({...f, name_en: e.target.value}))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:border-[#39FF14]/50 outline-none" />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Grupo Muscular Principal</label>
                  <select value={form.muscle_group} onChange={e => setForm(f => ({...f, muscle_group: e.target.value}))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:border-[#39FF14]/50 outline-none">
                    {MUSCLE_GROUPS.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                  </select>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Dificuldade</label>
                  <select value={form.difficulty} onChange={e => setForm(f => ({...f, difficulty: e.target.value}))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:border-[#39FF14]/50 outline-none">
                    <option value="beginner">Iniciante</option>
                    <option value="intermediate">Intermediário</option>
                    <option value="advanced">Avançado</option>
                  </select>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Músculos Ativados (PT)</label>
                  <input value={form.muscles_worked} onChange={e => setForm(f => ({...f, muscles_worked: e.target.value}))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:border-[#39FF14]/50 outline-none" placeholder="Ex: Peitoral maior, tríceps" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Músculos Ativados (EN)</label>
                  <input value={form.muscles_worked_en} onChange={e => setForm(f => ({...f, muscles_worked_en: e.target.value}))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:border-[#39FF14]/50 outline-none" />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Descrição (PT)</label>
                  <textarea rows={2} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:border-[#39FF14]/50 outline-none resize-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Descrição (EN)</label>
                  <textarea rows={2} value={form.description_en} onChange={e => setForm(f => ({...f, description_en: e.target.value}))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:border-[#39FF14]/50 outline-none resize-none" />
                </div>

                <div className="col-span-2 mt-4 flex gap-3">
                  <button onClick={() => setModal(false)} className="flex-1 py-3 text-gray-400 bg-gray-800 rounded-xl text-sm font-medium hover:bg-gray-700 transition">Cancelar</button>
                  <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-[#39FF14] text-black rounded-xl text-sm font-black hover:bg-[#2FD10F] transition disabled:opacity-50">
                    {saving ? 'Salvando...' : 'Salvar Exercício'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
