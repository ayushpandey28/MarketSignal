import api from './api.js';

export const sellerService = {
  dashboard: () => api.get('/seller/dashboard').then((r) => r.data),
  opportunities: () => api.get('/seller/opportunities').then((r) => r.data),
  analytics: () => api.get('/seller/analytics').then((r) => r.data),
  inventory: () => api.get('/seller/inventory').then((r) => r.data),
  products: () => api.get('/seller/products').then((r) => r.data),
};

export const adminService = {
  analytics: () => api.get('/admin/analytics').then((r) => r.data),
  users: () => api.get('/admin/users').then((r) => r.data),
  products: () => api.get('/admin/products').then((r) => r.data),
  categories: () => api.get('/admin/categories').then((r) => r.data),
  addCategory: (name) => api.post('/admin/categories', { name }).then((r) => r.data),
  toggleUser: (id) => api.patch(`/admin/users/${id}/toggle`).then((r) => r.data),
  signals: () => api.get('/admin/signals').then((r) => r.data),
};
