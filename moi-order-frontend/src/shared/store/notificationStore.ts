/**
 * Principle: SRP — owns client-side notification state only (unread count).
 * Principle: DIP — components never import this directly; they receive data from hooks.
 * The unread count is seeded from GET /notifications on screen open,
 * then incremented live by usePusherNotifications on each Pusher event.
 */
import { create } from 'zustand';

interface NotificationState {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  resetUnread: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,

  setUnreadCount: (count: number): void => {
    set({ unreadCount: count });
  },

  incrementUnread: (): void => {
    set((state) => ({ unreadCount: state.unreadCount + 1 }));
  },

  resetUnread: (): void => {
    set({ unreadCount: 0 });
  },
}));
