import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log(`[Request Interceptor] URL: ${config.url}, Token exists: ${!!token}`);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`[Request Interceptor] Authorization Header set: Bearer ${token.substring(0, 15)}...`);
  } else {
    console.log(`[Request Interceptor] No token found in localStorage`);
  }
  return config;
}, (error) => {
  console.error('[Request Interceptor Error]', error);
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  console.error(`[Response Interceptor Error] URL: ${error.config?.url}, Status: ${error.response?.status}, Error:`, error.response?.data || error.message);
  
  if (error.response && error.response.status === 401) {
    console.warn('[Response Interceptor] 401 Unauthorized encountered. Clearing session and redirecting to login.');
    // Only redirect if we were previously logged in or have tokens to clear
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token || user) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Redirect to home page with expired flag
      window.location.href = '/?expired=true';
    }
  }
  return Promise.reject(error);
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
  generatePDF: (datasetId) => api.post(`/reports/pdf/${datasetId}`, {}, { responseType: 'blob' }),
  generateExcel: (datasetId) => api.post(`/reports/excel/${datasetId}`, {}, { responseType: 'blob' }),
  download: (id) => api.get(`/reports/download/${id}`, { responseType: 'blob' }),
};

export default api;
