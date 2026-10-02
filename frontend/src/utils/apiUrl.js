const configuredApiUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

export const API_BASE_URL = configuredApiUrl.endsWith('/api')
  ? configuredApiUrl
  : `${configuredApiUrl}/api`;

export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '');

export function resolveImageUrl(imageUrl) {
  if (!imageUrl) return '';
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  if (imageUrl.startsWith('/uploads/')) return `${API_ORIGIN}${imageUrl}`;
  return imageUrl;
}