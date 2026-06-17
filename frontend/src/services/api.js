import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

export const datasetAPI = {
  upload: (formData) => api.post('/datasets/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  manual: (data) => api.post('/datasets/manual', data),
  getAll: () => api.get('/datasets'),
  getById: (id) => api.get(`/datasets/${id}`),
  delete: (id) => api.delete(`/datasets/${id}`),
};

export const analysisAPI = {
  run: (data) => api.post('/analysis/run', data),
  getAll: () => api.get('/analysis'),
};

export const reportAPI = {
  getAll: () => api.get('/reports'),
  download: (id) => api.get(`/reports/download/${id}`, { responseType: 'blob' }),
};

export default api;
