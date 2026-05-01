import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client — uses anon key + persists auth sessions
// Auth sessions are needed for the admin panel login
export const supabase = createClient(supabaseUrl, supabaseAnon)

// ── Device ID ───────────────────────────────────────────────────────────────
// MVP identity: stable UUID per browser stored in localStorage.
// No user account required for the regular app.

export function getDeviceId(): string {
  if (typeof window === 'undefined') return 'ssr'
  let id = localStorage.getItem('aurafi_device_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('aurafi_device_id', id)
  }
  return id
}

// ── Admin helpers ───────────────────────────────────────────────────────────

export async function getCurrentAdmin() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null

  const { data } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return data ?? null
}

export async function signOutAdmin() {
  await supabase.auth.signOut()
}
