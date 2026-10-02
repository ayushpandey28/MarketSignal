import axios from 'axios';
import { API_BASE_URL } from '../utils/apiUrl.js';

const getStoredToken = () => {
  const token = localStorage.getItem('ms_token') || localStorage.getItem('token');
  return token || '';
};

const api = axios.create({
  baseURL: API_BASE_URL,
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
