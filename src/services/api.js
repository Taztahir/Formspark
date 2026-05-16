import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: '', // Proxy handles this
  withCredentials: true,
});

// Response interceptor to handle session expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup') && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const formsAPI = {
  getForms: () => api.get('/api/forms'),
  getForm: (token) => api.get(`/api/forms/${token}`),
  createForm: (data) => api.post('/api/forms/create', data),
  updateForm: (token, data) => api.put(`/api/forms/${token}`, data),
  deleteForm: (token) => api.delete(`/api/forms/${token}`),
};

export const submissionsAPI = {
  getSubmissions: (token, params) => api.get(`/api/submissions/${token}`, { params }),
  getAnalytics: (token) => api.get(`/api/submissions/${token}/analytics`),
  deleteSubmission: (id) => api.delete(`/api/submissions/${id}`),
  exportCSV: (token) => {
    // For exports, we might just use a direct link or a blob
    window.location.href = `/api/submissions/${token}/export`;
  },
};

export const apiKeysAPI = {
  listKeys: () => api.get('/api/forms/apikeys/list'),
  generateKey: (data) => api.post('/api/forms/apikeys', data),
};

export const teamAPI = {
  getTeam: (token) => api.get(`/api/forms/${token}/team`),
  inviteMember: (token, data) => api.post(`/api/forms/${token}/team`, data),
  removeMember: (token, memberId) => api.delete(`/api/forms/${token}/team/${memberId}`),
};

export default api;
