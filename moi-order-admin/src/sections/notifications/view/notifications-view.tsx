import type { IconifyName } from 'src/components/iconify';
import type { AdminNotification, AdminNotificationType } from 'src/types';

import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { fToNow } from 'src/utils/format-time';

import { notificationsApi } from 'src/api/notifications';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNotifications } from 'src/context/notifications-context';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type CategoryTab = { value: 'all' | AdminNotificationType; label: string; icon: IconifyName };

const TABS: CategoryTab[] = [
  { value: 'all',              label: 'All',          icon: 'solar:bell-bing-bold-duotone' },
  { value: 'new_payment',      label: 'Payments',     icon: 'eva:trending-up-fill' },
  { value: 'new_ticket_order', label: 'Ticket Bookings', icon: 'solar:cart-3-bold' },
  { value: 'new_submission',   label: 'Submissions',  icon: 'eva:done-all-fill' },
];

function typeColor(type: string): 'success' | 'warning' | 'info' | 'default' {
  if (type === 'new_payment')      return 'success';
  if (type === 'new_ticket_order') return 'warning';
  if (type === 'new_submission')   return 'info';
  return 'default';
}

function typeIcon(type: string): IconifyName {
  if (type === 'new_payment')      return 'eva:trending-up-fill';
  if (type === 'new_ticket_order') return 'solar:cart-3-bold';
  if (type === 'new_submission')   return 'eva:done-all-fill';
  return 'solar:bell-bing-bold-duotone';
}

function notifLink(notif: AdminNotification): string | null {
  if (notif.data.submission_id)   return `/services/submissions/${notif.data.submission_id}`;
  if (notif.data.ticket_order_id) return `/bookings/${notif.data.ticket_order_id}`;
  return null;
}

// Renders body with "UserName" bold+quoted and object italic.
// Falls back to plain text for old notifications without structured data.
function FormattedBody({ notif }: { notif: AdminNotification }) {
  const { user_name, object_name, body } = notif.data;

  if (!user_name || !object_name) {
    return <Typography variant="caption" color="text.secondary">{body}</Typography>;
  }

  // Split the body on the user name and object name to extract the verb phrase.
  const verbPhrase = body
    .replace(user_name, '')
    .replace(object_name, '')
    .trim();

  return (
    <Typography variant="caption" color="text.secondary" component="span">
      <Box component="span" sx={{ fontWeight: 700 }}>&ldquo;{user_name}&rdquo;</Box>
      {' '}{verbPhrase}{' '}
      <Box component="span" sx={{ fontStyle: 'italic' }}>{object_name}</Box>
    </Typography>
  );
}

// ── Main view ────────────────────────────────────────────────────────────────

