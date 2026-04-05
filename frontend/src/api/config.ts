const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:5000';

export const apiBaseUrl = rawApiBaseUrl.replace(/\/$/, '');

export const buildApiUrl = (path: string) => `${apiBaseUrl}${path}`;

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'https://localhost:5000';