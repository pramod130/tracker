import axios from 'axios';
import { StorageService } from './storage';

// In development, default to localhost NestJS API. Replace localhost with device IP if testing on physical phone.
const API_BASE_URL = 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  async (config) => {
    const { accessToken } = await StorageService.getTokens();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle token refresh automatically
api.interceptors.response.use(
  (response) => {
    // Standard response format unwrapping: response.data.data
    if (response.data && response.data.success !== undefined && response.data.data !== undefined) {
      return response.data;
    }
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { refreshToken } = await StorageService.getTokens();
        if (refreshToken) {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          const newTokens = res.data.data?.tokens || res.data.tokens;
          if (newTokens) {
            await StorageService.setTokens(newTokens.accessToken, newTokens.refreshToken);
            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            return axios(originalRequest);
          }
        }
      } catch (refreshErr) {
        await StorageService.clearTokens();
      }
    }

    return Promise.reject(error.response?.data || error.message);
  },
);

export const syncOfflineQueue = async () => {
  const queue = await StorageService.getOfflineQueue();
  if (queue.length === 0) return;

  console.log(`Syncing ${queue.length} offline actions with backend...`);
  for (const action of queue) {
    try {
      if (action.type === 'COMPLETE_TASK') {
        await api.post(`/tasks/${action.taskId}/complete`, action.payload);
      } else if (action.type === 'UNCOMPLETE_TASK') {
        await api.post(`/tasks/${action.taskId}/uncomplete`, action.payload);
      } else if (action.type === 'CREATE_TASK') {
        await api.post('/tasks', action.payload);
      }
    } catch (e) {
      console.warn(`Failed to sync offline action ${action.id}:`, e);
    }
  }

  await StorageService.clearOfflineQueue();
};
