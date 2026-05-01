// Local storage utilities for AuraFi - v2 (streak bug fixed, charts, notifications)
// Supabase sync is fire-and-forget — localStorage is always the primary source of truth
import {
  syncUserProfileToCloud,
  syncWorkoutToCloud,
  syncSleepToCloud,
  syncMoodToCloud,
} from './supabase-sync'

export interface UserData {
  goal: 'bulking' | 'cutting' | 'definition' | 'maintenance'
  level: 'beginner' | 'intermediate' | 'advanced' | 'gymrat'
  weight: number
  height: number
  createdAt: string
  streak: number
  lastWorkoutDate?: string
  lastStreakCheckDate?: string // prevents multiple resets per day
  xp: number
  totalLevel: number
  weeklyGoal?: number
  notificationsEnabled?: boolean
  notificationTime?: string
  name?: string
}

export interface WorkoutLog {
  id: string
  date: string
  muscleGroup: string
  exercises: Array<{
    id: string
    sets: number
    reps: number
    weight: number
  }>
  xpEarned: number
  durationMinutes?: number
}

export interface SleepLog {
  id: string
  date: string
  hours: number
  quality: 'poor' | 'average' | 'good' | 'excellent'
}

export interface MoodLog {
  id: string
  date: string
  energy: number
  motivation: number
  note?: string
}

export interface NotificationPrefs {
  enabled: boolean
  time: string
}

// ─── User ──────────────────────────────────────────────────────────────────────

