'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'pt-BR' | 'en-US'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('pt-BR')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage?.getItem('aurafi_language')
    if (saved === 'pt-BR' || saved === 'en-US') {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage?.setItem('aurafi_language', lang)
    }
  }

  const t = (key: string) => {
    if (!mounted) return key
    const keys = key.split('.')
    let value: any = translations[language]
    for (const k of keys) {
      value = value?.[k]
    }
    return value ?? key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Translations object
const translations: Record<Language, any> = {
  'pt-BR': {
    common: {
      back: 'Voltar',
      next: 'Próximo',
      save: 'Salvar',
      cancel: 'Cancelar',
      delete: 'Excluir',
      edit: 'Editar',
      complete: 'Concluir',
      start: 'Começar',
      continue: 'Continuar'
    },
    nav: {
      dashboard: 'Painel',
      workouts: 'Treinos',
      diet: 'Dieta',
      library: 'Biblioteca',
      sleep: 'Sono',
      mood: 'Humor',
      profile: 'Perfil'
    },
    onboarding: {
      title: 'Vamos começar sua jornada',
      subtitle: 'Precisamos de algumas informações básicas',
      goal: {
        title: 'Qual é seu objetivo?',
        bulking: 'Ganho de Massa',
        cutting: 'Perda de Peso',
        definition: 'Definição Muscular',
        maintenance: 'Manutenção'
      },
      level: {
        title: 'Qual seu nível de experiência?',
        beginner: 'Iniciante',
        intermediate: 'Intermediário',
        advanced: 'Avançado',
        gymrat: 'Rato de Academia'
      },
      stats: {
        title: 'Suas medidas',
        weight: 'Peso (kg)',
        height: 'Altura (cm)'
      },
      language: {
        title: 'Escolha seu idioma',
        ptBR: 'Português Brasileiro',
        enUS: 'English (US)'
      }
    },
    dashboard: {
      title: 'Seu Painel',
      streak: 'Sequência',
      days: 'dias',
      weekProgress: 'Progresso da Semana',
      workoutsCompleted: 'treinos concluídos',
      calories: 'Calorias Hoje',
      lastWorkout: 'Último Treino',
      level: 'Nível',
      xp: 'XP',
      nextLevel: 'Próximo nível em'
    },
    workouts: {
      title: 'Treinos',
      history: 'Histórico',
      newWorkout: 'Novo Treino',
      muscleGroups: {
        chest: 'Peito',
        back: 'Costas',
        legs: 'Pernas',
        shoulders: 'Ombros',
        arms: 'Braços',
        abs: 'Abdômen',
        cardio: 'Cardio'
      },
      sets: 'séries',
      reps: 'reps',
      weight: 'Peso (kg)',
      completed: 'Concluído',
      markComplete: 'Marcar como concluído'
    },
    diet: {
      title: 'Plano Alimentar',
      currentPlan: 'Plano Atual',
      calories: 'calorias/dia',
      protein: 'Proteína',
      carbs: 'Carboidratos',
      fats: 'Gorduras',
      meals: {
        breakfast: 'Café da Manhã',
        snack1: 'Lanche da Manhã',
        lunch: 'Almoço',
        snack2: 'Lanche da Tarde',
        dinner: 'Jantar',
        snack3: 'Ceia'
      },
      premium: 'Premium',
      locked: 'Desbloqueie com Premium'
    },
    sleep: {
      title: 'Controle de Sono',
      logSleep: 'Registrar Sono',
      hours: 'Horas dormidas',
      quality: 'Qualidade',
      qualityLevels: {
        poor: 'Ruim',
        average: 'Média',
        good: 'Boa',
        excellent: 'Excelente'
      },
      averageHours: 'Média de horas',
      last7days: 'Últimos 7 dias'
    },
    mood: {
      title: 'Check-in de Humor',
      howFeeling: 'Como você está se sentindo hoje?',
      energy: 'Nível de energia',
      motivation: 'Motivação',
      low: 'Baixo',
      medium: 'Médio',
      high: 'Alto',
      save: 'Salvar Check-in'
    },
    library: {
      title: 'Biblioteca de Exercícios',
      search: 'Buscar exercícios...',
      difficulty: 'Dificuldade',
      difficultyLevels: {
        beginner: 'Iniciante',
        intermediate: 'Intermediário',
        advanced: 'Avançado'
      },
      musclesWorked: 'Músculos trabalhados',
      howTo: 'Como executar'
    }
  },
  'en-US': {
    common: {
      back: 'Back',
      next: 'Next',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      complete: 'Complete',
      start: 'Start',
      continue: 'Continue'
    },
    nav: {
      dashboard: 'Dashboard',
      workouts: 'Workouts',
      diet: 'Diet',
      library: 'Library',
      sleep: 'Sleep',
      mood: 'Mood',
      profile: 'Profile'
    },
    onboarding: {
      title: "Let's start your journey",
      subtitle: 'We need some basic information',
      goal: {
        title: 'What is your goal?',
        bulking: 'Muscle Gain',
        cutting: 'Weight Loss',
        definition: 'Muscle Definition',
        maintenance: 'Maintenance'
      },
      level: {
        title: 'What is your experience level?',
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
        gymrat: 'Gym Rat'
      },
      stats: {
        title: 'Your stats',
        weight: 'Weight (kg)',
        height: 'Height (cm)'
      },
      language: {
        title: 'Choose your language',
        ptBR: 'Português Brasileiro',
        enUS: 'English (US)'
      }
    },
    dashboard: {
      title: 'Your Dashboard',
      streak: 'Streak',
      days: 'days',
      weekProgress: 'Week Progress',
      workoutsCompleted: 'workouts completed',
      calories: 'Calories Today',
      lastWorkout: 'Last Workout',
      level: 'Level',
      xp: 'XP',
      nextLevel: 'Next level in'
    },
    workouts: {
      title: 'Workouts',
      history: 'History',
      newWorkout: 'New Workout',
      muscleGroups: {
        chest: 'Chest',
        back: 'Back',
        legs: 'Legs',
        shoulders: 'Shoulders',
        arms: 'Arms',
        abs: 'Abs',
        cardio: 'Cardio'
      },
      sets: 'sets',
      reps: 'reps',
      weight: 'Weight (kg)',
      completed: 'Completed',
      markComplete: 'Mark as complete'
    },
    diet: {
      title: 'Meal Plan',
      currentPlan: 'Current Plan',
      calories: 'calories/day',
      protein: 'Protein',
      carbs: 'Carbs',
      fats: 'Fats',
      meals: {
        breakfast: 'Breakfast',
        snack1: 'Morning Snack',
        lunch: 'Lunch',
        snack2: 'Afternoon Snack',
        dinner: 'Dinner',
        snack3: 'Evening Snack'
      },
      premium: 'Premium',
      locked: 'Unlock with Premium'
    },
    sleep: {
      title: 'Sleep Tracking',
      logSleep: 'Log Sleep',
      hours: 'Hours slept',
      quality: 'Quality',
      qualityLevels: {
        poor: 'Poor',
        average: 'Average',
        good: 'Good',
        excellent: 'Excellent'
      },
      averageHours: 'Average hours',
      last7days: 'Last 7 days'
    },
    mood: {
      title: 'Mood Check-in',
      howFeeling: 'How are you feeling today?',
      energy: 'Energy level',
      motivation: 'Motivation',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      save: 'Save Check-in'
    },
    library: {
      title: 'Exercise Library',
      search: 'Search exercises...',
      difficulty: 'Difficulty',
      difficultyLevels: {
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced'
      },
      musclesWorked: 'Muscles worked',
      howTo: 'How to perform'
    }
  }
}
