import api from './api.js';

export const alertService = {
  list: () => api.get('/alerts').then((r) => r.data),
  create: (payload) => api.post('/alerts', payload).then((r) => r.data),
  remove: (id) => api.delete(`/alerts/${id}`).then((r) => r.data),
};
