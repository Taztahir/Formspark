import { useState, useEffect, useCallback } from 'react'
import { getForms, createForm, updateForm, deleteForm } from '../services/formsService'

export const useForms = () => {
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchForms = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getForms()
      setForms(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchForms() }, [fetchForms])

  const handleCreate = async (payload) => {
    const newForm = await createForm(payload)
    setForms(prev => [newForm, ...prev])
    return newForm
  }

  const handleUpdate = async (token, updates) => {
    const updated = await updateForm(token, updates)
    setForms(prev => prev.map(f => f.token === token ? updated : f))
    return updated
  }

  const handleDelete = async (token) => {
    await deleteForm(token)
    setForms(prev => prev.filter(f => f.token !== token))
  }

  return { forms, loading, error, fetchForms, handleCreate, handleUpdate, handleDelete }
}
