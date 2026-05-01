'use client'

import { useEffect, useState } from 'react'
import { Users, Dumbbell, Crown, Trophy, TrendingUp, Activity, RefreshCw, Zap } from 'lucide-react'

interface Stats {
  totalUsers: number
  totalWorkouts: number
  premiumUsers: number
  activeChallenges: number
  workoutsToday: number
  recentActivity: any[]
}

export default function AdminDashboardPage() {
  const [stats,   setStats]   = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      setStats(data)
    } catch {
      // ignore
    }
    setLoading(false)
  }

  useEffect(() => { fetchStats() }, [])

  const statCards = stats ? [
    { icon: Users,    label: 'Usuários Totais',    value: stats.totalUsers,      color: 'text-blue-400',    bg: 'bg-blue-400/10'    },
    { icon: Dumbbell, label: 'Treinos Registrados', value: stats.totalWorkouts,   color: 'text-[#39FF14]',   bg: 'bg-[#39FF14]/10'   },
    { icon: Crown,    label: 'Usuários Premium',   value: stats.premiumUsers,    color: 'text-yellow-400',  bg: 'bg-yellow-400/10'  },
    { icon: Trophy,   label: 'Desafios Ativos',    value: stats.activeChallenges, color: 'text-purple-400', bg: 'bg-purple-400/10'  },
    { icon: Activity, label: 'Treinos Hoje',        value: stats.workoutsToday,   color: 'text-orange-400',  bg: 'bg-orange-400/10'  },
  ] : []

  return (
    <div className="p-6 pt-16 md:pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Visão geral da plataforma AuraFit</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all text-sm"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 animate-pulse">
              <div className="w-10 h-10 bg-gray-800 rounded-xl mb-3" />
              <div className="h-8 bg-gray-800 rounded mb-2 w-16" />
              <div className="h-3 bg-gray-800 rounded w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {statCards.map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <p className={`text-3xl font-black ${color} tabular-nums`}>{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recent Activity Table */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="font-bold text-white flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#39FF14]" />
            Atividade Recente
          </h2>
          <span className="text-xs text-gray-600">(últimos 20 treinos)</span>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-800/50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : stats && stats.recentActivity.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-800">
                <tr className="text-left">
                  <th className="px-6 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Device ID</th>
                  <th className="px-6 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Grupo</th>
                  <th className="px-6 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">XP</th>
                  <th className="px-6 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Duração</th>
                  <th className="px-6 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {stats.recentActivity.map((row: any) => (
                  <tr key={row.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-3 font-mono text-xs text-gray-400">
                      {row.device_id?.slice(0, 12)}...
                    </td>
                    <td className="px-6 py-3">
                      <span className="px-2 py-0.5 bg-[#39FF14]/10 text-[#39FF14] rounded text-xs font-medium">
                        {row.muscle_group}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-yellow-400 font-bold">+{row.xp_earned}</td>
                    <td className="px-6 py-3 text-gray-400">{row.duration_minutes}min</td>
                    <td className="px-6 py-3 text-gray-500 text-xs">
                      {new Date(row.logged_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <Dumbbell className="h-12 w-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-600 text-sm">Nenhum treino registrado ainda</p>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {[
          { href: '/admin/diets',      label: '+ Nova Dieta',    color: 'text-orange-400' },
          { href: '/admin/exercises',  label: '+ Exercício',     color: 'text-blue-400'   },
          { href: '/admin/challenges', label: '+ Desafio',       color: 'text-purple-400' },
          { href: '/admin/users',      label: 'Ver Usuários',    color: 'text-[#39FF14]'  },
        ].map(({ href, label, color }) => (
          <a
            key={href}
            href={href}
            className={`block p-4 bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl text-sm font-bold ${color} transition-all hover:scale-[1.02]`}
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  )
}
