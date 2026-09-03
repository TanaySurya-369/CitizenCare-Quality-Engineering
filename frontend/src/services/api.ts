import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT Authorization Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('citizencare_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 unauthenticated redirects
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, clear localStorage
      if (localStorage.getItem('citizencare_token')) {
        localStorage.removeItem('citizencare_token');
        localStorage.removeItem('citizencare_user');
        // Do not force redirect if already on login/landing
        if (
          !window.location.pathname.includes('/login') &&
          !window.location.pathname.includes('/register') &&
          window.location.pathname !== '/'
        ) {
          window.location.href = '/login?session=expired';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
