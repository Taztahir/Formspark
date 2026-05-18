import { supabase } from '../lib/supabase';

export const formsService = {
  async getForms() {
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createForm(name) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('forms')
      .insert([{ name, user_id: user.id }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateForm(token, updateData) {
    const { data, error } = await supabase
      .from('forms')
      .update(updateData)
      .eq('token', token)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteForm(token) {
    const { error } = await supabase
      .from('forms')
      .delete()
      .eq('token', token);
    
    if (error) throw error;
  },

  async getFormByToken(token) {
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .eq('token', token)
      .single();
    
    if (error) throw error;
    return data;
  }
};
