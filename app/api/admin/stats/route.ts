import { NextResponse } from 'next/server'
import { supabaseService } from '@/lib/supabase-service'

export async function GET() {
  try {
    const [
      { count: users },
      { count: workouts },
      { count: premium },
      { count: challenges },
      { data: recentWorkouts }
    ] = await Promise.all([
      supabaseService.from('user_profiles').select('*', { count: 'exact', head: true }),
      supabaseService.from('workout_logs').select('*', { count: 'exact', head: true }),
      supabaseService.from('user_subscriptions').select('*', { count: 'exact', head: true }).gt('expires_at', new Date().toISOString()),
      supabaseService.from('challenges').select('*', { count: 'exact', head: true }).eq('is_active', true).gte('ends_at', new Date().toISOString()),
      supabaseService.from('workout_logs').select('*').order('logged_at', { ascending: false }).limit(20)
    ])

    // Workouts today
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const { count: todayWorkouts } = await supabaseService
      .from('workout_logs')
      .select('*', { count: 'exact', head: true })
      .gte('logged_at', startOfDay.toISOString())

    return NextResponse.json({
      totalUsers: users ?? 0,
      totalWorkouts: workouts ?? 0,
      premiumUsers: premium ?? 0,
      activeChallenges: challenges ?? 0,
      workoutsToday: todayWorkouts ?? 0,
      recentActivity: recentWorkouts ?? []
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