export function getUserData(): UserData | null {
  if (typeof window === 'undefined') return null
  try {
    const data = localStorage.getItem('aurafi_user')
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function saveUserData(data: UserData) {
  if (typeof window === 'undefined') return
  localStorage.setItem('aurafi_user', JSON.stringify(data))
  // Fire-and-forget cloud sync
  syncUserProfileToCloud(data as any).catch(() => {})
}

/**
 * FIX: Streak logic reworked.
 * - Called ONLY on Dashboard load to detect if streak was broken
 * - Does NOT increment (increment happens in incrementStreakOnWorkout)
 * - Uses lastStreakCheckDate to run at most once per day
 */
export function updateUserStreak() {
  const user = getUserData()
  if (!user) return

  const today = new Date().toDateString()

  // Already ran today – don't touch streak again
  if (user.lastStreakCheckDate === today) return
  user.lastStreakCheckDate = today

  const lastWorkout = user.lastWorkoutDate
    ? new Date(user.lastWorkoutDate).toDateString()
    : null

  // If last workout was more than 1 day ago, reset streak
  if (lastWorkout && lastWorkout !== today) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toDateString()

    if (lastWorkout !== yesterdayStr) {
      user.streak = 0
    }
  }

  saveUserData(user)
}

/**
 * Called ONLY when a workout is successfully saved.
 * Properly increments (or resets) the streak.
 */
export function incrementStreakOnWorkout() {
  const user = getUserData()
  if (!user) return

  const today = new Date().toDateString()
  const lastWorkout = user.lastWorkoutDate
    ? new Date(user.lastWorkoutDate).toDateString()
    : null

  // Already worked out today – no change
  if (lastWorkout === today) return

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()

  if (lastWorkout === yesterdayStr || lastWorkout === null) {
    // Consecutive day or first ever workout
    user.streak = (user.streak ?? 0) + 1
  } else {
    // Gap – reset to 1
    user.streak = 1
  }

  user.lastStreakCheckDate = today
  saveUserData(user)
}

// ─── Workouts ──────────────────────────────────────────────────────────────────

export function getWorkoutHistory(): WorkoutLog[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem('aurafi_workouts')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveWorkout(workout: WorkoutLog) {
  const history = getWorkoutHistory()
  history.push(workout)
  localStorage.setItem('aurafi_workouts', JSON.stringify(history))

  const user = getUserData()
  if (user) {
    user.lastWorkoutDate = workout.date
    user.xp = (user.xp ?? 0) + workout.xpEarned
    saveUserData(user)
    incrementStreakOnWorkout()
  }

  // Fire-and-forget cloud sync
  syncWorkoutToCloud(workout).catch(() => {})
}

export function getWorkoutsThisWeek(): WorkoutLog[] {
  const history = getWorkoutHistory()
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  return history.filter((w) => new Date(w.date) > weekAgo)
}

/** Returns one entry per day for the last N days, suitable for charts */
export function getWorkoutsByDay(
  days: number,
  locale = 'pt-BR'
): Array<{ date: string; count: number; xp: number }> {
  const history = getWorkoutHistory()
  const result: Array<{ date: string; count: number; xp: number }> = []

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toDateString()
    const dateLabel = d.toLocaleDateString(locale, { weekday: 'short' })

    const dayWorkouts = history.filter(
      (w) => new Date(w.date).toDateString() === dateStr
    )
    result.push({
      date: dateLabel,
      count: dayWorkouts.length,
      xp: dayWorkouts.reduce((sum, w) => sum + w.xpEarned, 0),
    })
  }
  return result
}

// ─── Sleep ─────────────────────────────────────────────────────────────────────

export function getSleepLogs(): SleepLog[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem('aurafi_sleep')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveSleepLog(log: SleepLog) {
  const logs = getSleepLogs()
  const existing = logs.findIndex(
    (l) =>
      new Date(l.date).toDateString() === new Date(log.date).toDateString()
  )
  if (existing >= 0) {
    logs[existing] = log
  } else {
    logs.push(log)
  }
  localStorage.setItem('aurafi_sleep', JSON.stringify(logs))
  // Fire-and-forget cloud sync
  syncSleepToCloud(log).catch(() => {})
}

/** Returns one entry per day for the last N days */
export function getSleepByDay(
  days: number,
  locale = 'pt-BR'
): Array<{ date: string; hours: number; quality: string }> {
  const logs = getSleepLogs()
  const result: Array<{ date: string; hours: number; quality: string }> = []

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toDateString()
    const dateLabel = d.toLocaleDateString(locale, { weekday: 'short' })

    const log = logs.find(
      (l) => new Date(l.date).toDateString() === dateStr
    )
    result.push({
      date: dateLabel,
      hours: log?.hours ?? 0,
      quality: log?.quality ?? '',
    })
  }
  return result
}

// ─── Mood ──────────────────────────────────────────────────────────────────────

export function getMoodLogs(): MoodLog[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem('aurafi_mood')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveMoodLog(log: MoodLog) {
  const logs = getMoodLogs()
  const existing = logs.findIndex(
    (l) =>
      new Date(l.date).toDateString() === new Date(log.date).toDateString()
  )
  if (existing >= 0) {
    logs[existing] = log
  } else {
    logs.push(log)
  }
  localStorage.setItem('aurafi_mood', JSON.stringify(logs))
  // Fire-and-forget cloud sync
  syncMoodToCloud(log).catch(() => {})
}

/** Returns mood data for the last N days */
export function getMoodByDay(
  days: number,
  locale = 'pt-BR'
): Array<{ date: string; energy: number; motivation: number }> {
  const logs = getMoodLogs()
  const result: Array<{ date: string; energy: number; motivation: number }> = []

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toDateString()
    const dateLabel = d.toLocaleDateString(locale, { weekday: 'short' })

    const log = logs.find(
      (l) => new Date(l.date).toDateString() === dateStr
    )
    result.push({
      date: dateLabel,
      energy: log?.energy ?? 0,
      motivation: log?.motivation ?? 0,
    })
  }
  return result
}

// ─── Notifications ─────────────────────────────────────────────────────────────

export function getNotificationPrefs(): NotificationPrefs {
  if (typeof window === 'undefined') return { enabled: false, time: '08:00' }
  try {
    const data = localStorage.getItem('aurafi_notifications')
    return data ? JSON.parse(data) : { enabled: false, time: '08:00' }
  } catch {
    return { enabled: false, time: '08:00' }
  }
}

export function saveNotificationPrefs(prefs: NotificationPrefs) {
  if (typeof window === 'undefined') return
  localStorage.setItem('aurafi_notifications', JSON.stringify(prefs))
}
