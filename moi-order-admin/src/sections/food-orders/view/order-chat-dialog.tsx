import Pusher from 'pusher-js';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { fDateTime } from 'src/utils/format-time';

import { orderChatApi, type OrderChatMessage } from 'src/api/orderChat';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const SENDER_LABEL: Record<OrderChatMessage['sender_type'], string> = {
  customer: 'Customer',
  merchant: 'Merchant',
  admin: 'Admin',
  system: 'System',
};

const SENDER_COLOR: Record<OrderChatMessage['sender_type'], string> = {
  customer: 'info.main',
  merchant: 'warning.main',
  admin: 'primary.main',
  system: 'text.disabled',
};

// ── Reply quote block (shown inside a bubble when reply_to_body is set) ────────

function ReplyQuote({ senderName, body }: { senderName: string; body: string }) {
  return (
    <Box
      sx={{
        borderLeft: '3px solid',
        borderColor: 'primary.main',
        borderRadius: 0.5,
        pl: 1,
        py: 0.5,
        mb: 0.75,
        bgcolor: 'primary.main',
        // Subtle tinted background that works on both light/dark surfaces
        opacity: 1,
        backgroundColor: 'rgba(16,185,129,0.10)',
      }}
    >
      <Typography variant="caption" fontWeight={700} color="primary.main" display="block" noWrap>
        {senderName}
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" noWrap>
        {body || '📷 Photo'}
      </Typography>
    </Box>
  );
}

// ── Reply bar above the text field ────────────────────────────────────────────

function ReplyBar({ replyingTo, onCancel }: { replyingTo: OrderChatMessage; onCancel: () => void }) {
  const preview = replyingTo.body ?? '📷 Photo';
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        px: 1.5,
        py: 0.75,
        bgcolor: 'rgba(16,185,129,0.06)',
        borderTop: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <Box
        sx={{
          width: 3,
          alignSelf: 'stretch',
          borderRadius: 1,
          bgcolor: 'primary.main',
          flexShrink: 0,
        }}
      />
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="caption" fontWeight={700} color="primary.main" noWrap display="block">
          Replying to {replyingTo.sender_name}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap display="block">
          {preview}
        </Typography>
      </Box>
      <IconButton size="small" onClick={onCancel} aria-label="Cancel reply">
        <Iconify icon="mingcute:close-line" width={16} />
      </IconButton>
    </Stack>
  );
}

// ── Chat dialog ───────────────────────────────────────────────────────────────

type OrderChatDialogProps = {
  open: boolean;
  orderId: string;
  onClose: () => void;
};

