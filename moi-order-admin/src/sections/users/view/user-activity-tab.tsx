import type { UserActivityLog } from 'src/types';
import type { TimelineItemProps } from '@mui/lab/TimelineItem';
import type {
  UserDetailData,
  FoodOrderSummary,
  TicketOrderSummary,
  ServiceSubmissionSummary,
} from 'src/api/users';

import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Timeline from '@mui/lab/Timeline';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import CircularProgress from '@mui/material/CircularProgress';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

import { useRouter } from 'src/routes/hooks';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fToNow } from 'src/utils/format-time';

import { usersApi } from 'src/api/users';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type FilterValue = 'all' | 'auth_security' | 'social' | 'orders' | 'account';

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: 'All',               value: 'all' },
  { label: 'Auth & Security',   value: 'auth_security' },
  { label: 'Social & Contact',  value: 'social' },
  { label: 'Orders & Services', value: 'orders' },
  { label: 'Account Actions',   value: 'account' },
];

// ── Merged timeline item ──────────────────────────────────────────────────────

type ActivityItem =
  | { kind: 'log';          data: UserActivityLog;          date: string }
  | { kind: 'ticket_order'; data: TicketOrderSummary;       date: string }
  | { kind: 'food_order';   data: FoodOrderSummary;         date: string }
  | { kind: 'submission';   data: ServiceSubmissionSummary; date: string };

function getItemFilter(item: ActivityItem): FilterValue {
  if (item.kind === 'ticket_order' || item.kind === 'food_order' || item.kind === 'submission') {
    return 'orders';
  }
  const cat = item.data.category;
  if (cat === 'auth' || cat === 'security') return 'auth_security';
  if (cat === 'social')  return 'social';
  if (cat === 'account') return 'account';
  return 'all';
}

function groupByDay(items: ActivityItem[]): Record<string, ActivityItem[]> {
  return items.reduce<Record<string, ActivityItem[]>>((acc, item) => {
    const day = fDate(item.date);
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {});
}

// ── Dot color per event ───────────────────────────────────────────────────────

type DotColor = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'grey';

function getDotColor(item: ActivityItem): DotColor {
  if (item.kind === 'ticket_order') return 'primary';
  if (item.kind === 'food_order')   return 'primary';
  if (item.kind === 'submission')   return 'primary';

  const { event, category } = item.data;
  if (category === 'account') {
    return event === 'account_activated' ? 'success' : 'error';
  }
  if (category === 'security') return 'error';
  if (event === 'login_failed') return 'error';
  if (event === 'login_success') return 'info';
  if (category === 'social') return 'warning';
  return 'info';
}

// ── Browser / OS from user agent ──────────────────────────────────────────────

function parseUserAgent(ua: string | null): string {
  if (!ua) return '';
  const os = /iPhone|iPad/.test(ua) ? 'iOS'
    : /Android/.test(ua)  ? 'Android'
    : /Windows/.test(ua)  ? 'Windows'
    : /Mac OS/.test(ua)   ? 'macOS'
    : /Linux/.test(ua)    ? 'Linux'
    : '';
  const browser = /Chrome/.test(ua) && !/Chromium|OPR|Edge/.test(ua) ? 'Chrome'
    : /Safari/.test(ua) && !/Chrome/.test(ua) ? 'Safari'
    : /Firefox/.test(ua) ? 'Firefox'
    : /Edge/.test(ua)    ? 'Edge'
    : '';
  return [browser, os].filter(Boolean).join(' · ');
}

// ── Individual timeline item ──────────────────────────────────────────────────

type ItemProps = TimelineItemProps & {
  item: ActivityItem;
  isLast: boolean;
};

function ActivityItem({ item, isLast, ...other }: ItemProps) {
  const router = useRouter();
  const dotColor = getDotColor(item);

  let title = '';
  let description = '';
  let statusLabel: string | null = null;
  let statusColor: 'success' | 'warning' | 'error' | 'default' = 'default';
  let navigateTo: string | null = null;
  let securityNote: string | null = null;

  if (item.kind === 'log') {
    const { data } = item;
    title = data.event_label;

    const meta = data.metadata;

    if (data.event === 'login_success' || data.event === 'login_failed') {
      const method = typeof meta.method === 'string' ? meta.method : '';
      const device = parseUserAgent(data.user_agent);
      description = [method ? method.charAt(0).toUpperCase() + method.slice(1) : '', data.ip_address, device]
        .filter(Boolean).join(' · ');
    } else if (data.event === 'email_changed') {
      description = `${meta.old_email ?? '—'} → ${meta.new_email ?? '—'}`;
      if (data.ip_address) description += ` · IP ${data.ip_address}`;
    } else if (data.event === 'password_changed') {
      description = data.ip_address ? `IP ${data.ip_address}` : '';
      securityNote = 'All other sessions were logged out';
    } else if (data.category === 'social') {
      description = data.ip_address ? `IP ${data.ip_address}` : '';
    } else if (data.event === 'account_banned' || data.event === 'account_suspended' || data.event === 'account_activated') {
      const admin = typeof meta.by_admin_name === 'string' ? meta.by_admin_name : null;
      if (admin) description = `By: ${admin}`;
      if (data.event === 'account_suspended' && meta.until) {
        description += ` · Until ${fDate(String(meta.until))}`;
      }
    } else if (data.event === 'phone_changed') {
      description = data.ip_address ? `IP ${data.ip_address}` : '';
    }

  } else if (item.kind === 'ticket_order') {
    const { data } = item;
    title = `Ticket booked`;
    description = data.ticket_name ?? '—';
    statusLabel = data.status_label;
    statusColor = data.status === 'completed' ? 'success' : data.status === 'payment_failed' ? 'error' : 'warning';
    navigateTo = `/bookings/${data.id}`;

  } else if (item.kind === 'food_order') {
    const { data } = item;
    title = 'Food order placed';
    description = [
      data.restaurant_name,
      data.total !== null ? fCurrency(data.total / 100) : null,
    ].filter(Boolean).join(' · ');
    statusLabel = data.status;
    navigateTo = `/food-orders/${data.id}`;

  } else if (item.kind === 'submission') {
    const { data } = item;
    title = 'Service submitted';
    description = [data.service_name, data.type_name].filter(Boolean).join(' · ');
    statusLabel = data.status_label;
    statusColor = data.status === 'completed' ? 'success' : data.status === 'payment_failed' || data.status === 'cancelled' ? 'error' : 'warning';
    navigateTo = `/services/submissions/${data.id}`;
  }

  return (
    <TimelineItem {...other}>
      <TimelineSeparator>
        <TimelineDot color={dotColor} sx={{ my: 1.25 }} />
        {!isLast && <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent sx={{ pb: isLast ? 0 : 2.5, pt: 0.75 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ lineHeight: 1.4 }}>{title}</Typography>

            {description && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                {description}
              </Typography>
            )}

            {securityNote && (
              <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.25, fontStyle: 'italic' }}>
                {securityNote}
              </Typography>
            )}

            {statusLabel && (
              <Label color={statusColor} sx={{ mt: 0.75 }}>{statusLabel}</Label>
            )}
          </Box>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ flexShrink: 0, pt: 0.25 }}>
            <Typography variant="caption" color="text.disabled" sx={{ whiteSpace: 'nowrap' }}>
              {fToNow(item.date)}
            </Typography>
            {navigateTo && (
              <Button
                size="small"
                variant="text"
                endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={14} />}
                onClick={() => router.push(navigateTo!)}
                sx={{ minWidth: 0, px: 0.75, py: 0.25, fontSize: 12 }}
              >
                View
              </Button>
            )}
          </Stack>
        </Stack>
      </TimelineContent>
    </TimelineItem>
  );
}

