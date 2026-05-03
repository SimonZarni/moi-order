import Pusher from 'pusher-js';
import { useState, useEffect } from 'react';

import { TOKEN_KEY } from 'src/api/client';

// ----------------------------------------------------------------------

/**
 * Subscribes to the presence-online-users Pusher channel and returns the
 * set of user IDs currently active in the mobile app.
 *
 * Returns:
 *   onlineIds  — Set<number> of currently online user IDs (real-time)
 *   ready      — true once the initial member list has loaded from Pusher
 */
export function usePresenceOnlineUsers(): { onlineIds: Set<number>; ready: boolean } {
  const [onlineIds, setOnlineIds] = useState<Set<number>>(new Set());
  const [ready, setReady]         = useState(false);

  useEffect(() => {
    const pusherKey     = (import.meta.env['VITE_PUSHER_KEY']     as string | undefined) ?? '';
    const pusherCluster = (import.meta.env['VITE_PUSHER_CLUSTER'] as string | undefined) ?? 'ap1';

    if (!pusherKey) return () => {};

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

    const channel = pusher.subscribe('presence-online-users');

    // Initial member snapshot — fires once after subscription succeeds.
    channel.bind('pusher:subscription_succeeded', (members: { each: (cb: (m: { id: string }) => void) => void }) => {
      const ids = new Set<number>();
      members.each((member) => {
        const id = parseInt(member.id, 10);
        if (!Number.isNaN(id)) ids.add(id);
      });
      setOnlineIds(ids);
      setReady(true);
    });

    channel.bind('pusher:member_added', (member: { id: string }) => {
      const id = parseInt(member.id, 10);
      if (Number.isNaN(id)) return;
      setOnlineIds((prev) => new Set([...prev, id]));
    });

    channel.bind('pusher:member_removed', (member: { id: string }) => {
      const id = parseInt(member.id, 10);
      if (Number.isNaN(id)) return;
      setOnlineIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe('presence-online-users');
      pusher.disconnect();
    };
  }, []);

  return { onlineIds, ready };
}
