import { supabase } from '../lib/supabase'

export const getTeamMembers = async (formId) => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*, profiles(name, email)')
    .eq('form_id', formId)
  if (error) throw error
  return data
}

export const inviteMember = async (formId, email, role) => {
  // Look up the user by email in profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()
  if (profileError) throw new Error('No FormSpark account found with that email')

  const { error } = await supabase
    .from('team_members')
    .insert({ form_id: formId, user_id: profile.id, role })
  if (error) throw error
}

export const updateMemberRole = async (memberId, role) => {
  const { error } = await supabase
    .from('team_members')
    .update({ role })
    .eq('id', memberId)
  if (error) throw error
}

export const removeMember = async (memberId) => {
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', memberId)
  if (error) throw error
}
