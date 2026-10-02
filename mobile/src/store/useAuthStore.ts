import { create } from 'zustand';
import { User } from '../types';
import { api, syncOfflineQueue } from '../services/api';
import { StorageService } from '../services/storage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string, category?: string) => Promise<boolean>;
  demoLogin: () => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      const res = await api.post('/auth/login', { email: cleanEmail, password: cleanPassword });
      const payload = res.data || res;
      const user = payload.user || payload;
      const tokens = payload.tokens;

      if (tokens?.accessToken) {
        await StorageService.setTokens(tokens.accessToken, tokens.refreshToken);
      }
      await StorageService.setCachedUser(user);
      set({ user, isAuthenticated: true, isLoading: false });
      syncOfflineQueue().catch(console.error);
      return true;
    } catch (err: any) {
      const msg = typeof err === 'string' ? err : (err?.message || err?.error || 'Invalid email or password');
      set({ error: Array.isArray(msg) ? msg.join(', ') : msg, isLoading: false });
      return false;
    }
  },

  register: async (name, email, password, goalCategory) => {
    set({ isLoading: true, error: null });
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      const res = await api.post('/auth/register', {
        name: name.trim(),
        email: cleanEmail,
        password: cleanPassword,
        goalCategory,
      });
      const payload = res.data || res;
      const user = payload.user || payload;
      const tokens = payload.tokens;

      if (tokens?.accessToken) {
        await StorageService.setTokens(tokens.accessToken, tokens.refreshToken);
      }
      await StorageService.setCachedUser(user);
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err: any) {
      const msg = typeof err === 'string' ? err : (err?.message || err?.error || 'Registration failed');
      set({ error: Array.isArray(msg) ? msg.join(', ') : msg, isLoading: false });
      return false;
    }
  },

  demoLogin: async () => {
    set({ isLoading: true, error: null });
    const demoEmail = 'alex@winterarc.com';
    const demoPassword = 'Password123!';

    // Try login first
    let success = await get().login(demoEmail, demoPassword);
    if (!success) {
      // If demo account doesn't exist yet, auto register!
      success = await get().register('Alex Mercer', demoEmail, demoPassword, 'CAREER');
    }
    return success;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore network errors on logout
    }
    await StorageService.clearTokens();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const cached = await StorageService.getCachedUser();
      const { accessToken } = await StorageService.getTokens();

      if (accessToken && cached) {
        set({ user: cached, isAuthenticated: true });
        // Refresh profile silently
        api.get('/users/me').then((res) => {
          const freshUser = res.data?.user || res.data || res;
          if (freshUser?.id) {
            StorageService.setCachedUser(freshUser);
            set({ user: freshUser });
          }
        }).catch(() => {});
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: async (data) => {
    try {
      const res = await api.patch('/users/me', data);
      const updated = res.data?.user || res.data || res;
      await StorageService.setCachedUser(updated);
      set({ user: updated });
    } catch (e: any) {
      const msg = typeof e === 'string' ? e : (e?.message || 'Update profile failed');
      set({ error: Array.isArray(msg) ? msg.join(', ') : msg });
    }
  },
}));
