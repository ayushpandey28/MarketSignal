import api from './api.js';

export const demandService = {
  trending: (params) => api.get('/demand/trending', { params }).then((r) => r.data),
  product: (productId) => api.get(`/demand/${productId}`).then((r) => r.data),
  regions: () => api.get('/demand/regions').then((r) => r.data),
  categories: () => api.get('/demand/categories').then((r) => r.data),
  timeline: (params) => api.get('/demand/timeline', { params }).then((r) => r.data),
};

export const signalService = {
  interests: () => api.get('/signals/interests').then((r) => r.data),
  search: (payload) => api.post('/signals/search', payload).then((r) => r.data),
  view: (payload) => api.post('/signals/view', payload).then((r) => r.data),
  interest: (payload) => api.post('/signals/interest', payload).then((r) => r.data),
};
