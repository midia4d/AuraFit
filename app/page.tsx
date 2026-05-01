import Link from 'next/link'
import {
  Dumbbell, Trophy, TrendingUp, Zap, Apple,
  Moon, BarChart3, Target, ArrowRight, Star, Users, Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  const features = [
    {
      icon: Dumbbell,
      title: 'Treinos Personalizados',
      desc: 'Exercícios organizados por grupo muscular com histórico completo e XP por sessão.',
      color: '#39FF14',
      bg: 'rgba(57,255,20,0.08)',
      border: 'rgba(57,255,20,0.2)',
    },
    {
      icon: Apple,
      title: 'Planos Alimentares',
      desc: 'Dietas otimizadas para ganho de massa, perda de peso ou definição muscular.',
      color: '#34d399',
      bg: 'rgba(52,211,153,0.08)',
      border: 'rgba(52,211,153,0.2)',
    },
    {
      icon: Trophy,
      title: 'Gamificação Total',
      desc: 'Ganhe XP, suba de nível, conquiste badges e complete missões diárias.',
      color: '#fbbf24',
      bg: 'rgba(251,191,36,0.08)',
      border: 'rgba(251,191,36,0.2)',
    },
    {
      icon: TrendingUp,
      title: 'Progresso em Gráficos',
      desc: 'Visualize sua evolução com gráficos semanais, streaks e estatísticas detalhadas.',
      color: '#60a5fa',
      bg: 'rgba(96,165,250,0.08)',
      border: 'rgba(96,165,250,0.2)',
    },
    {
      icon: Moon,
      title: 'Controle de Sono',
      desc: 'Monitore suas horas de sono e qualidade para melhor recuperação muscular.',
      color: '#818cf8',
      bg: 'rgba(129,140,248,0.08)',
      border: 'rgba(129,140,248,0.2)',
    },
    {
      icon: BarChart3,
      title: 'Check-in de Humor',
      desc: 'Registre sua disposição diária e veja a correlação com sua performance.',
      color: '#f472b6',
      bg: 'rgba(244,114,182,0.08)',
      border: 'rgba(244,114,182,0.2)',
    },
    {
      icon: Target,
      title: 'Metas e Streaks',
      desc: 'Defina metas semanais e mantenha sequências de dias de treino.',
      color: '#fb923c',
      bg: 'rgba(251,146,60,0.08)',
      border: 'rgba(251,146,60,0.2)',
    },
    {
      icon: Zap,
      title: 'Biblioteca de Exercícios',
      desc: '45+ exercícios com fotos, descrições e instruções técnicas detalhadas.',
      color: '#a78bfa',
      bg: 'rgba(167,139,250,0.08)',
      border: 'rgba(167,139,250,0.2)',
    },
  ]

  const stats = [
    { value: '45+', label: 'Exercícios', icon: Dumbbell },
    { value: '12', label: 'Planos de dieta', icon: Apple },
    { value: '∞', label: 'Possibilidades', icon: Activity },
    { value: '100%', label: 'Gratuito', icon: Star },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#050505' }}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">

        {/* Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb orb-green absolute w-[600px] h-[600px] -top-32 -left-32 opacity-50" />
          <div className="orb orb-blue absolute w-[500px] h-[500px] -bottom-20 -right-20 opacity-40" />
          <div className="orb orb-purple absolute w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 text-center max-w-5xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border text-sm font-semibold animate-slide-down"
            style={{
              background: 'rgba(57,255,20,0.08)',
              borderColor: 'rgba(57,255,20,0.25)',
              color: '#39FF14',
            }}>
            <span className="status-dot status-dot-green" />
            App de Fitness Premium — 100% Gratuito
          </div>

          {/* Headline */}
          <h1 className="text-7xl md:text-9xl font-black mb-6 tracking-tight animate-slide-in-up">
            <span style={{
              background: 'linear-gradient(135deg, #ffffff 30%, rgba(255,255,255,0.5) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              AURA
            </span>
            <span className="neon-glow" style={{ color: '#39FF14' }}>FIT</span>
          </h1>

          <p className="text-2xl md:text-3xl text-white/60 mb-4 font-light animate-fade-in">
            Transforme seu corpo.{' '}
            <span className="text-white font-semibold">Supere seus limites.</span>
          </p>
          <p className="text-lg text-white/35 mb-12 max-w-2xl mx-auto animate-fade-in">
            O app fitness completo com treinos, dietas, gamificação e
            evolução em tempo real — tudo no seu bolso.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-in-up">
            <Link href="/onboarding">
              <button
                className="group flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-black text-lg transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #39FF14, #22c55e)',
                  boxShadow: '0 0 30px rgba(57,255,20,0.35), 0 4px 16px rgba(0,0,0,0.3)',
                }}
              >
                <Zap className="h-5 w-5" />
                COMEÇAR AGORA
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Link>
            <Link href="/dashboard">
              <button
                className="px-10 py-4 rounded-2xl font-semibold text-lg border transition-all duration-300 hover:scale-105 hover:bg-white/[0.05]"
                style={{
                  borderColor: 'rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                Ver Dashboard
              </button>
            </Link>
          </div>

          {/* Scroll hint */}
          <div className="mt-20 flex flex-col items-center gap-2 text-white/20 animate-breathe">
            <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            <p className="text-xs tracking-[0.3em] uppercase">Explore</p>
          </div>
        </div>
      </section>

      {/* ── Stats Row ─────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 border-y border-white/[0.04]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center">
              <Icon className="h-6 w-6 mx-auto mb-3 text-white/25" />
              <p className="text-4xl font-black text-white mb-1">{value}</p>
              <p className="text-sm text-white/40">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────────────────────────── */}
      <section className="py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-sm font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: '#39FF14' }}>
              Funcionalidades
            </p>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-5 tracking-tight">
              Tudo que você precisa
            </h2>
            <p className="text-xl text-white/40 max-w-2xl mx-auto">
              Para alcançar sua{' '}
              <span style={{ color: '#39FF14', fontWeight: 700 }}>melhor versão</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border card-lift cursor-default"
                style={{
                  background: feature.bg,
                  borderColor: feature.border,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${feature.color}15` }}
                >
                  <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="py-28 px-4 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: '#60a5fa' }}>
            Como funciona
          </p>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-20 tracking-tight">
            3 passos simples
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Configure seu perfil',
                desc: 'Informe seu objetivo, nível e dados físicos em menos de 2 minutos.',
                color: '#39FF14',
              },
              {
                step: '02',
                title: 'Treine e registre',
                desc: 'Escolha exercícios, registre séries e ganhe XP a cada treino concluído.',
                color: '#60a5fa',
              },
              {
                step: '03',
                title: 'Evolua e conquiste',
                desc: 'Acompanhe seu progresso, suba de nível e desbloqueie conquistas.',
                color: '#fbbf24',
              },
            ].map(({ step, title, desc, color }) => (
              <div key={step} className="relative">
                <div
                  className="text-7xl font-black mb-4 opacity-15"
                  style={{ color }}
                >
                  {step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-white/40 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ─────────────────────────────────────────────────────── */}
      <section className="py-32 px-4">
        <div
          className="max-w-4xl mx-auto rounded-3xl p-16 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(57,255,20,0.08) 0%, rgba(34,197,94,0.04) 50%, rgba(57,255,20,0.06) 100%)',
            border: '1px solid rgba(57,255,20,0.15)',
          }}
        >
          {/* Glow center */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[400px] h-[200px] orb-green opacity-20 blur-3xl" />
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight relative z-10">
            PRONTO PARA{' '}
            <span className="neon-glow" style={{ color: '#39FF14' }}>EVOLUIR?</span>
          </h2>
          <p className="text-xl text-white/50 mb-12 relative z-10">
            Comece sua jornada hoje. Sem cadastro. Sem cartão. Sem limites.
          </p>
          <Link href="/onboarding" className="relative z-10">
            <button
              className="group inline-flex items-center gap-3 px-12 py-5 rounded-2xl font-black text-black text-xl transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #39FF14, #22c55e)',
                boxShadow: '0 0 40px rgba(57,255,20,0.4), 0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              ACESSAR APP
              <ArrowRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="py-10 px-4 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <span className="font-black text-white">AURA</span>
            <span className="font-black neon-glow-sm" style={{ color: '#39FF14' }}>FIT</span>
          </div>
          <p className="text-white/20 text-sm">
            © 2026 AuraFit — Transformando corpos, construindo auras.
          </p>
          <div className="flex items-center gap-1 text-white/20 text-sm">
            <Users className="h-4 w-4" />
            <span>Feito para atletas de verdade</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
