import { supabase } from '../lib/supabase';

export const teamService = {
  async getTeamMembers(formId) {
    const { data, error } = await supabase
      .from('team_members')
      .select('*, profiles(*)')
      .eq('form_id', formId);
    
    if (error) throw error;
    return data;
  },

  async inviteMember(formId, email, role = 'viewer') {
    // Note: In a real app, this might involve looking up a user or sending an email.
    // For simplicity, we assume the user exists and we have their profile ID.
    // This is just a placeholder logic.
    const { data: profile, error: pError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();
    
    if (pError) throw new Error('User not found');

    const { data, error } = await supabase
      .from('team_members')
      .insert([{ form_id: formId, user_id: profile.id, role }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async removeMember(memberId) {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', memberId);
    
    if (error) throw error;
  }
};
