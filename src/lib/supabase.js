import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
  console.error('Supabase URL is missing or invalid. Please ensure it starts with https://.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
