// Gamification system for AuraFi

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 1000) + 1
}

export function getXpForNextLevel(currentLevel: number): number {
  return 1000
}

export function calculateWorkoutXp(exercises: number, sets: number): number {
  return exercises * 10 + sets * 5
}

export interface Badge {
  id: string
  name: string
  nameEN: string
  description: string
  descriptionEN: string
  icon: string
  requirement: number
  type: 'workout' | 'streak' | 'level'
}

export const badges: Badge[] = [
  {
    id: 'first_workout',
    name: 'Primeiro Treino',
    nameEN: 'First Workout',
    description: 'Complete seu primeiro treino',
    descriptionEN: 'Complete your first workout',
    icon: '🏋️',
    requirement: 1,
    type: 'workout'
  },
  {
    id: 'week_warrior',
    name: 'Guerreiro Semanal',
    nameEN: 'Week Warrior',
    description: 'Complete 5 treinos em uma semana',
    descriptionEN: 'Complete 5 workouts in a week',
    icon: '⚡',
    requirement: 5,
    type: 'workout'
  },
  {
    id: 'streak_7',
    name: 'Sequência de 7',
    nameEN: '7 Day Streak',
    description: 'Mantenha uma sequência de 7 dias',
    descriptionEN: 'Maintain a 7-day streak',
    icon: '🔥',
    requirement: 7,
    type: 'streak'
  },
  {
    id: 'level_5',
    name: 'Nível 5',
    nameEN: 'Level 5',
    description: 'Alcance o nível 5',
    descriptionEN: 'Reach level 5',
    icon: '🏆',
    requirement: 5,
    type: 'level'
  },
  {
    id: 'level_10',
    name: 'Nível 10',
    nameEN: 'Level 10',
    description: 'Alcance o nível 10',
    descriptionEN: 'Reach level 10',
    icon: '👑',
    requirement: 10,
    type: 'level'
  }
]

export function checkBadges(userData: any, workoutCount: number): Badge[] {
  const earned: Badge[] = []
  const currentLevel = calculateLevel(userData.xp ?? 0)

  badges.forEach((badge: any) => {
    let hasEarned = false
    
    if (badge.type === 'workout' && workoutCount >= badge.requirement) {
      hasEarned = true
    } else if (badge.type === 'streak' && (userData.streak ?? 0) >= badge.requirement) {
      hasEarned = true
    } else if (badge.type === 'level' && currentLevel >= badge.requirement) {
      hasEarned = true
    }

    if (hasEarned) {
      earned.push(badge)
    }
  })

  return earned
}

// ============================================
// DAILY QUESTS SYSTEM
// ============================================

export interface DailyQuest {
  id: string
  title: string
  titleEN: string
  xp: number
  icon: string
  type: 'water' | 'workout' | 'sleep' | 'protein' | 'steps'
}

export const dailyQuests: DailyQuest[] = [
  {
    id: 'quest_water',
    title: 'Beber 2.5L de Água',
    titleEN: 'Drink 2.5L of Water',
    xp: 20,
    icon: '💧',
    type: 'water' // Or Drop
  },
  {
    id: 'quest_workout',
    title: 'Completar o Treino do Dia',
    titleEN: 'Complete Today\'s Workout',
    xp: 50,
    icon: '🔥',
    type: 'workout' // Or Dumbbell
  },
  {
    id: 'quest_sleep',
    title: 'Dormir 8 Horas',
    titleEN: 'Sleep 8 Hours',
    xp: 30,
    icon: '🌙',
    type: 'sleep' // Or Moon
  }
]

export function getDailyQuests(): DailyQuest[] {
  return dailyQuests
}
