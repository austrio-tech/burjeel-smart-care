import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Log errors to console instead of blocking UI
    const errorMessage = error.response?.data?.message || error.message || 'Network error';
    const errorCode = error.response?.status;
    
    console.error(`[API Error ${errorCode}]:`, errorMessage);
    
    // Only redirect on 401 if user has a token (authenticated session expired)
    if (error.response?.status === 401 && localStorage.getItem('authToken')) {
      console.warn('Token expired, logging out...');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Return error but don't block the UI
    return Promise.reject(error.response?.data || { message: errorMessage });
  }
);

export default api;