export function OrderChatDialog({ open, orderId, onClose }: OrderChatDialogProps) {
  const [messages, setMessages]     = useState<OrderChatMessage[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [draft, setDraft]           = useState('');
  const [sending, setSending]       = useState(false);
  const [replyingTo, setReplyingTo] = useState<OrderChatMessage | null>(null);

  // Scroll container ref — we set scrollTop directly (no smooth animation)
  // so it works reliably even while the MUI Dialog open-animation is running.
  const containerRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(() => {
    orderChatApi
      .list(orderId)
      .then(setMessages)
      .catch(() => setError('Failed to load chat messages.'))
      .finally(() => setLoading(false));
  }, [orderId]);

  // Initial load on open
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    setReplyingTo(null);
    loadMessages();
  }, [open, loadMessages]);

  // Real-time updates via Pusher private-order.{orderId}.
  useEffect(() => {
    if (!open || !orderId) return undefined;

    const pusherKey     = (import.meta.env['VITE_PUSHER_KEY']     as string | undefined) ?? '';
    const pusherCluster = (import.meta.env['VITE_PUSHER_CLUSTER'] as string | undefined) ?? 'ap1';

    if (!pusherKey) return undefined;

    const appOrigin = new URL(import.meta.env['VITE_API_BASE_URL'] as string).origin;

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
      forceTLS: true,
      channelAuthorization: {
        customHandler: async ({ channelName, socketId }, callback) => {
          try {
            const token = sessionStorage.getItem('admin_token') ?? '';
            const res = await fetch(`${appOrigin}/broadcasting/auth`, {
              method: 'POST',
              credentials: 'include',
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

    const channel = pusher.subscribe(`private-order.${orderId}`);
    channel.bind('chat.message-sent', (data: unknown) => {
      const msg = data as OrderChatMessage;
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    return () => {
      pusher.unsubscribe(`private-order.${orderId}`);
      pusher.disconnect();
    };
  }, [open, orderId]);

  // Scroll to bottom on every messages change.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    });
  }, [messages]);

  const handleReply = useCallback((msg: OrderChatMessage) => {
    setReplyingTo(msg);
  }, []);

  const handleCancelReply = useCallback(() => setReplyingTo(null), []);

  const handleSend = useCallback(() => {
    const body = draft.trim();
    if (!body) return;

    const replySnapshot = replyingTo;
    setReplyingTo(null);

    setSending(true);
    orderChatApi
      .send(orderId, body, replySnapshot?.id)
      .then((message) => {
        // Attach reply snapshot so the quote renders immediately (optimistic).
        const withReply: OrderChatMessage = replySnapshot != null
          ? {
              ...message,
              reply_to_id:          replySnapshot.id,
              reply_to_body:        replySnapshot.body,
              reply_to_sender_name: replySnapshot.sender_name,
            }
          : message;
        setMessages((prev) => {
          // Pusher may add the message first (without reply_to_* if backend
          // broadcastWith hasn't deployed yet) — merge to ensure quote renders.
          const idx = prev.findIndex((m) => m.id === withReply.id);
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx] = { ...prev[idx], ...withReply };
            return updated;
          }
          return [...prev, withReply];
        });
        setDraft('');
      })
      .catch(() => setError('Failed to send message. Please try again.'))
      .finally(() => setSending(false));
  }, [draft, orderId, replyingTo]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Iconify icon="solar:chat-round-dots-bold" width={22} />
        Order Chat
        <IconButton onClick={onClose} sx={{ ml: 'auto' }} aria-label="Close chat">
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minHeight: 540 }}>
        {error && <Alert severity="error">{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack
            ref={containerRef}
            spacing={1.5}
            sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 460 }}
          >
            {messages.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No messages yet.
              </Typography>
            )}

            {messages.map((message) =>
              message.sender_type === 'system' ? (
                <Typography
                  key={message.id}
                  variant="caption"
                  color="text.disabled"
                  sx={{ textAlign: 'center', fontStyle: 'italic' }}
                >
                  {message.body} · {fDateTime(message.created_at)}
                </Typography>
              ) : (
                <Stack
                  key={message.id}
                  direction="row"
                  spacing={1.5}
                  alignItems="flex-start"
                  sx={{
                    '&:hover .reply-btn': { opacity: 1 },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: 14,
                      flexShrink: 0,
                      bgcolor: SENDER_COLOR[message.sender_type],
                    }}
                  >
                    {message.sender_name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Stack direction="row" spacing={1} alignItems="baseline">
                      <Typography variant="subtitle2">{message.sender_name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {SENDER_LABEL[message.sender_type]} · {fDateTime(message.created_at)}
                      </Typography>
                    </Stack>

                    {/* Reply quote block */}
                    {message.reply_to_body != null && message.reply_to_sender_name != null && (
                      <ReplyQuote
                        senderName={message.reply_to_sender_name}
                        body={message.reply_to_body}
                      />
                    )}

                    {message.body && (
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {message.body}
                      </Typography>
                    )}
                    {message.image_url && (
                      <Box
                        component="img"
                        src={message.image_url}
                        alt="Chat attachment"
                        sx={{ mt: 1, maxWidth: 220, borderRadius: 1, display: 'block' }}
                      />
                    )}
                  </Box>

                  {/* Reply button — visible on row hover */}
                  <Tooltip title="Reply">
                    <IconButton
                      size="small"
                      className="reply-btn"
                      onClick={() => handleReply(message)}
                      aria-label={`Reply to ${message.sender_name}`}
                      sx={{ opacity: 0, transition: 'opacity 0.15s', flexShrink: 0, mt: 0.25 }}
                    >
                      <Iconify icon="eva:arrow-ios-forward-fill" width={16} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              )
            )}
          </Stack>
        )}

        {/* Reply bar + input */}
        <Stack spacing={1} sx={{ mt: 'auto' }}>
          {replyingTo !== null && (
            <ReplyBar replyingTo={replyingTo} onCancel={handleCancelReply} />
          )}
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              size="small"
              autoComplete="off"
              placeholder="Type a message…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={sending}
            />
            <Button
              variant="contained"
              onClick={handleSend}
              disabled={sending || !draft.trim()}
            >
              Send
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
