import { supabase } from '../lib/supabase'

export const getApiKey = async () => {
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .limit(1)
  if (error) throw error
  return data && data.length > 0 ? data[0] : null
}

export const generateApiKey = async () => {
  // Delete existing key first
  await supabase.from('api_keys').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('api_keys')
    .insert({ user_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export const deleteApiKey = async (id) => {
  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', id)
  if (error) throw error
}
