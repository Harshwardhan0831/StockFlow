import axios from 'axios';

// Relative baseURL by default (works with Vite proxy or Vercel rewrites), or custom VITE_API_URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

let isRefreshing = false;
let refreshPromise = null;

const clearAuth = () => {
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const status = err.response?.status;

    // Never retry the refresh endpoint itself (prevents infinite loops)
    if (original?.url?.includes('/auth/refresh')) {
      clearAuth();
      return Promise.reject(err);
    }

    // Only attempt a refresh once per request, and never for /auth/me or /auth/login
    const skipRefresh = ['/auth/login', '/auth/register', '/auth/me'].some((p) =>
      original?.url?.includes(p)
    );

    if (status === 401 && !original._retry && !skipRefresh) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = api
          .post('/auth/refresh')
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });
      }

      try {
        await refreshPromise;
        return api(original);
      } catch (refreshErr) {
        clearAuth();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
