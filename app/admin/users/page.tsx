'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Search, Crown, Check, X, Calendar, Activity, Info } from 'lucide-react'

export default function AdminUsersPage() {
  const [users,    setUsers]    = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [granting, setGranting] = useState<string | null>(null)

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    setLoading(true)
    
    // Fetch users + their latest subscription
    const { data: profiles } = await supabase
      .from('user_profiles')
      .select(`
        *,
        user_subscriptions (plan, expires_at)
      `)
      .order('created_at', { ascending: false })

    setUsers(profiles ?? [])
    setLoading(false)
  }

  const handleGrantPremium = async (deviceId: string, isPremiumNow: boolean) => {
    if (!confirm(isPremiumNow ? 'Remover premium deste usuário?' : 'Conceder acesso Premium (1 ano) para este usuário?')) return
    setGranting(deviceId)
    
    try {
      if (isPremiumNow) {
        // Remove premium
        await supabase.from('user_subscriptions').delete().eq('device_id', deviceId)
        toast.success('Acesso premium removido.')
      } else {
        // Grant 1 year premium
        const expiresAt = new Date()
        expiresAt.setFullYear(expiresAt.getFullYear() + 1)
        
        const { data: { session } } = await supabase.auth.getSession()

        await supabase.from('user_subscriptions').upsert({
          device_id: deviceId,
          plan: 'premium',
          expires_at: expiresAt.toISOString(),
          granted_by: session?.user?.id
        }, { onConflict: 'device_id' })
        
        toast.success('Acesso premium de 1 ano adicionado! 👑')
      }
      fetchUsers()
    } catch {
      toast.error('Ocorreu um erro.')
    }
    setGranting(null)
  }

  const filtered = users.filter(u => 
    (u.device_id?.toLowerCase() || '').includes(search.toLowerCase()) || 
    (u.name?.toLowerCase() || '').includes(search.toLowerCase())
  )

  const isPremium = (user: any) => {
    if (!user.user_subscriptions || user.user_subscriptions.length === 0) return false
    const sub = user.user_subscriptions[0]
    return sub.plan === 'premium' && new Date(sub.expires_at) > new Date()
  }

  const daysSince = (dateStr: string) => {
    if (!dateStr) return 'Nunca'
    const days = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 3600 * 24))
    if (days === 0) return 'Hoje'
    if (days === 1) return 'Ontem'
    return `Há ${days} dias`
  }

  return (
    <div className="p-6 pt-16 md:pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Usuários</h1>
          <p className="text-gray-500 text-sm mt-1">Busque pelo Device ID para conceder premium</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
          <input 
            type="text" 
            placeholder="Buscar por Device ID ou Nome..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 focus:border-[#39FF14]/50 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white transition-all outline-none"
          />
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-200">
          <p className="font-bold mb-1">Como o Premium funciona no MVP:</p>
          <ul className="list-disc pl-4 space-y-1 opacity-80">
            <li>O usuário copia o <b>Device ID</b> dele na aba Perfil do app.</li>
            <li>Ele envia o ID pra você via WhatsApp junto com o comprovante de PIX.</li>
            <li>Você busca o ID aqui e clica no botão "Liberar Premium". Instantâneo!</li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-800/50 rounded-lg animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-500">Nenhum usuário encontrado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-left bg-gray-800/20">
                  <th className="px-5 py-4 text-xs font-medium text-gray-500 uppercase">Device ID</th>
                  <th className="px-5 py-4 text-xs font-medium text-gray-500 uppercase">Perfil</th>
                  <th className="px-5 py-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-5 py-4 text-xs font-medium text-gray-500 uppercase">Atividade</th>
                  <th className="px-5 py-4 text-xs font-medium text-gray-500 text-right uppercase">Conceder Acesso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filtered.map(user => {
                  const hasPremium = isPremium(user)
                  return (
                    <tr key={user.id} className="hover:bg-gray-800/20 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-mono text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded inline-block">
                          {user.device_id.split('-')[0]}-...
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-white">{user.name || 'Alun@ Sem Nome'}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Lvl {Math.floor((user.xp || 0)/100)+1} • Objs: {user.goal}</p>
                      </td>
                      <td className="px-5 py-4">
                        {hasPremium ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-yellow-400/10 text-yellow-500 text-xs font-bold ring-1 ring-yellow-400/30">
                            <Crown className="h-3.5 w-3.5" /> Premium
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-800 text-gray-400 text-xs font-medium">
                            Plano Free
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1 text-xs">
                          <span className="flex items-center gap-1.5 text-gray-400">
                            <Activity className="h-3.5 w-3.5 text-[#39FF14]" /> Treinou: {daysSince(user.last_workout_date)}
                          </span>
                          <span className="flex items-center gap-1.5 text-gray-500">
                            <Calendar className="h-3.5 w-3.5" /> Criou: {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          disabled={granting === user.device_id}
                          onClick={() => handleGrantPremium(user.device_id, hasPremium)}
                          className={`inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${
                            hasPremium 
                              ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20' 
                              : 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-[0_0_10px_rgba(250,204,21,0.3)]'
                          }`}
                        >
                          {granting === user.device_id ? 'Processando..' : hasPremium ? <><X className="h-3.5 w-3.5"/> Revogar</> : <><Crown className="h-3.5 w-3.5"/> Liberar Premium</>}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
