import type { IconButtonProps } from '@mui/material/IconButton';
import type { AdminNotification, AdminNotificationData } from 'src/types';

import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
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

import { useNotifications } from 'src/context/notifications-context';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

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
  const { notifications, unreadCount, markOneRead, markAllRead } = useNotifications();
  const navigate = useNavigate();

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    await markAllRead();
  }, [markAllRead]);

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
        <Badge badgeContent={unreadCount} color="error">
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
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : 'All caught up'}
            </Typography>
          </Box>

          {unreadCount > 0 && (
            <Tooltip title="Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar fillContent sx={{ minHeight: 240, maxHeight: { xs: 360, sm: 'none' } }}>
          {unread.length > 0 && (
            <List
              disablePadding
              subheader={
                <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                  New
                </ListSubheader>
              }
            >
              {unread.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onClick={handleNotificationClick}
                />
              ))}
            </List>
          )}

          {read.length > 0 && (
            <List
              disablePadding
              subheader={
                <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                  {unread.length > 0 ? 'Earlier' : 'Read'}
                </ListSubheader>
              }
            >
              {read.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onClick={handleNotificationClick}
                />
              ))}
            </List>
          )}

          {notifications.length === 0 && (
            <Box sx={{ py: 6, textAlign: 'center', color: 'text.disabled' }}>
              <Iconify icon="solar:bell-bing-bold-duotone" width={40} sx={{ mb: 1, opacity: 0.4 }} />
              <Typography variant="body2">No notifications</Typography>
            </Box>
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
};

function NotificationItem({ notification, onClick }: NotificationItemProps) {
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
