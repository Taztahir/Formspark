import { useState, useEffect, useCallback } from 'react'
import { getSubmissions, getSubmissionStats, deleteSubmission, exportCSV } from '../services/submissionsService'

export const useSubmissions = (formId) => {
  const [submissions, setSubmissions] = useState([])
  const [stats, setStats] = useState({ total: 0, today: 0, spam: 0, avgPerDay: 0, chartData: [] })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', startDate: null, endDate: null, showSpam: false })

  const fetchAll = useCallback(async () => {
    if (!formId) return
    try {
      setLoading(true)
      const [subs, statsData] = await Promise.all([
        getSubmissions(formId, filters),
        getSubmissionStats(formId)
      ])
      setSubmissions(subs)
      setStats(statsData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [formId, filters])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleDelete = async (id) => {
    await deleteSubmission(id)
    setSubmissions(prev => prev.filter(s => s.id !== id))
    setStats(prev => ({ ...prev, total: prev.total - 1 }))
  }

  const handleExport = async (formName) => {
    await exportCSV(formId, formName)
  }

  const addSubmission = (submission) => {
    setSubmissions(prev => [submission, ...prev])
    setStats(prev => ({ 
      ...prev, 
      total: prev.total + 1, 
      today: prev.today + 1,
      chartData: prev.chartData.map(d => {
        const todayStr = new Date().toLocaleDateString('en', { month: 'short', day: 'numeric' })
        if (d.date === todayStr) {
          return { ...d, count: d.count + 1 }
        }
        return d
      })
    }))
  }

  return { submissions, stats, loading, filters, setFilters, handleDelete, handleExport, addSubmission }
}
