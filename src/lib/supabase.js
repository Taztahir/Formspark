import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://clfzdsolflhvbkqxszhg.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsZnpkc29sZmxodmJrcXhzemhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NzA5MDEsImV4cCI6MjA5NDQ0NjkwMX0.OAPBm7NU-Cobm-0Fmuzfbvv9FT_UvnJBy-HaEUqYGI4'

if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
  console.error('Supabase URL is missing or invalid. Please ensure it starts with https://.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
