import type { AdminNotification } from 'src/types';

import Pusher from 'pusher-js';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { TOKEN_KEY } from 'src/api/client';
import { notificationsApi } from 'src/api/notifications';

import { useAuth } from './auth-context';

// ----------------------------------------------------------------------

type NotificationsContextValue = {
  notifications: AdminNotification[];
  unreadCount: number;
  isLoading: boolean;
  markOneRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  deleteOne: (id: string) => Promise<void>;
  deleteAll: () => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function useNotifications(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationsProvider');
  return ctx;
}

// ----------------------------------------------------------------------

type Props = { children: React.ReactNode };

export function NotificationsProvider({ children }: Props) {
  const { admin } = useAuth();

  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!admin) return;
    try {
      const res = await notificationsApi.list();
      setNotifications(res.data);
      setUnreadCount(res.meta.unread_count);
    } catch {
      // silently ignore — badge stays at last known value
    }
  }, [admin]);

  // Initial fetch when admin logs in
  useEffect(() => {
    if (!admin) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    setIsLoading(true);
    fetchNotifications().finally(() => setIsLoading(false));
  }, [admin, fetchNotifications]);

  // Pusher real-time connection — mirrors the pattern used in the mobile app.
  // ShouldBroadcastNow on the backend guarantees the event fires synchronously
  // after DB::afterCommit(), so refetching here always sees the committed row.
  useEffect(() => {
    if (!admin) return () => {};

    const pusherKey = import.meta.env['VITE_PUSHER_KEY'] as string | undefined ?? '';
    const pusherCluster = import.meta.env['VITE_PUSHER_CLUSTER'] as string | undefined ?? 'ap1';

    // Derive the Laravel app origin from the API base URL.
    // e.g. "http://localhost:8000/api/admin/v1" → "http://localhost:8000"
    const appOrigin = new URL(import.meta.env['VITE_API_BASE_URL'] as string).origin;

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
      forceTLS: true,
      channelAuthorization: {
        customHandler: async ({ channelName, socketId }, callback) => {
          try {
            const token = localStorage.getItem(TOKEN_KEY);
            const res = await fetch(`${appOrigin}/broadcasting/auth`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify({ socket_id: socketId, channel_name: channelName }),
            });
            const data = await res.json() as { auth: string };
            callback(null, data);
          } catch {
            callback(new Error('Channel auth failed'), null);
          }
        },
      },
    });

    const channelName = `private-App.Models.User.${admin.id}`;
    const channel = pusher.subscribe(channelName);

    channel.bind('notification.created', () => {
      // Increment badge immediately for instant UX, then sync with server truth.
      setUnreadCount((prev) => prev + 1);
      fetchNotifications();
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && pusher.connection.state !== 'connected') {
        pusher.connect();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [admin, fetchNotifications]);

  const markOneRead = useCallback(async (id: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await notificationsApi.markOneRead(id);
    } catch {
      // Revert optimistic update on failure
      fetchNotifications();
    }
  }, [fetchNotifications]);

  const markAllRead = useCallback(async () => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);

    try {
      await notificationsApi.markAllRead();
    } catch {
      // Revert on failure
      fetchNotifications();
    }
  }, [fetchNotifications]);

  const deleteOne = useCallback(async (id: string) => {
    const removed = notifications.find((n) => n.id === id);

    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (removed && !removed.is_read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    try {
      await notificationsApi.deleteOne(id);
    } catch {
      fetchNotifications();
    }
  }, [fetchNotifications, notifications]);

  const deleteAll = useCallback(async () => {
    setNotifications([]);
    setUnreadCount(0);

    try {
      await notificationsApi.deleteAll();
    } catch {
      fetchNotifications();
    }
  }, [fetchNotifications]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        markOneRead,
        markAllRead,
        deleteOne,
        deleteAll,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
