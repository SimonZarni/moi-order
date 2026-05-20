import type { IconButtonProps } from '@mui/material/IconButton';
import type { AdminNotification, AdminNotificationData } from 'src/types';

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { useWorkspace } from 'src/context/workspace-context';
import { useNotifications } from 'src/context/notifications-context';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { tbStore } from 'src/sections/tb/shared/tb-mock-store';

// TB alert computed from mock store data
type TbAlert = { id: string; title: string; body: string; level: 'error' | 'warning' | 'info'; timeAgo: string };

function computeTbAlerts(): TbAlert[] {
  const alerts: TbAlert[] = [];
  const now = Date.now();

  // Visa expiry alerts
  tbStore.individualClients.forEach((c) => {
    if (!c.visaExpiry) return;
    const days = Math.ceil((new Date(c.visaExpiry).getTime() - now) / 86_400_000);
    if (days < 0) {
      alerts.push({ id: `visa-${c.id}`, title: 'Visa Expired', body: `${c.name} — visa expired ${Math.abs(days)}d ago`, level: 'error', timeAgo: `${Math.abs(days)}d ago` });
    } else if (days <= 30) {
      alerts.push({ id: `visa-${c.id}`, title: 'Visa Expiring Soon', body: `${c.name} — expires in ${days} day${days === 1 ? '' : 's'}`, level: days <= 7 ? 'error' : 'warning', timeAgo: `in ${days}d` });
    }
  });

  // Pending document batches
  const pendingBatches = tbStore.documentBatches.filter((b) => b.status === 'pending');
  if (pendingBatches.length > 0) {
    alerts.push({ id: 'pending-docs', title: 'Documents Pending Review', body: `${pendingBatches.length} batch${pendingBatches.length > 1 ? 'es' : ''} awaiting approval`, level: 'warning', timeAgo: 'now' });
  }

  // Kanban cards with end date approaching (≤7 days)
  tbStore.kanbanCards.forEach((c) => {
    if (!c.endDate || c.macroStage === 'done') return;
    const days = Math.ceil((new Date(c.endDate).getTime() - now) / 86_400_000);
    if (days >= 0 && days <= 7) {
      alerts.push({ id: `deadline-${c.id}`, title: 'Case Deadline Approaching', body: `${c.companyName || c.clientName} — due in ${days}d`, level: days <= 2 ? 'error' : 'warning', timeAgo: `in ${days}d` });
    }
  });

  // Active todos that are overdue
  const overdueTodos = tbStore.todos.filter((t) => !t.done && t.dueDate && new Date(t.dueDate).getTime() < now);
  if (overdueTodos.length > 0) {
    alerts.push({ id: 'overdue-todos', title: 'Overdue Tasks', body: `${overdueTodos.length} task${overdueTodos.length > 1 ? 's' : ''} past due date`, level: 'warning', timeAgo: 'now' });
  }

  return alerts.slice(0, 10); // cap at 10
}

// ----------------------------------------------------------------------

function getNavigationPath(data: AdminNotificationData): string | null {
  switch (data.notification_type) {
    case 'new_submission':
      return data.submission_id ? `/services/submissions/${data.submission_id}` : null;
    case 'new_ticket_order':
      return data.ticket_order_id ? `/bookings/${data.ticket_order_id}` : null;
    case 'new_payment':
      if (data.submission_id) return `/services/submissions/${data.submission_id}`;
      if (data.ticket_order_id) return `/bookings/${data.ticket_order_id}`;
      return null;
    default:
      return null;
  }
}

// ----------------------------------------------------------------------

export type NotificationsPopoverProps = IconButtonProps;

