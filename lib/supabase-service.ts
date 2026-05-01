// Server-side Supabase client with service role key
// ⚠️ NEVER import this in client components or expose to the browser
// Only use in Next.js API routes (app/api/**)

import { createClient } from '@supabase/supabase-js'

export const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)
