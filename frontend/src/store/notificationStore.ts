import { create } from 'zustand';
import { Notification } from '../types';
import api from '../services/api';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get('/notifications');
      if (response.data.success) {
        set({
          notifications: response.data.data.notifications,
          unreadCount: response.data.data.unreadCount,
          isLoading: false,
        });
      }
    } catch (err) {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      set((state) => {
        const updated = state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        );
        const unreadCount = updated.filter((n) => !n.isRead).length;
        return { notifications: updated, unreadCount };
      });
    } catch (err) {
      console.error('Failed to mark notification read', err);
    }
  },

  markAllAsRead: async () => {
    try {
      await api.patch('/notifications/read-all');
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  },
}));
