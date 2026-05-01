'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Dumbbell, Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)

    try {
      // 1. Sign in with Supabase Auth
      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authErr || !authData.session) {
        toast.error('Email ou senha incorretos')
        setLoading(false)
        return
      }

      // 2. Verify user is an admin
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('id, name')
        .eq('id', authData.session.user.id)
        .single()

      if (!adminUser) {
        await supabase.auth.signOut()
        toast.error('Acesso negado. Você não é um administrador.')
        setLoading(false)
        return
      }

      toast.success(`Bem-vindo, ${adminUser.name ?? 'Admin'}! ✅`)
      router.push('/admin/dashboard')
    } catch {
      toast.error('Erro inesperado. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#39FF14]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#39FF14]/10 border border-[#39FF14]/30 mb-4">
            <Shield className="h-8 w-8 text-[#39FF14]" />
          </div>
          <h1 className="text-3xl font-black text-white">
            AURA<span className="text-[#39FF14]">FIT</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Painel Administrativo</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-6">Entrar como Admin</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aurafit.com"
                  required
                  className="w-full bg-gray-800/80 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#39FF14]/60 focus:ring-1 focus:ring-[#39FF14]/30 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-medium">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-gray-800/80 border border-gray-700 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#39FF14]/60 focus:ring-1 focus:ring-[#39FF14]/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-[#39FF14] hover:bg-[#2FD10F] disabled:opacity-40 disabled:cursor-not-allowed text-black font-black py-3.5 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] text-sm tracking-wide mt-2"
            >
              {loading ? 'Verificando...' : 'ENTRAR NO PAINEL →'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-700 mt-6">
          Acesso restrito a administradores autorizados
        </p>
      </div>
    </div>
  )
}
