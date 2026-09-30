import api from './api.js';

const AI_TIMEOUT = 60000;

export const aiService = {
  explainTrend: (productId) => api.post('/ai/explain-trend', { productId }, { timeout: AI_TIMEOUT }).then((r) => r.data),
  marketReport: () => api.post('/ai/market-report', undefined, { timeout: AI_TIMEOUT }).then((r) => r.data),
  chat: (question) => api.post('/ai/chat', { question }, { timeout: AI_TIMEOUT }).then((r) => r.data),
};
