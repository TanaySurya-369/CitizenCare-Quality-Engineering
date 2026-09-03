import { create } from 'zustand';
import { User, Role } from '../types';
import api from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  hasRole: (roles: Role[]) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: localStorage.getItem('citizencare_user')
    ? JSON.parse(localStorage.getItem('citizencare_user')!)
    : null,
  token: localStorage.getItem('citizencare_token'),
  isAuthenticated: !!localStorage.getItem('citizencare_token'),
  isLoading: false,

  login: (token: string, user: User) => {
    localStorage.setItem('citizencare_token', token);
    localStorage.setItem('citizencare_user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('citizencare_token');
    localStorage.removeItem('citizencare_user');
    set({ token: null, user: null, isAuthenticated: false });
  },

  fetchProfile: async () => {
    const token = get().token;
    if (!token) return;

    try {
      set({ isLoading: true });
      const response = await api.get('/auth/me');
      if (response.data.success && response.data.data.user) {
        const user = response.data.data.user;
        localStorage.setItem('citizencare_user', JSON.stringify(user));
        set({ user, isAuthenticated: true, isLoading: false });
      }
    } catch (err) {
      get().logout();
      set({ isLoading: false });
    }
  },

  hasRole: (roles: Role[]) => {
    const user = get().user;
    if (!user) return false;
    return roles.includes(user.role);
  },
}));
