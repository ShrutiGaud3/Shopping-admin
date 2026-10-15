import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://shopping-backend-te3w.onrender.com/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach Admin JWT Token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('velora_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Authentication Expirations
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('velora_admin_token');
        localStorage.removeItem('velora_admin_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
