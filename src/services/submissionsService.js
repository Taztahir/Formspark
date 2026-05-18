import { supabase } from '../lib/supabase'

// Get all submissions for a form with optional filters
export const getSubmissions = async (formId, { search, startDate, endDate, showSpam } = {}) => {
  let query = supabase
    .from('submissions')
    .select('*')
    .eq('form_id', formId)
    .order('created_at', { ascending: false })

  if (!showSpam) query = query.eq('is_spam', false)
  if (startDate) query = query.gte('created_at', startDate)
  if (endDate) query = query.lte('created_at', endDate)

  const { data, error } = await query
  if (error) throw error

  // Apply search filter client-side (searches all JSONB fields)
  if (search) {
    return data.filter(s =>
      JSON.stringify(s.data).toLowerCase().includes(search.toLowerCase())
    )
  }
  return data
}

// Compute stats for a form
export const getSubmissionStats = async (formId) => {
  const { data, error } = await supabase
    .from('submissions')
    .select('created_at, is_spam')
    .eq('form_id', formId)
  if (error) throw error

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const total = data.length
  const today = data.filter(s => new Date(s.created_at) >= todayStart).length
  const spam = data.filter(s => s.is_spam).length
  
  // Calculate average submissions per day over active period or 30 days
  let avgPerDay = 0
  if (data.length > 0) {
    const oldestSub = new Date(data[data.length - 1].created_at)
    const daysActive = Math.max(1, Math.ceil((now - oldestSub) / (1000 * 60 * 60 * 24)))
    avgPerDay = (data.length / daysActive).toFixed(1)
  }

  // Build chart data — last 30 days
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(now)
    date.setDate(date.getDate() - (29 - i))
    const dateStr = date.toISOString().split('T')[0]
    return {
      date: date.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      count: data.filter(s => s.created_at.startsWith(dateStr) && !s.is_spam).length
    }
  })

  return { total, today, spam, avgPerDay, chartData }
}

// Delete a single submission
export const deleteSubmission = async (id) => {
  const { error } = await supabase
    .from('submissions')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// Export submissions as a downloadable CSV file
export const exportCSV = async (formId, formName) => {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('form_id', formId)
    .eq('is_spam', false)
    .order('created_at', { ascending: false })
  if (error) throw error
  if (!data || !data.length) return

  // Collect all unique keys from JSONB data
  const allKeys = [...new Set(data.flatMap(s => Object.keys(s.data || {})))]
  const headers = ['Date', 'Time', ...allKeys]
  const rows = data.map(s => {
    const date = new Date(s.created_at)
    return [
      date.toLocaleDateString(),
      date.toLocaleTimeString(),
      ...allKeys.map(k => s.data?.[k] ?? '')
    ]
  })

  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${formName}-submissions.csv`
  a.click()
  URL.revokeObjectURL(url)
}
