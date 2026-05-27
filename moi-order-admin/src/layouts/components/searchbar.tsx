import type { BoxProps } from '@mui/material/Box';
import type { SearchResults } from 'src/api/search';

import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import InputBase from '@mui/material/InputBase';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';

import { searchApi } from 'src/api/search';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

function formatAmount(amountInCents: number, currency: string): string {
  const n = amountInCents / 100;
  if (currency === 'THB') return `฿${n.toLocaleString()}`;
  return `${n.toFixed(2)} ${currency}`;
}

// ── Result row ────────────────────────────────────────────────────────────────

interface ResultRowProps {
  primary: string;
  secondary: string;
  statusLabel: string;
  statusColor: 'success' | 'warning' | 'error' | 'default';
  onClick: () => void;
}

function ResultRow({ primary, secondary, statusLabel, statusColor, onClick }: ResultRowProps) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        px: 2,
        py: 1.25,
        textAlign: 'left',
        borderRadius: 0,
        transition: 'background 0.15s',
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Typography variant="body2" fontWeight={500} noWrap>{primary}</Typography>
        <Typography variant="caption" color="text.secondary" noWrap>{secondary}</Typography>
      </Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ flexShrink: 0 }}>
        <Label color={statusColor} sx={{ fontSize: 11 }}>{statusLabel}</Label>
        <Iconify icon="eva:arrow-ios-forward-fill" width={16} sx={{ color: 'text.disabled' }} />
      </Stack>
    </ButtonBase>
  );
}

// ── Result group ──────────────────────────────────────────────────────────────

interface ResultGroupProps {
  title: string;
  children: React.ReactNode;
}

