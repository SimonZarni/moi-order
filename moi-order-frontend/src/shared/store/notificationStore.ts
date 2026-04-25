/**
 * Principle: SRP — owns client-side notification state (unread count + current push token).
 * Principle: DIP — components never import this directly; they receive data from hooks.
 * The unread count is seeded from GET /notifications on screen open,
 * then incremented live by usePusherNotifications on each Pusher event.
 * pushToken is written by usePushNotifications after Expo token registration,
 * then read by logout handlers to unregister before clearing auth.
 */
import { create } from 'zustand';

interface NotificationState {
  unreadCount: number;
  pushToken: string | null;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  decrementUnread: () => void;
  resetUnread: () => void;
  setPushToken: (token: string | null) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  pushToken: null,

  setUnreadCount: (count: number): void => {
    set({ unreadCount: count });
  },

  incrementUnread: (): void => {
    set((state) => ({ unreadCount: state.unreadCount + 1 }));
  },

  decrementUnread: (): void => {
    set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) }));
  },

  resetUnread: (): void => {
    set({ unreadCount: 0 });
  },

  setPushToken: (token: string | null): void => {
    set({ pushToken: token });
  },
}));
