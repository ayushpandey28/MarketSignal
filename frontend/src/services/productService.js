import api from './api.js';

export const productService = {
  list: (params) => api.get('/products', { params }).then((r) => r.data),
  get: (id) => api.get(`/products/${id}`).then((r) => r.data),
  categories: () => api.get('/products/categories/list').then((r) => r.data),
  create: (formData) => api.post('/products', formData).then((r) => r.data),
  update: (id, formData) => api.put(`/products/${id}`, formData).then((r) => r.data),
  remove: (id) => api.delete(`/products/${id}`).then((r) => r.data),
};
