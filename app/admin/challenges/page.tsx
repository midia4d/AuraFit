'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Trophy, Plus, Calendar as CalendarIcon, Eye, EyeOff, Edit2, Trash2 } from 'lucide-react'

const emptyForm = {
  title: '', title_en: '', description: '', description_en: '',
  type: 'weekly', category: 'workout', goal_value: 5, goal_unit: 'workouts',
  xp_reward: 100, is_premium: false, is_active: true, banner_color: '#39FF14',
  starts_at: '', ends_at: ''
}

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<any[]>([])
  const [loading,    setLoading]    = useState(true)

  const [modal,      setModal]      = useState(false)
  const [editing,    setEditing]    = useState<any>(null)
  const [form,       setForm]       = useState<any>(emptyForm)
  const [saving,     setSaving]     = useState(false)

  useEffect(() => { fetchChallenges() }, [])

  const fetchChallenges = async () => {
    setLoading(true)
    const { data } = await supabase.from('challenges').select(`
      *,
      challenge_participants (count)
    `).order('created_at', { ascending: false })
    
    setChallenges(data ?? [])
    setLoading(false)
  }

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModal(true) }

  const openEdit = (c: any) => {
    setEditing(c)
    setForm({
      title: c.title, title_en: c.title_en || '', description: c.description || '', description_en: c.description_en || '',
      type: c.type, category: c.category, goal_value: c.goal_value, goal_unit: c.goal_unit,
      xp_reward: c.xp_reward, is_premium: c.is_premium, is_active: c.is_active, banner_color: c.banner_color,
      starts_at: c.starts_at ? new Date(c.starts_at).toISOString().slice(0, 16) : '',
      ends_at: c.ends_at ? new Date(c.ends_at).toISOString().slice(0, 16) : ''
    })
    setModal(true)
  }

  const handleSave = async () => {
    if (!form.title) { toast.error('Título é obrigatório'); return }
    setSaving(true)

    const payload = {
      ...form,
      starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
      ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null
    }

    if (editing) {
      const { error } = await supabase.from('challenges').update(payload).eq('id', editing.id)
      if (error) toast.error(error.message)
      else { toast.success('Desafio atualizado!'); setModal(false); fetchChallenges() }
    } else {
      const { data: { session } } = await supabase.auth.getSession()
      const { error } = await supabase.from('challenges').insert({ ...payload, created_by: session?.user?.id })
      if (error) toast.error(error.message)
      else { toast.success('Desafio criado!'); setModal(false); fetchChallenges() }
    }
    setSaving(false)
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('challenges').update({ is_active: !current }).eq('id', id)
    fetchChallenges()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este desafio? Os dados dos participantes também serão apagados.')) return
    await supabase.from('challenges').delete().eq('id', id)
    toast.success('Excluído!')
    fetchChallenges()
  }

  const formatDateTime = (iso: string) => {
    if (!iso) return '-'
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="p-6 pt-16 md:pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Desafios</h1>
          <p className="text-gray-500 text-sm mt-1">Crie metas para engajar seus alunos</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#39FF14] hover:bg-[#2FD10F] text-black rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(57,255,20,0.2)]">
          <Plus className="h-4 w-4" /> Novo Desafio
        </button>
      </div>

      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-800/50 rounded-xl animate-pulse" />)}
          </div>
        ) : challenges.length === 0 ? (
          <div className="py-20 text-center text-gray-500">Nenhum desafio criado ainda.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-800/30">
                <tr className="border-b border-gray-800 text-left">
                  <th className="px-5 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Desafio</th>
                  <th className="px-5 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Alvo</th>
                  <th className="px-5 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Prazo</th>
                  <th className="px-5 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Participantes</th>
                  <th className="px-5 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {challenges.map(c => {
                  const isActiveNow = c.is_active && (!c.ends_at || new Date(c.ends_at) > new Date())
                  return (
                    <tr key={c.id} className="hover:bg-gray-800/20 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center opacity-80" style={{ backgroundColor: `${c.banner_color}30`, border: `1px solid ${c.banner_color}80` }}>
                            <Trophy className="h-5 w-5" style={{ color: c.banner_color }} />
                          </div>
                          <div>
                            <p className="font-bold text-white flex items-center gap-2">
                              {c.title}
                              {!isActiveNow && <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">INATIVO</span>}
                            </p>
                            <p className="text-xs text-gray-500">{c.type === 'weekly' ? 'Semanal' : 'Mensal'} • {c.xp_reward} XP</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-300 font-medium">
                        {c.goal_value} <span className="text-gray-500 text-xs">{c.goal_unit}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col text-xs gap-1 text-gray-500">
                          <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" /> {formatDateTime(c.starts_at)}</span>
                          <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" /> {formatDateTime(c.ends_at)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-bold text-white text-base">
                        {c.challenge_participants?.[0]?.count || 0}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => toggleActive(c.id, c.is_active)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                            {c.is_active ? <Eye className="h-4 w-4 text-[#39FF14]" /> : <EyeOff className="h-4 w-4 text-gray-600" />}
                          </button>
                          <button onClick={() => openEdit(c)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                            <Edit2 className="h-4 w-4 text-gray-400 hover:text-white" />
                          </button>
                          <button onClick={() => handleDelete(c.id)} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group">
                            <Trash2 className="h-4 w-4 text-gray-600 group-hover:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg my-8">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">
                {editing ? 'Editar Desafio' : 'Novo Desafio'}
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Título</label>
                  <input value={form.title} onChange={e => setForm((f: any) => ({...f, title: e.target.value}))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-[#39FF14]/50 outline-none" placeholder="Ex: Guerreiro de Fim de Semana" />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Descrição Curta</label>
                  <textarea rows={2} value={form.description} onChange={e => setForm((f: any) => ({...f, description: e.target.value}))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-[#39FF14]/50 outline-none resize-none" placeholder="Ex: Treine sexta e sábado..." />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Tipo</label>
                  <select value={form.type} onChange={e => setForm((f: any) => ({...f, type: e.target.value}))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm">
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">XP Recompensa</label>
                  <input type="number" value={form.xp_reward} onChange={e => setForm((f: any) => ({...f, xp_reward: +e.target.value}))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Alvo (Número)</label>
                  <input type="number" value={form.goal_value} onChange={e => setForm((f: any) => ({...f, goal_value: +e.target.value}))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Unidade (Treinos, Dias, Lbs)</label>
                  <input value={form.goal_unit} onChange={e => setForm((f: any) => ({...f, goal_unit: e.target.value}))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Início</label>
                  <input type="datetime-local" value={form.starts_at} onChange={e => setForm((f: any) => ({...f, starts_at: e.target.value}))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm" style={{ colorScheme: 'dark' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Fim</label>
                  <input type="datetime-local" value={form.ends_at} onChange={e => setForm((f: any) => ({...f, ends_at: e.target.value}))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm" style={{ colorScheme: 'dark' }} />
                </div>

                <div className="col-span-2 flex items-center gap-4 py-2">
                  <div className="flex-1 flex items-center gap-3 bg-gray-800/50 p-3 rounded-xl">
                    <label className="text-xs text-gray-400">Exclusivo Premium</label>
                    <button onClick={() => setForm((f: any) => ({ ...f, is_premium: !f.is_premium }))} className={`w-10 h-5 rounded-full transition-all ${form.is_premium ? 'bg-yellow-400' : 'bg-gray-700'}`}>
                      <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5 ${form.is_premium ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Cor do Banner</label>
                    <div className="flex gap-2">
                      {['#39FF14', '#3b82f6', '#ef4444', '#eab308', '#a855f7'].map(color => (
                        <button 
                          key={color} onClick={() => setForm((f: any) => ({...f, banner_color: color}))} 
                          className={`w-8 h-8 rounded-full border-2 ${form.banner_color === color ? 'border-white' : 'border-transparent'}`} 
                          style={{ backgroundColor: color }} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-span-2 mt-4 flex gap-3">
                  <button onClick={() => setModal(false)} className="flex-1 py-3.5 text-gray-400 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-medium transition">Cancelar</button>
                  <button onClick={handleSave} disabled={saving} className="flex-1 py-3.5 bg-[#39FF14] hover:bg-[#2FD10F] text-black rounded-xl text-sm font-black transition disabled:opacity-50">
                    {saving ? 'Salvando...' : 'Salvar Desafio'}
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