function ResultGroup({ title, children }: ResultGroupProps) {
  return (
    <Box>
      <Typography
        variant="overline"
        sx={{ px: 2, pt: 2, pb: 0.5, display: 'block', color: 'text.disabled', fontSize: 11 }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function Searchbar({ sx, ...other }: BoxProps) {
  const router = useRouter();

  const [open, setOpen]         = useState(false);
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState<SearchResults | null>(null);
  const [loading, setLoading]   = useState(false);
  const inputRef                = useRef<HTMLInputElement>(null);

  // Ctrl+K / Cmd+K opens palette from anywhere in the app
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Debounced search — fires 300ms after the user stops typing
  useEffect(() => {
    if (query.length < 2) { setResults(null); return undefined; }
    setLoading(true);
    const timer = setTimeout(() => {
      searchApi
        .search(query)
        .then(setResults)
        .catch(() => setResults(null))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleOpen = useCallback(() => setOpen(true), []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setQuery('');
    setResults(null);
  }, []);

  const handleNavigate = useCallback((path: string) => {
    router.push(path);
    handleClose();
  }, [router, handleClose]);

  const totalResults = results
    ? results.users.length + results.submissions.length + results.bookings.length + results.payments.length
    : 0;

  const hasResults   = totalResults > 0;
  const showEmpty    = !loading && query.length >= 2 && results !== null && !hasResults;
  const showHint     = !loading && query.length < 2;

  return (
    <Box sx={sx} {...other}>
      {/* Header icon — always visible */}
      <IconButton onClick={handleOpen} size="small">
        <Iconify icon="eva:search-fill" />
      </IconButton>

      {/* Command palette dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        TransitionProps={{ onEntered: () => inputRef.current?.focus() }}
        sx={{ '& .MuiDialog-container': { alignItems: 'flex-start', pt: '10vh' } }}
        PaperProps={{ sx: { borderRadius: 2, overflow: 'hidden' } }}
      >
        {/* Search input */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Iconify icon="eva:search-fill" width={20} sx={{ color: 'text.disabled', flexShrink: 0 }} />
          <InputBase
            inputRef={inputRef}
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users, submissions, bookings, payments…"
            autoFocus
            sx={{ fontWeight: 500, fontSize: 15 }}
          />
          {loading && <CircularProgress size={18} sx={{ flexShrink: 0 }} />}
          {query && !loading && (
            <IconButton size="small" onClick={() => setQuery('')} edge="end">
              <Iconify icon="mingcute:close-line" width={18} />
            </IconButton>
          )}
        </Stack>

        {/* Results area */}
        <Box sx={{ maxHeight: 460, overflowY: 'auto' }}>
          {showHint && (
            <Box sx={{ py: 5, textAlign: 'center' }}>
              <Typography variant="body2" color="text.disabled">
                Type at least 2 characters to search
              </Typography>
            </Box>
          )}

          {showEmpty && (
            <Box sx={{ py: 5, textAlign: 'center' }}>
              <Typography variant="body2" color="text.disabled">
                No results for &ldquo;{query}&rdquo;
              </Typography>
            </Box>
          )}

          {!loading && hasResults && results && (
            <Box pb={1}>
              {results.users.length > 0 && (
                <ResultGroup title="Users">
                  {results.users.map((u) => (
                    <ResultRow
                      key={u.id}
                      primary={u.name}
                      secondary={u.email}
                      statusLabel={u.is_deleted ? 'Deleted' : u.status_label}
                      statusColor={u.is_deleted ? 'error' : u.status === 'active' ? 'success' : 'warning'}
                      onClick={() => handleNavigate(`/users/${u.id}`)}
                    />
                  ))}
                </ResultGroup>
              )}

              {results.submissions.length > 0 && (
                <>
                  {results.users.length > 0 && <Divider sx={{ mt: 1 }} />}
                  <ResultGroup title="Submissions">
                    {results.submissions.map((s) => (
                      <ResultRow
                        key={s.id}
                        primary={`#${s.id} · ${s.service_name}${s.type_name ? ` (${s.type_name})` : ''}`}
                        secondary={`${s.user_name} · ${fDate(s.created_at)}`}
                        statusLabel={s.status_label}
                        statusColor={
                          s.status === 'completed' ? 'success' :
                          s.status === 'payment_failed' || s.status === 'cancelled' ? 'error' : 'warning'
                        }
                        onClick={() => handleNavigate(`/services/submissions/${s.id}`)}
                      />
                    ))}
                  </ResultGroup>
                </>
              )}

              {results.bookings.length > 0 && (
                <>
                  {(results.users.length > 0 || results.submissions.length > 0) && <Divider sx={{ mt: 1 }} />}
                  <ResultGroup title="Bookings">
                    {results.bookings.map((b) => (
                      <ResultRow
                        key={b.id}
                        primary={`#${b.id} · ${b.ticket_name}`}
                        secondary={`${b.user_name} · Visit ${fDate(b.visit_date)}`}
                        statusLabel={b.status_label}
                        statusColor={
                          b.status === 'completed' ? 'success' :
                          b.status === 'payment_failed' ? 'error' : 'warning'
                        }
                        onClick={() => handleNavigate(`/bookings/${b.id}`)}
                      />
                    ))}
                  </ResultGroup>
                </>
              )}

              {results.payments.length > 0 && (
                <>
                  {(results.users.length > 0 || results.submissions.length > 0 || results.bookings.length > 0) && <Divider sx={{ mt: 1 }} />}
                  <ResultGroup title="Payments">
                    {results.payments.map((p) => (
                      <ResultRow
                        key={p.id}
                        primary={`#${p.id} · ${formatAmount(p.amount, p.currency)}`}
                        secondary={fDate(p.created_at)}
                        statusLabel={p.status_label}
                        statusColor={
                          p.status === 'succeeded' ? 'success' :
                          p.status === 'failed' ? 'error' : 'warning'
                        }
                        onClick={() => handleNavigate(`/payments/${p.id}`)}
                      />
                    ))}
                  </ResultGroup>
                </>
              )}
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: 2,
            py: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Chip label="Ctrl K" size="small" variant="outlined" sx={{ height: 20, fontSize: 11, borderRadius: 0.75 }} />
          <Typography variant="caption" color="text.disabled">
            Esc to close
          </Typography>
        </Box>
      </Dialog>
    </Box>
  );
}
