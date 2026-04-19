type SupportStatus = 'open' | 'pending' | 'closed';

type ChatAttachment = {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'file' | 'audio';
  size?: string;
  duration?: number;
};

type SupportMessage = {
  id: string;
  author: string;
  avatarUrl: string;
  isAdmin: boolean;
  text: string;
  attachments?: ChatAttachment[];
  createdAt: Date;
};

type SupportTicket = {
  id: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  subject: string;
  status: SupportStatus;
  messages: SupportMessage[];
  createdAt: Date;
  updatedAt: Date;
};

import { useRef, useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type PendingAttachment = {
  id: string;
  type: 'image' | 'file' | 'audio';
  url: string;
  name: string;
  duration?: number;
};

const genId = () => Math.random().toString(36).slice(2, 10);

function formatDuration(secs: number) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ── AudioPlayer ──────────────────────────────────────────────────────────────

function AudioPlayer({ url, duration: initDur }: { url: string; duration?: number }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSec, setCurrentSec] = useState(0);
  const [totalSec, setTotalSec] = useState(initDur ?? 0);

  const bars = useMemo(
    () => Array.from({ length: 28 }, () => 0.25 + Math.random() * 0.75),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [url]
  );

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) a.pause();
    else a.play().catch(() => {});
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{ bgcolor: 'background.neutral', borderRadius: 2, px: 1.5, py: 0.75, minWidth: 220, maxWidth: 280 }}
    >
      <audio
        ref={audioRef}
        src={url}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setProgress(0); setCurrentSec(0); }}
        onTimeUpdate={() => {
          const a = audioRef.current;
          if (a) {
            setCurrentSec(a.currentTime);
            setProgress(a.duration ? a.currentTime / a.duration : 0);
          }
        }}
        onLoadedMetadata={() => {
          const a = audioRef.current;
          // Chrome reports NaN/Infinity for recorded WebM blobs — ignore those
          if (a && isFinite(a.duration) && !isNaN(a.duration)) setTotalSec(a.duration);
        }}
      />
      <IconButton size="small" onClick={toggle} sx={{ flexShrink: 0, p: 0.5 }}>
        <Iconify icon={playing ? 'solar:pause-bold' : 'solar:play-bold'} width={18} />
      </IconButton>
      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: '2px', height: 30, flexGrow: 1, cursor: 'pointer' }}
        onClick={(e) => {
          const a = audioRef.current;
          if (!a || !a.duration || !isFinite(a.duration)) return;
          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          a.currentTime = ((e.clientX - rect.left) / rect.width) * a.duration;
        }}
      >
        {bars.map((h, i) => (
          <Box
            key={i}
            sx={{
              width: 3,
              height: `${Math.round(h * 100)}%`,
              borderRadius: '2px',
              bgcolor: (i / bars.length) < progress ? 'primary.main' : 'text.disabled',
              opacity: (i / bars.length) < progress ? 1 : 0.4,
              flexShrink: 0,
            }}
          />
        ))}
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ flexShrink: 0, fontVariantNumeric: 'tabular-nums', minWidth: 30 }}
      >
        {formatDuration(
          (currentSec > 0 || playing)
            ? currentSec
            : (isNaN(totalSec) || !isFinite(totalSec) ? (initDur ?? 0) : totalSec)
        )}
      </Typography>
    </Stack>
  );
}

// ── ImageLightbox ────────────────────────────────────────────────────────────