export function NotificationsView() {
  const router = useRouter();
  const { markAllRead, deleteAll } = useNotifications();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab  = (searchParams.get('type') ?? 'all') as 'all' | AdminNotificationType;
  const page       = Number(searchParams.get('page') ?? '0');
  const perPage    = Number(searchParams.get('per_page') ?? '20');

  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [total, setTotal]     = useState(0);
  const [unread, setUnread]   = useState(0);
  const [loading, setLoading] = useState(false);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      setSearchParams(
        (prev) => { Object.entries(updates).forEach(([k, v]) => prev.set(k, v)); return prev; },
        { replace: true }
      );
    },
    [setSearchParams],
  );

  const fetchPage = useCallback(() => {
    setLoading(true);
    notificationsApi
      .listAll({ page: page + 1, per_page: perPage, type: activeTab })
      .then(({ data, meta }) => {
        setNotifications(data);
        setTotal(meta.total);
        setUnread(meta.unread_count);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, perPage, activeTab]);

  useEffect(() => { fetchPage(); }, [fetchPage]);

  const handleMarkOneRead = useCallback((id: string) => {
    notificationsApi.markOneRead(id).then(() => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnread((c) => Math.max(0, c - 1));
    }).catch(() => {});
  }, []);

  const handleDeleteOne = useCallback((id: string) => {
    notificationsApi.deleteOne(id).then(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setTotal((t) => t - 1);
    }).catch(() => {});
  }, []);

  const handleMarkAllRead = useCallback(() => {
    markAllRead().then(() => {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnread(0);
    }).catch(() => {});
  }, [markAllRead]);

  const handleDeleteAll = useCallback(() => {
    if (!window.confirm('Delete all notifications? This cannot be undone.')) return;
    deleteAll().then(() => {
      setNotifications([]);
      setTotal(0);
      setUnread(0);
    }).catch(() => {});
  }, [deleteAll]);

  const handleRowClick = useCallback((notif: AdminNotification) => {
    if (!notif.is_read) handleMarkOneRead(notif.id);
    const link = notifLink(notif);
    if (link) router.push(link);
  }, [handleMarkOneRead, router]);

  return (
    <DashboardContent>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">Notifications</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {total} total{unread > 0 && ` · ${unread} unread`}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          {unread > 0 && (
            <Button size="small" variant="outlined" onClick={handleMarkAllRead}>
              Mark all read
            </Button>
          )}
          {total > 0 && (
            <Button size="small" variant="outlined" color="error" onClick={handleDeleteAll}>
              Delete all
            </Button>
          )}
        </Stack>
      </Box>

      <Card>
        {/* Category tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, v) => updateParams({ type: v, page: '0' })}
          sx={{ px: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <Iconify icon={tab.icon} width={16} />
                  <span>{tab.label}</span>
                </Stack>
              }
            />
          ))}
        </Tabs>

        <Scrollbar>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={40} />
                  <TableCell>Notification</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                ) : notifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8, color: 'text.secondary' }}>
                      No notifications
                    </TableCell>
                  </TableRow>
                ) : (
                  notifications.map((notif) => {
                    const link = notifLink(notif);
                    return (
                      <TableRow
                        key={notif.id}
                        hover
                        onClick={() => handleRowClick(notif)}
                        sx={{
                          cursor: link ? 'pointer' : 'default',
                          bgcolor: notif.is_read ? 'transparent' : 'action.hover',
                        }}
                      >
                        {/* Unread dot */}
                        <TableCell>
                          {!notif.is_read && (
                            <Box
                              sx={{
                                width: 8, height: 8, borderRadius: '50%',
                                bgcolor: 'primary.main', mx: 'auto',
                              }}
                            />
                          )}
                        </TableCell>

                        {/* Content */}
                        <TableCell>
                          <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                            <Box
                              sx={{
                                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                bgcolor: `${typeColor(notif.type)}.lighter`,
                                color: `${typeColor(notif.type)}.dark`,
                              }}
                            >
                              <Iconify icon={typeIcon(notif.type)} width={18} />
                            </Box>
                            <Box>
                              <Typography
                                variant="body2"
                                fontWeight={notif.is_read ? 400 : 600}
                              >
                                {notif.title}
                              </Typography>
                              <FormattedBody notif={notif} />
                            </Box>
                          </Stack>
                        </TableCell>

                        {/* Category label */}
                        <TableCell>
                          <Label color={typeColor(notif.type)}>
                            {TABS.find((t) => t.value === notif.type)?.label ?? notif.type}
                          </Label>
                        </TableCell>

                        {/* Time */}
                        <TableCell>
                          <Chip
                            size="small"
                            label={fToNow(notif.created_at)}
                            variant="outlined"
                            sx={{ fontSize: 11 }}
                          />
                        </TableCell>

                        {/* Actions */}
                        <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                          <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
                            {!notif.is_read && (
                              <Tooltip title="Mark as read">
                                <IconButton size="small" onClick={() => handleMarkOneRead(notif.id)}>
                                  <Iconify icon="eva:checkmark-fill" width={16} />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteOne(notif.id)}
                              >
                                <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={perPage}
          rowsPerPageOptions={[10, 20, 50]}
          onPageChange={(_, p) => updateParams({ page: String(p) })}
          onRowsPerPageChange={(e) => updateParams({ per_page: e.target.value, page: '0' })}
        />
      </Card>
    </DashboardContent>
  );
}
