import { useState, useEffect } from 'react';
import { formsAPI } from '../services/api';
import toast from 'react-hot-toast';

const useForms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchForms = async () => {
    setLoading(true);
    try {
      const res = await formsAPI.getForms();
      setForms(res.data.forms);
    } catch (err) {
      setError(err);
      toast.error('Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  const createForm = async (data) => {
    try {
      const res = await formsAPI.createForm(data);
      setForms([res.data.form, ...forms]);
      toast.success('Form created successfully!');
      return res.data.form;
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create form');
      throw err;
    }
  };

  const deleteForm = async (token) => {
    try {
      await formsAPI.deleteForm(token);
      setForms(forms.filter(f => f.token !== token));
      toast.success('Form deleted');
    } catch (err) {
      toast.error('Failed to delete form');
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  return { forms, loading, error, fetchForms, createForm, deleteForm };
};

export default useForms;
