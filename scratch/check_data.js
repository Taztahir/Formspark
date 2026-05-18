import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://clfzdsolflhvbkqxszhg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsZnpkc29sZmxodmJrcXhzemhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NzA5MDEsImV4cCI6MjA5NDQ0NjkwMX0.OAPBm7NU-Cobm-0Fmuzfbvv9FT_UvnJBy-HaEUqYGI4'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function check() {
  console.log('--- AUDITING FORMS ---')
  const { data: forms, error: formsErr } = await supabase
    .from('forms')
    .select('id, name, token, user_id')
  
  if (formsErr) {
    console.error('Error fetching forms:', formsErr)
  } else {
    console.log(`Found ${forms.length} forms:`, forms)
  }

  console.log('\n--- AUDITING SUBMISSIONS ---')
  const { data: subs, error: subsErr } = await supabase
    .from('submissions')
    .select('id, form_id, is_spam, created_at')
  
  if (subsErr) {
    console.error('Error fetching submissions:', subsErr)
  } else {
    console.log(`Found ${subs.length} submissions:`, subs)
  }
}

check()