function ImageLightbox({
  images,
  startIndex,
  onClose,
}: {
  images: { url: string; name: string }[];
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);
  const img = images[current];

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = img.url;
    a.download = img.name || 'image';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c - 1 + images.length) % images.length);
  };

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c + 1) % images.length);
  };

  return (
    <Dialog
      open
      fullScreen
      onClose={onClose}
      PaperProps={{ sx: { bgcolor: 'rgba(0,0,0,0.93)', backgroundImage: 'none', boxShadow: 'none' } }}
    >
      {/* Clicking the dark background closes the lightbox */}
      <Box
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'zoom-out' }}
        onClick={onClose}
      >
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2, py: 1, flexShrink: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Typography noWrap variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', maxWidth: '55%' }}>
            {img.name}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {images.length > 1 && (
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', mr: 1 }}>
                {current + 1} / {images.length}
              </Typography>
            )}
            <Tooltip title="Download">
              <IconButton onClick={handleDownload} sx={{ color: 'white' }}>
                <Iconify icon="solar:download-bold" width={20} />
              </IconButton>
            </Tooltip>
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <Iconify icon="mingcute:close-line" width={20} />
            </IconButton>
          </Stack>
        </Stack>

        {/* Image */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            px: images.length > 1 ? 9 : 2,
          }}
        >
          {images.length > 1 && (
            <IconButton
              onClick={goPrev}
              sx={{
                position: 'absolute', left: 16, color: 'white',
                bgcolor: 'rgba(255,255,255,0.12)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' },
              }}
            >
              <Iconify icon="eva:arrow-ios-forward-fill" width={24} sx={{ transform: 'rotate(180deg)' }} />
            </IconButton>
          )}

          <img
            src={img.url}
            alt={img.name}
            style={{
              maxWidth: '100%',
              maxHeight: 'calc(100vh - 130px)',
              objectFit: 'contain',
              cursor: 'default',
              borderRadius: 8,
            }}
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <IconButton
              onClick={goNext}
              sx={{
                position: 'absolute', right: 16, color: 'white',
                bgcolor: 'rgba(255,255,255,0.12)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' },
              }}
            >
              <Iconify icon="eva:arrow-ios-forward-fill" width={24} />
            </IconButton>
          )}
        </Box>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <Stack
            direction="row"
            justifyContent="center"
            spacing={0.75}
            sx={{ pb: 2, flexShrink: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((im, i) => (
              <Box
                key={i}
                onClick={() => setCurrent(i)}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '2px solid',
                  borderColor: i === current ? 'primary.main' : 'transparent',
                  opacity: i === current ? 1 : 0.5,
                  transition: 'opacity 0.15s, border-color 0.15s',
                  '&:hover': { opacity: 1 },
                }}
              >
                <img src={im.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Dialog>
  );
}

// ── Mock data ────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<SupportStatus, 'warning' | 'info' | 'success'> = {
  open: 'warning',
  pending: 'info',
  closed: 'success',
};

