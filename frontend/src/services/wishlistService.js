import api from './api.js';

export const wishlistService = {
  list: () => api.get('/wishlist').then((r) => r.data),
  add: (productId) => api.post('/wishlist', { productId }).then((r) => r.data),
  remove: (id) => api.delete(`/wishlist/${id}`).then((r) => r.data),
};
