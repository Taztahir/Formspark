import { useState, useEffect } from 'react';
import { submissionsAPI } from '../services/api';
import toast from 'react-hot-toast';

const useSubmissions = (token) => {
  const [submissions, setSubmissions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubmissions = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [subRes, anaRes] = await Promise.all([
        submissionsAPI.getSubmissions(token),
        submissionsAPI.getAnalytics(token)
      ]);
      setSubmissions(subRes.data.submissions);
      setAnalytics(anaRes.data.analytics);
    } catch (err) {
      setError(err);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const deleteSubmission = async (id) => {
    try {
      await submissionsAPI.deleteSubmission(id);
      setSubmissions(submissions.filter(s => s.id !== id));
      toast.success('Submission deleted');
    } catch (err) {
      toast.error('Failed to delete submission');
    }
  };

  const exportCSV = () => {
    if (!token) return;
    submissionsAPI.exportCSV(token);
    toast.success('Export started');
  };

  useEffect(() => {
    fetchSubmissions();
  }, [token]);

  return { submissions, analytics, loading, error, fetchSubmissions, deleteSubmission, exportCSV };
};

export default useSubmissions;