export function NotificationsPopover({ sx, ...other }: NotificationsPopoverProps) {
  const { notifications, unreadCount, markOneRead, markAllRead, deleteOne, deleteAll } = useNotifications();
  const { activeWorkspace } = useWorkspace();
  const isTB = activeWorkspace === 'moi-order-trusted-brothers';
  const navigate = useNavigate();

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [tbAlerts, setTbAlerts] = useState<TbAlert[]>([]);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (isTB) setTbAlerts(computeTbAlerts());
    setOpenPopover(event.currentTarget);
  }, [isTB]);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    await markAllRead();
  }, [markAllRead]);

  const handleClearAll = useCallback(async () => {
    await deleteAll();
  }, [deleteAll]);

  const handleNotificationClick = useCallback(
    async (notification: AdminNotification) => {
      if (!notification.is_read) {
        await markOneRead(notification.id);
      }
      handleClosePopover();
      const path = getNavigationPath(notification.data);
      if (path) navigate(path);
    },
    [markOneRead, handleClosePopover, navigate]
  );

  const unread = notifications.filter((n) => !n.is_read);
  const read = notifications.filter((n) => n.is_read);

  return (
    <>
      <IconButton
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={sx}
        {...other}
      >
        <Badge badgeContent={isTB ? computeTbAlerts().filter(a => a.level === 'error').length || undefined : unreadCount} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { width: 380, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
          },
        }}
      >
        <Box sx={{ py: 2, pl: 2.5, pr: 1.5, display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">
              {isTB ? 'Trusted Brothers Alerts' : 'Notifications'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {isTB
                ? `${tbAlerts.length} active alert${tbAlerts.length !== 1 ? 's' : ''}`
                : unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                  : 'All caught up'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {!isTB && notifications.length > 0 && (
          <>
            <Box sx={{ px: 2, py: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Button size="small" color="inherit" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>Mark all read</Button>
                <Button size="small" color="error" onClick={handleClearAll}>Clear all</Button>
              </Stack>
            </Box>
            <Divider sx={{ borderStyle: 'dashed' }} />
          </>
        )}

        <Scrollbar fillContent sx={{ minHeight: 240, maxHeight: { xs: 360, sm: 'none' } }}>

          {/* ── Trusted Brothers alerts ── */}
          {isTB && (
            <>
              {tbAlerts.length === 0 && (
                <Box sx={{ py: 6, textAlign: 'center', color: 'text.disabled' }}>
                  <Iconify icon="solar:check-circle-bold" width={40} sx={{ mb: 1, opacity: 0.4 }} />
                  <Typography variant="body2">All clear — no active alerts</Typography>
                </Box>
              )}
              <List disablePadding>
                {tbAlerts.map((alert) => (
                  <ListItemButton key={alert.id} sx={{ py: 1.5, px: 2.5, mt: '1px' }}>
                    <ListItemAvatar>
                      <Avatar sx={{
                        bgcolor: alert.level === 'error' ? '#FEE2E2' : alert.level === 'warning' ? '#FEF3C7' : '#E0E7FF',
                      }}>
                        <Iconify
                          width={20}
                          icon={alert.level === 'error' ? 'solar:trash-bin-trash-bold' : alert.level === 'warning' ? 'solar:clock-circle-outline' : 'solar:bell-bing-bold-duotone'}
                          sx={{ color: alert.level === 'error' ? '#EF4444' : alert.level === 'warning' ? '#F59E0B' : '#6366F1' }}
                        />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2">
                          {alert.title}
                          <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                            &nbsp;{alert.body}
                          </Typography>
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" sx={{ mt: 0.5, gap: 0.5, display: 'flex', alignItems: 'center', color: 'text.disabled' }}>
                          <Iconify width={14} icon="solar:clock-circle-outline" />
                          {alert.timeAgo}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                ))}
              </List>
            </>
          )}

          {/* ── Moi Order notifications ── */}
          {!isTB && (
            <>
              {unread.length > 0 && (
                <List disablePadding subheader={<ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>New</ListSubheader>}>
                  {unread.map((n) => <NotificationItem key={n.id} notification={n} onClick={handleNotificationClick} onDelete={deleteOne} />)}
                </List>
              )}
              {read.length > 0 && (
                <List disablePadding subheader={<ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>{unread.length > 0 ? 'Earlier' : 'Read'}</ListSubheader>}>
                  {read.map((n) => <NotificationItem key={n.id} notification={n} onClick={handleNotificationClick} onDelete={deleteOne} />)}
                </List>
              )}
              {notifications.length === 0 && (
                <Box sx={{ py: 6, textAlign: 'center', color: 'text.disabled' }}>
                  <Iconify icon="solar:bell-bing-bold-duotone" width={40} sx={{ mb: 1, opacity: 0.4 }} />
                  <Typography variant="body2">No notifications</Typography>
                </Box>
              )}
            </>
          )}
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple color="inherit" onClick={handleClosePopover}>
            Close
          </Button>
        </Box>
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

type NotificationItemProps = {
  notification: AdminNotification;
  onClick: (notification: AdminNotification) => void;
  onDelete: (id: string) => void;
};

function NotificationItem({ notification, onClick, onDelete }: NotificationItemProps) {
  return (
    <ListItemButton
      onClick={() => onClick(notification)}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(!notification.is_read && { bgcolor: 'action.selected' }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>
          <NotificationIcon type={notification.type} />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="subtitle2">
            {notification.title}
            <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
              &nbsp;{notification.body}
            </Typography>
          </Typography>
        }
        secondary={
          <Typography
            variant="caption"
            sx={{ mt: 0.5, gap: 0.5, display: 'flex', alignItems: 'center', color: 'text.disabled' }}
          >
            <Iconify width={14} icon="solar:clock-circle-outline" />
            {notification.time_ago}
          </Typography>
        }
      />
      <Tooltip title="Delete notification">
        <IconButton
          edge="end"
          size="small"
          color="error"
          onClick={(event) => {
            event.stopPropagation();
            void onDelete(notification.id);
          }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" width={18} />
        </IconButton>
      </Tooltip>
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function NotificationIcon({ type }: { type: AdminNotification['type'] }) {
  if (type === 'new_submission') {
    return <Iconify icon="solar:check-circle-bold" width={20} sx={{ color: 'success.main' }} />;
  }
  if (type === 'new_ticket_order') {
    return <Iconify icon="solar:cart-3-bold" width={20} sx={{ color: 'info.main' }} />;
  }
  return <Iconify icon="eva:trending-up-fill" width={20} sx={{ color: 'warning.main' }} />;
}
