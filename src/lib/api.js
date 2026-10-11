// ==========================================
// Axios API client
// - Automatically attaches the access token
// - Handles 401 by refreshing the access token once
// - Redirects to /login on auth failure
// ==========================================

import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from './constants';
import { loadTokens, saveTokens, clearTokens } from './secureStore';

// ==========================================
// Base instance
// ==========================================
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ==========================================
// Request interceptor — inject access token
// ==========================================
api.interceptors.request.use(
  async (config) => {
    // Skip auth injection for public auth endpoints
    if (
      config.url?.includes('/auth/login') ||
      config.url?.includes('/auth/register') ||
      config.url?.includes('/auth/google') ||
      config.url?.includes('/auth/refresh')
    ) {
      return config;
    }

    const { access_token } = await loadTokens();
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================================
// Response interceptor — refresh on 401
// ==========================================
let isRefreshing = false;
let pendingRequests = [];

function queueRequest(resolve, reject) {
  pendingRequests.push({ resolve, reject });
}

function flushQueue(error, token = null) {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingRequests = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Only try refresh for 401 (not for 403, 404, etc.)
    if (status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't try to refresh if we were calling refresh itself
    if (originalRequest.url?.includes('/auth/refresh')) {
      await clearTokens();
      window.location.hash = '#/login';
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Wait for the ongoing refresh to complete
      return new Promise((resolve, reject) => {
        queueRequest(resolve, reject);
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { refresh_token } = await loadTokens();
      if (!refresh_token) throw new Error('No refresh token');

      const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refresh_token,
      });

      const newAccessToken = data.access_token;
      await saveTokens({ access_token: newAccessToken });

      flushQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      flushQueue(refreshError);
      await clearTokens();
      window.location.hash = '#/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;