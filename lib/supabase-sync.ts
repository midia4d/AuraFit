/**
 * AuraFit — Supabase Sync Layer
 *
 * Strategy: localStorage-first (instant UX) + async Supabase sync (cloud backup).
 * The app works 100% offline/without Supabase. Supabase adds cloud persistence.
 *
 * Device ID is used as the user identifier (no auth required in MVP).
 */

import { supabase, getDeviceId } from './supabase'

// ── Generic error wrapper ────────────────────────────────────────────────────

function safeSync<T>(fn: () => Promise<T>): Promise<T | null> {
  return fn().catch((err) => {
    console.warn('[AuraFit Sync]', err?.message ?? err)
    return null
  })
}

// ── User Profile ─────────────────────────────────────────────────────────────

export async function syncUserProfileToCloud(user: Record<string, any>) {
  return safeSync(async () => {
    const device_id = getDeviceId()
    const { error } = await supabase
      .from('user_profiles')
      .upsert(
        {
          device_id,
          goal:               user.goal,
          level:              user.level,
          weight:             user.weight,
          height:             user.height,
          name:               user.name ?? null,
          streak:             user.streak ?? 0,
          xp:                 user.xp ?? 0,
          weekly_goal:        user.weeklyGoal ?? 5,
          last_workout_date:  user.lastWorkoutDate ?? null,
        },
        { onConflict: 'device_id' }
      )
    if (error) throw error
  })
}

export async function fetchUserProfileFromCloud() {
  return safeSync(async () => {
    const device_id = getDeviceId()
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('device_id', device_id)
      .single()
    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
    return data
  })
}

// ── Workout Logs ─────────────────────────────────────────────────────────────

export async function syncWorkoutToCloud(workout: {
  id: string
  date: string
  muscleGroup: string
  exercises: any[]
  xpEarned: number
  durationMinutes?: number
}) {
  return safeSync(async () => {
    const device_id = getDeviceId()
    const { error } = await supabase.from('workout_logs').insert({
      device_id,
      muscle_group:     workout.muscleGroup,
      exercises:        workout.exercises,
      xp_earned:        workout.xpEarned,
      duration_minutes: workout.durationMinutes ?? 0,
      logged_at:        workout.date,
    })
    if (error) throw error
  })
}

export async function fetchWorkoutsFromCloud(limit = 50) {
  return safeSync(async () => {
    const device_id = getDeviceId()
    const { data, error } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('device_id', device_id)
      .order('logged_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data
  })
}

// ── Sleep Logs ───────────────────────────────────────────────────────────────

export async function syncSleepToCloud(log: {
  date: string
  hours: number
  quality: string
}) {
  return safeSync(async () => {
    const device_id = getDeviceId()
    const { error } = await supabase.from('sleep_logs').insert({
      device_id,
      hours:     log.hours,
      quality:   log.quality,
      logged_at: log.date,
    })
    if (error) throw error
  })
}

export async function fetchSleepFromCloud(limit = 30) {
  return safeSync(async () => {
    const device_id = getDeviceId()
    const { data, error } = await supabase
      .from('sleep_logs')
      .select('*')
      .eq('device_id', device_id)
      .order('logged_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data
  })
}

// ── Mood Logs ────────────────────────────────────────────────────────────────

export async function syncMoodToCloud(log: {
  date: string
  energy: number
  motivation: number
}) {
  return safeSync(async () => {
    const device_id = getDeviceId()
    const { error } = await supabase.from('mood_logs').insert({
      device_id,
      energy:     log.energy,
      motivation: log.motivation,
      logged_at:  log.date,
    })
    if (error) throw error
  })
}

export async function fetchMoodFromCloud(limit = 30) {
  return safeSync(async () => {
    const device_id = getDeviceId()
    const { data, error } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('device_id', device_id)
      .order('logged_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data
  })
}

// ── Full restore from cloud → localStorage ───────────────────────────────────
// Useful when user opens the app on a new device with the same device_id link

export async function restoreFromCloud() {
  if (typeof window === 'undefined') return false

  const [profile, workouts, sleep, mood] = await Promise.all([
    fetchUserProfileFromCloud(),
    fetchWorkoutsFromCloud(),
    fetchSleepFromCloud(),
    fetchMoodFromCloud(),
  ])

  let restored = false

  if (profile && !localStorage.getItem('aurafi_user')) {
    const user = {
      goal:             profile.goal,
      level:            profile.level,
      weight:           profile.weight,
      height:           profile.height,
      name:             profile.name,
      streak:           profile.streak,
      xp:               profile.xp,
      weeklyGoal:       profile.weekly_goal,
      lastWorkoutDate:  profile.last_workout_date,
      createdAt:        profile.created_at,
      totalLevel:       1,
    }
    localStorage.setItem('aurafi_user', JSON.stringify(user))
    restored = true
  }

  if (workouts?.length && !localStorage.getItem('aurafi_workouts')) {
    const mapped = workouts.map((w: any) => ({
      id:              w.id,
      date:            w.logged_at,
      muscleGroup:     w.muscle_group,
      exercises:       w.exercises,
      xpEarned:        w.xp_earned,
      durationMinutes: w.duration_minutes,
    }))
    localStorage.setItem('aurafi_workouts', JSON.stringify(mapped.reverse()))
    restored = true
  }

  if (sleep?.length && !localStorage.getItem('aurafi_sleep')) {
    const mapped = sleep.map((s: any) => ({
      id:      s.id,
      date:    s.logged_at,
      hours:   s.hours,
      quality: s.quality,
    }))
    localStorage.setItem('aurafi_sleep', JSON.stringify(mapped.reverse()))
    restored = true
  }

  if (mood?.length && !localStorage.getItem('aurafi_mood')) {
    const mapped = mood.map((m: any) => ({
      id:         m.id,
      date:       m.logged_at,
      energy:     m.energy,
      motivation: m.motivation,
    }))
    localStorage.setItem('aurafi_mood', JSON.stringify(mapped.reverse()))
    restored = true
  }

  return restored
}
