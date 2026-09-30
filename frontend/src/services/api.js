import axios from 'axios';

const getStoredToken = () => {
  const token = localStorage.getItem('ms_token') || localStorage.getItem('token');
  return token || '';
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);

export default api;
