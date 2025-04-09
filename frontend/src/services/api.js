import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

export const medications = {
  getAll: () => api.get('/medications'),
  add: (medication) => api.post('/medications', medication),
  delete: (id) => api.delete(`/medications/${id}`),
  getTodaySchedule: () => api.get('/medications/today'),
  markTaken: (data) => api.post('/medications/mark-taken', data),
};

export default api; 