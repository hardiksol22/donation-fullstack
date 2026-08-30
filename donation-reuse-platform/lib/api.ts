import axios from 'axios';

const api = axios.create({
  // Use environment variable in production, fallback to https://donation-fullstack.onrender.comost for development
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://https://donation-fullstack.onrender.comost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;