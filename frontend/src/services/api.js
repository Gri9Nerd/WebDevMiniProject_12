import axios from 'axios';
import { auth } from '../config/firebase';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Token added to request');
      } else {
        console.warn('No authenticated user found');
      }
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
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
        // Unauthorized - redirect to login
        console.log('Unauthorized, redirecting to login');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      // Connection refused - server might be down
      console.error('Connection refused. Please check if the server is running.');
      return Promise.reject({ 
        message: 'Server is not responding. Please try again later.',
        code: 'SERVER_DOWN'
      });
    } else if (error.request) {
      // Request made but no response
      console.error('No response received from server');
      return Promise.reject({ 
        message: 'No response from server. Please check your connection.',
        code: 'NO_RESPONSE'
      });
    } else {
      // Something else went wrong
      console.error('Error setting up request:', error.message);
      return Promise.reject({ 
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR'
      });
    }
  }
);

// Auth API
export const authApi = {
  register: (userData) => {
    console.log('Registering user:', userData.email);
    return api.post('/auth/register', userData);
  },
  login: (credentials) => {
    console.log('Logging in user:', credentials.email);
    return api.post('/auth/login', credentials);
  },
  getProfile: () => api.get('/auth/profile'),
};

// Medications API
export const medications = {
  getAll: () => api.get('/medications'),
  getById: (id) => api.get(`/medications/${id}`),
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
  markTaken: (id, scheduledTime) => {
    if (!id) {
      return Promise.reject({ message: 'Medication ID is required for marking as taken' });
    }
    return api.post('/medications/mark-taken', { medicationId: id, scheduledTime });
  },
  getStats: () => api.get('/medications/stats'),
};

export default api; 