// ── Main tab component ────────────────────────────────────────────────────────

interface Props {
  userId: number;
  user: UserDetailData;
}

export function UserActivityTab({ userId, user }: Props) {
  const [logs, setLogs]         = useState<UserActivityLog[]>([]);
  const [page, setPage]         = useState(1);
  const [hasMore, setHasMore]   = useState(false);
  const [loading, setLoading]   = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter]     = useState<FilterValue>('all');

  const fetchPage = useCallback((p: number, append: boolean) => {
    if (p === 1) setLoading(true); else setLoadingMore(true);
    usersApi
      .activityLog(userId, p)
      .then(({ data, meta }) => {
        setLogs((prev) => append ? [...prev, ...data] : data);
        setHasMore(meta.current_page < meta.last_page);
        setPage(meta.current_page);
      })
      .catch(() => {})
      .finally(() => { setLoading(false); setLoadingMore(false); });
  }, [userId]);

  useEffect(() => { fetchPage(1, false); }, [fetchPage]);

  const allItems = useMemo<ActivityItem[]>(() => {
    const items: ActivityItem[] = [
      ...logs.map((l) => ({ kind: 'log' as const, data: l, date: l.created_at })),
      ...user.recent_ticket_orders.map((o) => ({ kind: 'ticket_order' as const, data: o, date: o.created_at })),
      ...user.recent_food_orders.map((o) => ({ kind: 'food_order' as const, data: o, date: o.created_at })),
      ...user.service_submissions.map((s) => ({ kind: 'submission' as const, data: s, date: s.created_at })),
    ];
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [logs, user]);

  const filtered = useMemo(
    () => filter === 'all' ? allItems : allItems.filter((i) => getItemFilter(i) === filter),
    [allItems, filter],
  );

  const grouped = useMemo(() => groupByDay(filtered), [filtered]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Filter chips */}
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
        {FILTERS.map((f) => (
          <Chip
            key={f.value}
            label={f.label}
            size="small"
            onClick={() => setFilter(f.value)}
            color={filter === f.value ? 'primary' : 'default'}
            variant={filter === f.value ? 'filled' : 'outlined'}
            sx={{ cursor: 'pointer' }}
          />
        ))}
      </Stack>

      {filtered.length === 0 && (
        <Typography variant="body2" color="text.disabled" sx={{ py: 4, textAlign: 'center' }}>
          No activity yet.
        </Typography>
      )}

      {/* Day-grouped timeline */}
      {Object.entries(grouped).map(([day, items]) => (
        <Box key={day}>
          <Divider sx={{ my: 2 }}>
            <Typography variant="caption" color="text.disabled" sx={{ px: 1 }}>
              {day}
            </Typography>
          </Divider>

          <Timeline
            sx={{
              m: 0,
              p: 0,
              [`& .${timelineItemClasses.root}:before`]: { flex: 0, padding: 0 },
            }}
          >
            {items.map((item, idx) => (
              <ActivityItem
                key={item.kind === 'log' ? `log-${item.data.id}` : `${item.kind}-${item.data.id}`}
                item={item}
                isLast={idx === items.length - 1}
              />
            ))}
          </Timeline>
        </Box>
      ))}

      {/* Load more (activity logs only — order data is already fully loaded) */}
      {hasMore && (
        <Box sx={{ textAlign: 'center', pt: 3 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => fetchPage(page + 1, true)}
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading…' : 'Load more events'}
          </Button>
        </Box>
      )}
    </Box>
  );
}
