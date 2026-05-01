'use client'

import { useEffect, useRef } from 'react'
import { getNotificationPrefs } from '@/lib/storage'

/** Schedules a local notification via the Service Worker at a given HH:MM time.
 *  Returns a cleanup function to cancel the scheduled timeout. */
function scheduleLocalNotification(
  timeStr: string
): ReturnType<typeof setTimeout> | null {
  if (typeof window === 'undefined') return null
  if (!('Notification' in window) || Notification.permission !== 'granted') return null
  if (!('serviceWorker' in navigator)) return null

  const [hours, minutes] = timeStr.split(':').map(Number)
  const now = new Date()
  const target = new Date()
  target.setHours(hours, minutes, 0, 0)

  // If time already passed today, schedule for tomorrow
  if (target <= now) {
    target.setDate(target.getDate() + 1)
  }

  const delay = target.getTime() - now.getTime()

  const timeout = setTimeout(async () => {
    try {
      const reg = await navigator.serviceWorker.ready
      await reg.showNotification('AuraFit 💪', {
        body: 'Hora do treino! Vamos evoluir hoje 🔥',
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        vibrate: [200, 100, 200],
        data: { url: '/workouts' },
        tag: 'workout-reminder',
      } as NotificationOptions)
    } catch (e) {
      console.warn('[AuraFit SW] Notification error:', e)
    }

    // Reschedule for the next day
    scheduleLocalNotification(timeStr)
  }, delay)

  return timeout
}

export function RegisterServiceWorker() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // 1. Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(async (reg) => {
          console.log('[AuraFit] SW registered')

          // Try Periodic Background Sync (Chrome only, requires HTTPS)
          if ('periodicSync' in reg) {
            try {
              await (reg as any).periodicSync.register('workout-reminder', {
                minInterval: 24 * 60 * 60 * 1000,
              })
            } catch (_) {
              // Not supported or permission denied — fall back to setTimeout
            }
          }
        })
        .catch((err) => console.warn('[AuraFit] SW registration failed:', err))
    }

    // 2. Request Notification permission (graceful)
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          scheduleNotificationsIfEnabled()
        }
      })
    } else {
      scheduleNotificationsIfEnabled()
    }

    function scheduleNotificationsIfEnabled() {
      const prefs = getNotificationPrefs()
      if (prefs.enabled && Notification.permission === 'granted') {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = scheduleLocalNotification(prefs.time ?? '08:00')
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return null
}