const MOCK_TICKETS: SupportTicket[] = [
  {
    id: 'st-1',
    userName: 'Aung Ko',
    userEmail: 'aungko@gmail.com',
    userAvatar: '/assets/images/avatar/avatar-1.webp',
    subject: 'Cannot complete booking for Kuang Si Falls',
    status: 'open',
    createdAt: new Date(Date.now() - 3600000 * 2),
    updatedAt: new Date(Date.now() - 3600000),
    messages: [
      { id: 'm1', author: 'Aung Ko', avatarUrl: '/assets/images/avatar/avatar-1.webp', isAdmin: false, text: 'Hello, I am trying to book the Kuang Si Falls Day Trip but the payment keeps failing. I have tried 3 times already. Please help!', createdAt: new Date(Date.now() - 3600000 * 2) },
      { id: 'm2', author: 'Admin User', avatarUrl: '/assets/images/avatar/avatar-25.webp', isAdmin: true, text: 'Hello Aung Ko! Sorry to hear that. Could you let me know which payment method you are using (card or mobile wallet)?', createdAt: new Date(Date.now() - 3600000) },
      { id: 'm3', author: 'Aung Ko', avatarUrl: '/assets/images/avatar/avatar-1.webp', isAdmin: false, text: 'I am using KBZ Pay. It shows "Transaction declined" each time.', createdAt: new Date(Date.now() - 3600000 + 600000) },
    ],
  },
  {
    id: 'st-2',
    userName: 'Maria Chen',
    userEmail: 'maria.chen@outlook.com',
    userAvatar: '/assets/images/avatar/avatar-2.webp',
    subject: '90-Day Report — status update request',
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 3600000 * 5),
    messages: [
      { id: 'm1', author: 'Maria Chen', avatarUrl: '/assets/images/avatar/avatar-2.webp', isAdmin: false, text: 'Hi, I submitted my 90-Day Report application 4 days ago. The status is still Pending. When can I expect it to be processed?', createdAt: new Date(Date.now() - 86400000) },
      { id: 'm2', author: 'Admin User', avatarUrl: '/assets/images/avatar/avatar-25.webp', isAdmin: true, text: 'Hi Maria! We are currently processing your application. The embassy office has a 5–7 day processing time. We will notify you once it is ready. Thank you for your patience!', createdAt: new Date(Date.now() - 3600000 * 5) },
    ],
  },
  {
    id: 'st-3',
    userName: 'David Lee',
    userEmail: 'davidlee@yahoo.com',
    userAvatar: '/assets/images/avatar/avatar-3.webp',
    subject: 'Refund request for cancelled tour',
    status: 'open',
    createdAt: new Date(Date.now() - 86400000 * 2),
    updatedAt: new Date(Date.now() - 86400000 * 2),
    messages: [
      { id: 'm1', author: 'David Lee', avatarUrl: '/assets/images/avatar/avatar-3.webp', isAdmin: false, text: 'I had to cancel my Patuxai Monument Tour due to a flight delay. Booking ref: B-1003. I paid 3000 THB and would like a full refund.', createdAt: new Date(Date.now() - 86400000 * 2) },
    ],
  },
  {
    id: 'st-4',
    userName: 'Sarah Kim',
    userEmail: 'sarah.kim@gmail.com',
    userAvatar: '/assets/images/avatar/avatar-4.webp',
    subject: 'How to add multiple travellers?',
    status: 'closed',
    createdAt: new Date(Date.now() - 86400000 * 3),
    updatedAt: new Date(Date.now() - 86400000 * 2),
    messages: [
      { id: 'm1', author: 'Sarah Kim', avatarUrl: '/assets/images/avatar/avatar-4.webp', isAdmin: false, text: 'Can I book for 3 people at once? I do not see an option to add more travellers in the booking form.', createdAt: new Date(Date.now() - 86400000 * 3) },
      { id: 'm2', author: 'Admin User', avatarUrl: '/assets/images/avatar/avatar-25.webp', isAdmin: true, text: 'Hi Sarah! Yes, you can add multiple travellers by selecting the quantity on the ticket selection page. Tap the "+" next to the ticket type. Let me know if you need more help!', createdAt: new Date(Date.now() - 86400000 * 2 - 3600000) },
      { id: 'm3', author: 'Sarah Kim', avatarUrl: '/assets/images/avatar/avatar-4.webp', isAdmin: false, text: 'Found it! Thank you so much!', createdAt: new Date(Date.now() - 86400000 * 2) },
    ],
  },
  {
    id: 'st-5',
    userName: 'Thida Win',
    userEmail: 'thidawin@gmail.com',
    userAvatar: '/assets/images/avatar/avatar-5.webp',
    subject: 'Login issue with LINE account',
    status: 'open',
    createdAt: new Date(Date.now() - 3600000 * 8),
    updatedAt: new Date(Date.now() - 3600000 * 8),
    messages: [
      { id: 'm1', author: 'Thida Win', avatarUrl: '/assets/images/avatar/avatar-5.webp', isAdmin: false, text: 'I cannot log in with my LINE account. It says "Authentication failed" every time I try. I am using the latest version of the app.', createdAt: new Date(Date.now() - 3600000 * 8) },
    ],
  },
  {
    id: 'st-6',
    userName: 'John Tan',
    userEmail: 'johntan88@gmail.com',
    userAvatar: '/assets/images/avatar/avatar-6.webp',
    subject: 'Wrong amount charged for Baiyoke Dining',
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000 * 4),
    updatedAt: new Date(Date.now() - 86400000 * 3),
    messages: [
      { id: 'm1', author: 'John Tan', avatarUrl: '/assets/images/avatar/avatar-6.webp', isAdmin: false, text: 'I booked the Baiyoke Sky Lunch Buffet (Adult) which should be 390 THB but I was charged 690 THB (Dinner price). Transaction: TXN-100005.', createdAt: new Date(Date.now() - 86400000 * 4) },
      { id: 'm2', author: 'Admin User', avatarUrl: '/assets/images/avatar/avatar-25.webp', isAdmin: true, text: 'Hi John! Thank you for flagging this. I am reviewing your transaction now. Could you send a screenshot of your booking confirmation?', createdAt: new Date(Date.now() - 86400000 * 3) },
    ],
  },
];

const TABS: { label: string; value: 'all' | SupportStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Pending', value: 'pending' },
  { label: 'Closed', value: 'closed' },
];

// Pick a MIME type this browser can actually record
function getSupportedMimeType() {
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];
  return candidates.find((t) => MediaRecorder.isTypeSupported(t)) ?? '';
}

// ── TicketRow ────────────────────────────────────────────────────────────────

type TicketRowProps = {
  ticket: SupportTicket;
  isSelected: boolean;
  onSelect: () => void;
  onMarkRead: (id: string) => void;
  onCloseTicket: (id: string) => void;
  onDelete: (id: string) => void;
};

