import { supabase } from '../lib/supabase';

export const apiKeyService = {
  async getApiKey() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async generateApiKey() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('api_keys')
      .insert([{ user_id: user.id }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteApiKey(id) {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
