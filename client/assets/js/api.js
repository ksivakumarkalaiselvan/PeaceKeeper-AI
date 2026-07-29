import { showToast } from './toast.js';

const API_BASE = '/api/v1';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('pk_token');
  const headers = options.headers || {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    
    if (response.status === 401 && !endpoint.includes('/auth/login')) {
      localStorage.removeItem('pk_token');
      localStorage.removeItem('pk_user');
      window.location.href = '/login.html';
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data.message || 'API request failed';
      showToast(errMsg, 'error');
      throw new Error(errMsg);
    }

    return data;
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err);
    throw err;
  }
}