function TicketRow({ ticket, isSelected, onSelect, onMarkRead, onCloseTicket, onDelete }: TicketRowProps) {
  const [swipeX, setSwipeX] = useState(0);
  const [actionOpen, setActionOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isHorizSwipe = useRef(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasLongPress = useRef(false);
  const rowRef = useRef<HTMLDivElement | null>(null);

  const ACTION_W = 192;

  const resetSwipe = useCallback(() => {
    setSwipeX(0);
    setActionOpen(false);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizSwipe.current = false;
    wasLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      wasLongPress.current = true;
      setPreviewOpen(true);
    }, 500);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (!isHorizSwipe.current && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
      isHorizSwipe.current = true;
    }
    if (!isHorizSwipe.current) return;
    const base = actionOpen ? -ACTION_W : 0;
    setSwipeX(Math.min(0, Math.max(base + dx, -ACTION_W)));
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
    if (!isHorizSwipe.current) return;
    if (swipeX < -(ACTION_W * 0.4)) {
      setSwipeX(-ACTION_W);
      setActionOpen(true);
    } else {
      resetSwipe();
    }
  };

  const handleMouseDown = () => {
    wasLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      wasLongPress.current = true;
      setPreviewOpen(true);
    }, 600);
  };

  const clearLongPress = () => {
    if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
  };

  const handleClick = () => {
    if (wasLongPress.current) { wasLongPress.current = false; return; }
    if (actionOpen) { resetSwipe(); return; }
    onSelect();
  };

  const lastMsg = ticket.messages[ticket.messages.length - 1];
  const lastPreview = lastMsg
    ? `${lastMsg.isAdmin ? 'You: ' : ''}${lastMsg.text || (lastMsg.attachments?.length ? '[attachment]' : '')}`
    : 'No messages yet';

  const swipeActions = [
    { label: 'Mark Read', icon: 'eva:done-all-fill' as const, bgcolor: 'info.main', action: () => { onMarkRead(ticket.id); resetSwipe(); } },
    { label: 'Close', icon: 'solar:check-circle-bold' as const, bgcolor: 'success.main', action: () => { onCloseTicket(ticket.id); resetSwipe(); } },
    { label: 'Delete', icon: 'solar:trash-bin-trash-bold' as const, bgcolor: 'error.main', action: () => { onDelete(ticket.id); resetSwipe(); } },
  ];

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid', borderColor: 'divider' }}>
      {/* Action buttons revealed on swipe-left */}
      <Stack direction="row" sx={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: ACTION_W, zIndex: 0 }}>
        {swipeActions.map((btn) => (
          <Box
            key={btn.label}
            onClick={(e) => { e.stopPropagation(); btn.action(); }}
            sx={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', bgcolor: btn.bgcolor, cursor: 'pointer', gap: 0.25,
              userSelect: 'none', '&:active': { filter: 'brightness(0.88)' },
            }}
          >
            <Iconify icon={btn.icon} width={20} sx={{ color: 'white' }} />
            <Typography variant="caption" sx={{ color: 'white', fontSize: 10 }}>{btn.label}</Typography>
          </Box>
        ))}
      </Stack>

      {/* Swipeable ticket content */}
      <Box
        ref={rowRef}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={clearLongPress}
        onMouseLeave={clearLongPress}
        sx={{
          position: 'relative', zIndex: 1, px: 2, py: 1.5, cursor: 'pointer',
          transform: `translateX(${swipeX}px)`,
          transition: (swipeX === 0 || swipeX === -ACTION_W) ? 'transform 0.22s ease' : 'none',
          bgcolor: isSelected ? 'primary.lighter' : 'background.paper',
          borderLeft: '3px solid',
          borderLeftColor: isSelected ? 'primary.main' : 'transparent',
          '&:hover': { bgcolor: isSelected ? 'primary.lighter' : 'action.hover' },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Avatar src={ticket.userAvatar} sx={{ width: 38, height: 38, flexShrink: 0, mt: 0.25 }} />
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.25 }}>
              <Typography variant="body2" fontWeight={600} noWrap sx={{ flex: 1, minWidth: 0, mr: 0.5 }}>
                {ticket.userName}
              </Typography>
              <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
                {fDate(ticket.updatedAt)}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.25 }}>
              <Label color={STATUS_COLORS[ticket.status]} sx={{ fontSize: 10, py: 0, flexShrink: 0 }}>
                {ticket.status}
              </Label>
              <Typography variant="caption" fontWeight={500} color="text.primary" noWrap sx={{ flex: 1, minWidth: 0 }}>
                {ticket.subject}
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary" noWrap>
              {lastPreview}
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Long-press / hold conversation preview */}
      <Popover
        open={previewOpen}
        anchorEl={rowRef.current}
        onClose={() => setPreviewOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        PaperProps={{ sx: { width: 300, borderRadius: 2, overflow: 'hidden', boxShadow: 8 } }}
        disableRestoreFocus
      >
        <Box sx={{ p: 1.5, bgcolor: 'background.neutral', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar src={ticket.userAvatar} sx={{ width: 28, height: 28 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="caption" fontWeight={700} noWrap sx={{ display: 'block' }}>{ticket.userName}</Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>{ticket.subject}</Typography>
            </Box>
            <Label color={STATUS_COLORS[ticket.status]} sx={{ fontSize: 10, flexShrink: 0 }}>{ticket.status}</Label>
          </Stack>
        </Box>
        <Stack spacing={1} sx={{ p: 1.5, maxHeight: 260, overflowY: 'auto' }}>
          {ticket.messages.slice(-4).map((msg) => (
            <Stack key={msg.id} direction={msg.isAdmin ? 'row-reverse' : 'row'} spacing={0.75} alignItems="flex-end">
              <Avatar src={msg.avatarUrl} sx={{ width: 22, height: 22, flexShrink: 0 }} />
              <Box
                sx={{
                  maxWidth: '80%', borderRadius: 1.5, px: 1.25, py: 0.75,
                  bgcolor: msg.isAdmin ? 'primary.lighter' : 'background.neutral',
                }}
              >
                <Typography variant="caption" sx={{ lineHeight: 1.4, display: 'block' }}>
                  {msg.text || (msg.attachments?.length ? '[attachment]' : '—')}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Popover>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function SupportView() {
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS);
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_TICKETS[0].id);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | SupportStatus>('all');
  const [messageText, setMessageText] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<PendingAttachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<{ url: string; name: string }[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingSecondsRef = useRef(0);
  const streamRef = useRef<MediaStream | null>(null);
  const mimeTypeRef = useRef('');
  // stopAndSendRef: after recording stops, immediately send
  const stopAndSendRef = useRef(false);
  // sendMessageRef always points to the latest sendMessage (avoids stale closure in setTimeout)
  const sendMessageRef = useRef<() => void>(() => {});

  const selected = tickets.find((t) => t.id === selectedId) ?? null;

  const filteredTickets = tickets.filter((t) => {
    const matchName =
      t.userName.toLowerCase().includes(filterName.toLowerCase()) ||
      t.subject.toLowerCase().includes(filterName.toLowerCase());
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchName && matchStatus;
  });

  const openLightbox = (imgs: { url: string; name: string }[], idx: number) => {
    setLightboxImages(imgs);
    setLightboxIndex(idx);
  };

  const sendMessage = () => {
    const canSend = messageText.trim().length > 0 || pendingAttachments.length > 0;
    if (!canSend || !selectedId) return;

    const attachments: ChatAttachment[] = pendingAttachments.map((pa) => ({
      id: pa.id, name: pa.name, url: pa.url, type: pa.type, duration: pa.duration,
    }));

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== selectedId) return t;
        return {
          ...t,
          updatedAt: new Date(),
          messages: [
            ...t.messages,
            {
              id: genId(),
              author: 'Admin User',
              avatarUrl: '/assets/images/avatar/avatar-25.webp',
              isAdmin: true,
              text: messageText,
              attachments: attachments.length > 0 ? attachments : undefined,
              createdAt: new Date(),
            },
          ],
        };
      })
    );
    setMessageText('');
    setPendingAttachments([]);
  };

  // Keep the ref always pointing to the latest sendMessage closure
  sendMessageRef.current = sendMessage;

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = getSupportedMimeType();
      mimeTypeRef.current = mimeType;

      const mrOptions = mimeType ? { mimeType } : undefined;
      const mr = new MediaRecorder(stream, mrOptions);
      chunksRef.current = [];
      recordingSecondsRef.current = 0;

      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeTypeRef.current || 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        const newId = genId();
        // Capture duration BEFORE resetting the ref
        const duration = recordingSecondsRef.current;

        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRecording(false);
        setRecordingSeconds(0);
        recordingSecondsRef.current = 0;

        setPendingAttachments((prev) => [
          ...prev,
          { id: newId, type: 'audio', url: audioUrl, name: `voice-${newId}.webm`, duration },
        ]);

        if (stopAndSendRef.current) {
          stopAndSendRef.current = false;
          // Wait for state to flush, then call the latest sendMessage
          setTimeout(() => sendMessageRef.current(), 0);
        }
      };

      // Timeslice: deliver data every 250 ms so recording isn't lost on short clips
      mr.start(250);
      mediaRecorderRef.current = mr;
      setIsRecording(true);
      timerRef.current = setInterval(() => {
        recordingSecondsRef.current += 1;
        setRecordingSeconds(recordingSecondsRef.current);
      }, 1000);
    } catch {
      // microphone permission denied or unavailable
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const stopAndSend = useCallback(() => {
    stopAndSendRef.current = true;
    stopRecording();
  }, [stopRecording]);

  const cancelRecording = useCallback(() => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== 'inactive') {
      mr.ondataavailable = null;
      mr.onstop = null;
      mr.stop();
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    stopAndSendRef.current = false;
    setIsRecording(false);
    setRecordingSeconds(0);
    recordingSecondsRef.current = 0;
  }, []);

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setPendingAttachments((prev) => [
      ...prev,
      ...files.map((f) => ({ id: genId(), type: 'file' as const, url: URL.createObjectURL(f), name: f.name })),
    ]);
    e.target.value = '';
  };

  const handleImageAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setPendingAttachments((prev) => [
      ...prev,
      ...files.map((f) => ({ id: genId(), type: 'image' as const, url: URL.createObjectURL(f), name: f.name })),
    ]);
    e.target.value = '';
  };

  const removePendingAttachment = (id: string) => {
    setPendingAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const setTicketStatus = (id: string, status: SupportStatus) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const handleMarkRead = useCallback((id: string) => {
    // In real app: mark as read via API — for mock, no visible change needed
    setTickets((prev) => [...prev]);
    void id;
  }, []);

  const handleCloseTicket = useCallback((id: string) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'closed' as SupportStatus } : t)));
  }, []);

  const handleDeleteTicket = useCallback((id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const canSend = messageText.trim().length > 0 || pendingAttachments.length > 0;

  return (
    <DashboardContent>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Support</Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and reply to user queries
        </Typography>
      </Box>

      <Card sx={{ display: 'flex', height: { xs: 'calc(100vh - 190px)', md: 700 }, overflow: 'hidden' }}>
        {/* ── Left Panel: Ticket List ── */}
        <Box
          sx={{
            width: { xs: '100%', md: 360 },
            flexShrink: 0,
            overflow: 'hidden',
            borderRight: { md: '1px solid' },
            borderColor: 'divider',
            display: { xs: mobileView === 'list' ? 'flex' : 'none', md: 'flex' },
            flexDirection: 'column',
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <OutlinedInput
              fullWidth
              size="small"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Search tickets..."
              startAdornment={
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" width={16} />
                </InputAdornment>
              }
            />
          </Box>

          <Stack direction="row" sx={{ px: 1.5, pt: 1, pb: 0.5, gap: 0.5 }}>
            {TABS.map((tab) => (
              <Box
                key={tab.value}
                onClick={() => setFilterStatus(tab.value)}
                sx={{
                  px: 1.5, py: 0.5, borderRadius: 1, cursor: 'pointer', fontSize: 12, fontWeight: 500,
                  bgcolor: filterStatus === tab.value ? 'primary.main' : 'transparent',
                  color: filterStatus === tab.value ? 'white' : 'text.secondary',
                  '&:hover': { bgcolor: filterStatus === tab.value ? 'primary.main' : 'action.hover' },
                }}
              >
                {tab.label}
                {tab.value !== 'all' && (
                  <Box component="span" sx={{ ml: 0.5, opacity: 0.7 }}>
                    ({tickets.filter((t) => t.status === tab.value).length})
                  </Box>
                )}
              </Box>
            ))}
          </Stack>

          <Scrollbar sx={{ flexGrow: 1 }}>
            {filteredTickets.length === 0 && (
              <Box sx={{ py: 6, textAlign: 'center', color: 'text.disabled' }}>
                <Typography variant="body2">No tickets found</Typography>
              </Box>
            )}
            {filteredTickets.map((ticket) => (
              <TicketRow
                key={ticket.id}
                ticket={ticket}
                isSelected={ticket.id === selectedId}
                onSelect={() => { setSelectedId(ticket.id); setMobileView('chat'); }}
                onMarkRead={handleMarkRead}
                onCloseTicket={handleCloseTicket}
                onDelete={handleDeleteTicket}
              />
            ))}
          </Scrollbar>
        </Box>

        {/* ── Right Panel: Chat ── */}
        {selected ? (
          <Box sx={{ flexGrow: 1, display: { xs: mobileView === 'chat' ? 'flex' : 'none', md: 'flex' }, flexDirection: 'column', overflow: 'hidden' }}>
            <CardHeader
              avatar={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconButton
                    size="small"
                    onClick={() => setMobileView('list')}
                    sx={{ display: { md: 'none' }, mr: -0.5 }}
                  >
                    <Iconify icon="eva:arrow-ios-forward-fill" width={20} sx={{ transform: 'rotate(180deg)' }} />
                  </IconButton>
                  <Avatar src={selected.userAvatar} sx={{ width: 42, height: 42 }} />
                </Stack>
              }
              title={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle2">{selected.userName}</Typography>
                  <Label color={STATUS_COLORS[selected.status]} sx={{ fontSize: 11 }}>
                    {selected.status}
                  </Label>
                </Stack>
              }
              subheader={
                <Typography variant="caption" color="text.secondary">
                  {selected.userEmail} · {selected.subject}
                </Typography>
              }
              action={
                selected.status === 'closed' ? (
                  <Button
                    size="small"
                    variant="outlined"
                    color="warning"
                    startIcon={<Iconify icon="solar:restart-bold" width={14} />}
                    onClick={() => setTicketStatus(selected.id, 'open')}
                  >
                    Reopen
                  </Button>
                ) : (
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    startIcon={<Iconify icon="solar:check-circle-bold" width={14} />}
                    onClick={() => setTicketStatus(selected.id, 'closed')}
                  >
                    Close Ticket
                  </Button>
                )
              }
              sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
            />

            {/* Messages */}
            <Scrollbar sx={{ flexGrow: 1, p: { xs: 1.5, md: 2.5 } }}>
              <Stack spacing={2.5}>
                {selected.messages.map((msg) => {
                  const imgAtts = msg.attachments?.filter((a) => a.type === 'image') ?? [];
                  const fileAtts = msg.attachments?.filter((a) => a.type === 'file') ?? [];
                  const audioAtts = msg.attachments?.filter((a) => a.type === 'audio') ?? [];
                  const imgList = imgAtts.map((a) => ({ url: a.url, name: a.name }));
                  return (
                    <Stack
                      key={msg.id}
                      direction={msg.isAdmin ? 'row-reverse' : 'row'}
                      spacing={1.5}
                      alignItems="flex-start"
                    >
                      <Avatar src={msg.avatarUrl} sx={{ width: 36, height: 36, flexShrink: 0 }} />
                      <Box sx={{ maxWidth: { xs: '85%', md: '70%' } }}>
                        <Stack
                          direction={msg.isAdmin ? 'row-reverse' : 'row'}
                          spacing={1}
                          alignItems="center"
                          sx={{ mb: 0.5 }}
                        >
                          <Typography variant="caption" fontWeight={600}>{msg.author}</Typography>
                          {msg.isAdmin && (
                            <Label color="primary" variant="soft" sx={{ fontSize: 10 }}>Admin</Label>
                          )}
                          <Typography variant="caption" color="text.disabled">{fDate(msg.createdAt)}</Typography>
                        </Stack>
                        <Box
                          sx={{
                            bgcolor: msg.isAdmin ? 'primary.lighter' : 'background.neutral',
                            borderRadius: 2,
                            px: 2,
                            py: 1.5,
                            borderTopRightRadius: msg.isAdmin ? 0 : 2,
                            borderTopLeftRadius: msg.isAdmin ? 2 : 0,
                          }}
                        >
                          {msg.text && <Typography variant="body2">{msg.text}</Typography>}
                          {(imgAtts.length > 0 || fileAtts.length > 0 || audioAtts.length > 0) && (
                            <Box sx={{ mt: msg.text ? 1 : 0 }}>
                              {imgAtts.length > 0 && (
                                <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mb: 0.5 }}>
                                  {imgAtts.map((att, imgIdx) => (
                                    <Box
                                      key={att.id}
                                      sx={{ width: 80, height: 80, borderRadius: 1, overflow: 'hidden', cursor: 'zoom-in', flexShrink: 0 }}
                                      onClick={() => openLightbox(imgList, imgIdx)}
                                    >
                                      <img
                                        src={att.url}
                                        alt={att.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                      />
                                    </Box>
                                  ))}
                                </Stack>
                              )}
                              {fileAtts.map((att) => (
                                <Chip
                                  key={att.id}
                                  size="small"
                                  label={att.name}
                                  variant="outlined"
                                  sx={{ mb: 0.5, mr: 0.5, cursor: 'pointer' }}
                                  onClick={() => {
                                    const a = document.createElement('a');
                                    a.href = att.url;
                                    a.download = att.name;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                  }}
                                />
                              ))}
                              {audioAtts.map((att) => (
                                <Box key={att.id} sx={{ mt: 0.5 }}>
                                  <AudioPlayer url={att.url} duration={att.duration} />
                                </Box>
                              ))}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Stack>
                  );
                })}
              </Stack>
            </Scrollbar>

            {/* ── Input Area ── */}
            <Divider />

            {selected.status === 'closed' && (
              <Box sx={{ px: 2, py: 1, bgcolor: 'warning.lighter', borderBottom: '1px solid', borderColor: 'warning.light' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Iconify icon="solar:clock-circle-outline" width={14} sx={{ color: 'warning.dark' }} />
                  <Typography variant="caption" color="warning.dark" fontWeight={600}>
                    Ticket closed — users cannot send new messages
                  </Typography>
                </Stack>
              </Box>
            )}

            {/* Pending attachments preview */}
            {pendingAttachments.length > 0 && (
              <Box sx={{ px: 2, pt: 1.5 }}>
                <Stack direction="row" flexWrap="wrap" gap={0.75} alignItems="center">
                  {pendingAttachments.map((att) => {
                    if (att.type === 'image') {
                      const pendingImgs = pendingAttachments
                        .filter((a) => a.type === 'image')
                        .map((a) => ({ url: a.url, name: a.name }));
                      const pendingIdx = pendingImgs.findIndex((a) => a.url === att.url);
                      return (
                        <Box key={att.id} sx={{ position: 'relative' }}>
                          <Box
                            sx={{ width: 60, height: 60, borderRadius: 1, overflow: 'hidden', cursor: 'zoom-in' }}
                            onClick={() => openLightbox(pendingImgs, pendingIdx)}
                          >
                            <img src={att.url} alt={att.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => removePendingAttachment(att.id)}
                            sx={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, bgcolor: 'error.main', color: 'white', p: 0, '&:hover': { bgcolor: 'error.dark' } }}
                          >
                            <Iconify icon="mingcute:close-line" width={12} />
                          </IconButton>
                        </Box>
                      );
                    }
                    if (att.type === 'audio') {
                      return (
                        <Box key={att.id} sx={{ position: 'relative' }}>
                          <AudioPlayer url={att.url} duration={att.duration} />
                          <IconButton
                            size="small"
                            onClick={() => removePendingAttachment(att.id)}
                            sx={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, bgcolor: 'error.main', color: 'white', p: 0, '&:hover': { bgcolor: 'error.dark' } }}
                          >
                            <Iconify icon="mingcute:close-line" width={12} />
                          </IconButton>
                        </Box>
                      );
                    }
                    return (
                      <Chip
                        key={att.id}
                        size="small"
                        label={att.name}
                        variant="outlined"
                        onDelete={() => removePendingAttachment(att.id)}
                      />
                    );
                  })}
                </Stack>
              </Box>
            )}

            <Box sx={{ p: 2, pt: pendingAttachments.length > 0 ? 1 : 2 }}>
              {isRecording ? (
                /* Recording UI */
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                  <Avatar src="/assets/images/avatar/avatar-25.webp" sx={{ width: 32, height: 32, flexShrink: 0 }} />
                  <Box
                    sx={{
                      width: 10, height: 10, borderRadius: '50%', bgcolor: 'error.main', flexShrink: 0,
                      animation: 'rec-pulse 1.2s ease-in-out infinite',
                      '@keyframes rec-pulse': {
                        '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                        '50%': { opacity: 0.35, transform: 'scale(0.8)' },
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    color="error.main"
                    fontWeight={600}
                    sx={{ flexGrow: 1, fontVariantNumeric: 'tabular-nums' }}
                  >
                    {formatDuration(recordingSeconds)}
                  </Typography>
                  <Button size="small" variant="outlined" color="inherit" onClick={cancelRecording}>
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<Iconify icon="solar:stop-bold" width={14} />}
                    onClick={stopRecording}
                  >
                    Stop
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<Iconify icon="solar:share-bold" width={14} />}
                    onClick={stopAndSend}
                  >
                    Send
                  </Button>
                </Stack>
              ) : (
                /* Normal input */
                <Stack direction="row" spacing={1} alignItems="flex-end">
                  <Avatar src="/assets/images/avatar/avatar-25.webp" sx={{ width: 32, height: 32, flexShrink: 0 }} />
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    size="small"
                    placeholder={selected.status === 'closed' ? 'Admin reply (ticket closed for user)...' : 'Type your reply...'}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Stack direction="row" spacing={0.25} alignItems="center" sx={{ flexShrink: 0 }}>
                    <Tooltip title="Voice message">
                      <IconButton size="small" onClick={startRecording}>
                        <Iconify icon="solar:microphone-bold" width={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Send photo">
                      <IconButton size="small" component="label">
                        <Iconify icon="solar:gallery-bold" width={18} />
                        <input type="file" accept="image/*" multiple hidden onChange={handleImageAttach} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Attach file">
                      <IconButton size="small" component="label">
                        <Iconify icon="solar:file-bold" width={18} />
                        <input type="file" multiple hidden onChange={handleFileAttach} />
                      </IconButton>
                    </Tooltip>
                    <IconButton color="primary" onClick={sendMessage} disabled={!canSend}>
                      <Iconify icon="solar:share-bold" width={20} />
                    </IconButton>
                  </Stack>
                </Stack>
              )}
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: mobileView === 'chat' ? 'flex' : 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="solar:chat-round-dots-bold" width={56} sx={{ mb: 2, opacity: 0.3 }} />
            <Typography variant="body1">Select a ticket to view conversation</Typography>
          </Box>
        )}
      </Card>

      {lightboxImages.length > 0 && (
        <ImageLightbox
          images={lightboxImages}
          startIndex={lightboxIndex}
          onClose={() => setLightboxImages([])}
        />
      )}
    </DashboardContent>
  );
}
