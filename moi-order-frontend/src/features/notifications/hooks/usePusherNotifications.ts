/**
 * Principle: SRP — owns the Pusher connection lifecycle exclusively.
 * Mounted at the auth root (AppShell in App.tsx) — active for the entire session,
 * not tied to any single screen. Disconnects automatically on logout (userId → null).
 *
 * Security: channel auth uses the existing Axios client, which attaches the Bearer token.
 *   Never reads credentials directly; always goes through api/client.ts.
 */
import { useEffect } from 'react';
import { AppState } from 'react-native';
import Pusher from 'pusher-js';
import { useQueryClient } from '@tanstack/react-query';

import apiClient from '@/shared/api/client';
import { PUSHER_APP_KEY, PUSHER_APP_CLUSTER } from '@/shared/constants/config';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { useAuthStore } from '@/shared/store/authStore';
import { useNotificationStore } from '@/shared/store/notificationStore';

export function usePusherNotifications(): void {
  const userId      = useAuthStore((state) => state.user?.id ?? null);
  const queryClient = useQueryClient();
  const incrementUnread = useNotificationStore((state) => state.incrementUnread);

  useEffect(() => {
    if (userId === null) return;

    const pusher = new Pusher(PUSHER_APP_KEY, {
      cluster: PUSHER_APP_CLUSTER,
      forceTLS: true,
      channelAuthorization: {
        customHandler: async ({ channelName, socketId }, callback) => {
          try {
            const res = await apiClient.post<{ auth: string }>('/broadcasting/auth', {
              socket_id:    socketId,
              channel_name: channelName,
            });
            callback(null, res.data);
          } catch {
            callback(new Error('Channel auth failed'), null);
          }
        },
      },
    });

    const channelName = `private-App.Models.User.${userId}`;
    const channel     = pusher.subscribe(channelName);

    channel.bind('notification.created', () => {
      incrementUnread();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS.LIST });
    });

    // Reconnect when app returns to foreground after a background gap.
    const appStateSub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && pusher.connection.state !== 'connected') {
        pusher.connect();
      }
    });

    return () => {
      appStateSub.remove();
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [userId, queryClient, incrementUnread]);
}
