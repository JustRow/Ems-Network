import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // We check if the environment variables exist, if not we fallback to empty strings 
  // (which will throw when actually used, but prevents crashing on build if missing)
  return createBrowserClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
}
