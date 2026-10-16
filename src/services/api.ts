import axios from 'axios';

const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  const isBrowser = typeof window !== 'undefined';
  const isRemote = isBrowser && 
    window.location.hostname !== 'localhost' && 
    window.location.hostname !== '127.0.0.1';

  // If running on a live deployed domain (such as Vercel) and envUrl points to localhost or is missing,
  // automatically route to the cloud Render backend to prevent loopback CORS blocks.
  if (isRemote && (!envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1'))) {
    return 'https://shopping-backend-te3w.onrender.com/api';
  }

  return envUrl || 'https://shopping-backend-te3w.onrender.com/api';
};

export const API_BASE_URL = getApiBaseUrl();

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
