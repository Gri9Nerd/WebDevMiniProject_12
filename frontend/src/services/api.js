import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  async (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response) {
      // Server responded with error
      console.error('Server error response:', {
        status: error.response.status,
        data: error.response.data
      });
      
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('No response received from server');
      return Promise.reject({ message: 'No response from server. Please check your connection.' });
    } else {
      // Something else went wrong
      console.error('Error setting up request:', error.message);
      return Promise.reject({ message: 'An unexpected error occurred' });
    }
  }
);

// Auth API
export const auth = {
  register: (userData) => {
    console.log('Registering user:', userData.email);
    return api.post('/auth/register', userData);
  },
  login: (credentials) => {
    console.log('Logging in user:', credentials.email);
    return api.post('/auth/login', credentials);
  },
};

// Medications API
export const medications = {
  getAll: () => api.get('/medications'),
  add: (medication) => api.post('/medications', medication),
  update: (id, medication) => {
    if (!id) {
      return Promise.reject({ message: 'Medication ID is required for update' });
    }
    return api.put(`/medications/${id}`, medication);
  },
  delete: (id) => {
    if (!id) {
      return Promise.reject({ message: 'Medication ID is required for deletion' });
    }
    return api.delete(`/medications/${id}`);
  },
  getTodaySchedule: () => api.get('/medications/today'),
  markTaken: (medicationId, scheduledTime) => {
    if (!medicationId) {
      return Promise.reject({ message: 'Medication ID is required to mark as taken' });
    }
    return api.post('/medications/mark-taken', { medicationId, scheduledTime });
  },
  getStats: () => api.get('/medications/stats'),
};

export default api; 