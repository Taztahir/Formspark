import { supabase } from '../lib/supabase';

export const submissionsService = {
  async getSubmissions(formId, filters = {}) {
    let query = supabase
      .from('submissions')
      .select('*')
      .eq('form_id', formId)
      .order('created_at', { ascending: false });

    if (filters.is_spam !== undefined) {
      query = query.eq('is_spam', filters.is_spam);
    }

    if (filters.startDate && filters.endDate) {
      query = query.gte('created_at', filters.startDate).lte('created_at', filters.endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async deleteSubmission(id) {
    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getSubmissionStats(formId) {
    // This is a simplified version. For a production app, you might use a Supabase RPC or multiple queries.
    const { data, error } = await supabase
      .from('submissions')
      .select('created_at, is_spam')
      .eq('form_id', formId);
    
    if (error) throw error;

    const today = new Date().toISOString().split('T')[0];
    const stats = {
      total: data.length,
      today: data.filter(s => s.created_at.startsWith(today)).length,
      spam: data.filter(s => s.is_spam).length,
      avgPerDay: (data.length / 30).toFixed(1) // Simplified avg
    };

    return stats;
  },

  async exportCSV(formId) {
    const { data, error } = await supabase
      .from('submissions')
      .select('created_at, data')
      .eq('form_id', formId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (data.length === 0) return;

    // Get all unique keys from JSON data
    const headers = ['date', ...new Set(data.flatMap(s => Object.keys(s.data)))];
    
    const csvRows = [
      headers.join(','),
      ...data.map(s => {
        return [
          s.created_at,
          ...headers.slice(1).map(h => {
            const val = s.data[h] || '';
            return `"${String(val).replace(/"/g, '""')}"`;
          })
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `submissions_${formId}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};
