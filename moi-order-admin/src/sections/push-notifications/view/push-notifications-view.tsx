import type { CustomNotification } from 'src/types';
import type { SendCustomNotificationPayload } from 'src/api/custom-notifications';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import CardHeader from '@mui/material/CardHeader';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { customNotificationsApi } from 'src/api/custom-notifications';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

const TITLE_MAX = 100;
const BODY_MAX  = 500;

type FormErrors = {
  title?: string;
  body?: string;
  user_email?: string;
};

// ── Notification preview pill ────────────────────────────────────────────────

function NotificationPreview({ title, body }: { title: string; body: string }) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 1.5,
        bgcolor: 'background.neutral',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 1,
          bgcolor: 'primary.main',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Iconify icon="solar:bell-bing-bold-duotone" width={20} sx={{ color: 'white' }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" fontWeight={700} noWrap display="block">
          {title || 'Notification title'}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {body || 'Notification message will appear here'}
        </Typography>
      </Box>
    </Box>
  );
}

// ── Main view ────────────────────────────────────────────────────────────────

export function PushNotificationsView() {
  const [title, setTitle]           = useState('');
  const [body, setBody]             = useState('');
  const [targetType, setTargetType] = useState<'all' | 'single'>('all');
  const [userEmail, setUserEmail]   = useState('');
  const [errors, setErrors]         = useState<FormErrors>({});
  const [sending, setSending]       = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [history, setHistory]         = useState<CustomNotification[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyTotal, setHistoryTotal]     = useState(0);
  const [page, setPage]                     = useState(0);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  const loadHistory = useCallback(async (p: number) => {
    setHistoryLoading(true);
    try {
      const res = await customNotificationsApi.list(p + 1);
      setHistory(res.data);
      setHistoryTotal(res.meta.total);
    } catch {
      // history load failure is non-critical — compose panel still works
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory(page);
  }, [page, loadHistory]);

  // ── Validation ──────────────────────────────────────────────────────────────

  function validate(): boolean {
    const next: FormErrors = {};
    if (!title.trim()) next.title = 'Title is required.';
    else if (title.length > TITLE_MAX) next.title = `Title must be ${TITLE_MAX} characters or less.`;
    if (!body.trim()) next.body = 'Message is required.';
    else if (body.length > BODY_MAX) next.body = `Message must be ${BODY_MAX} characters or less.`;
    if (targetType === 'single') {
      if (!userEmail.trim()) next.user_email = 'User email is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) next.user_email = 'Enter a valid email address.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSendClick() {
    if (validate()) setConfirmOpen(true);
  }

  // ── Send ────────────────────────────────────────────────────────────────────

  async function handleConfirmSend() {
    setConfirmOpen(false);
    setSending(true);

    const payload: SendCustomNotificationPayload = {
      title: title.trim(),
      body:  body.trim(),
      target_type: targetType,
      ...(targetType === 'single' && { user_email: userEmail.trim() }),
    };

    try {
      const record = await customNotificationsApi.send(payload);
      setHistory((prev) => [record, ...prev]);
      setHistoryTotal((t) => t + 1);
      setTitle('');
      setBody('');
      setUserEmail('');
      setTargetType('all');
      setErrors({});
      setSnackbar({ open: true, message: 'Notification sent successfully.', severity: 'success' });
    } catch (err: unknown) {
      const apiErrors = (err as { response?: { data?: { errors?: Record<string, string[]> } } })?.response?.data?.errors;
      if (apiErrors?.user_email) {
        setErrors((prev) => ({ ...prev, user_email: apiErrors.user_email[0] }));
      } else {
        setSnackbar({ open: true, message: 'Failed to send notification. Please try again.', severity: 'error' });
      }
    } finally {
      setSending(false);
    }
  }

  // ── Confirm dialog label ─────────────────────────────────────────────────────

  const confirmLabel = targetType === 'all'
    ? 'all active users'
    : userEmail.trim() || 'this user';

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <DashboardContent>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Push Notifications</Typography>
          <Typography variant="body2" color="text.secondary">
            Compose and send announcements to app users
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={3}>
        {/* ── Left: Compose ── */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardHeader title="Compose" subheader="Write a message and choose your audience" />
            <CardContent>
              <Stack spacing={2.5}>
                {/* Title */}
                <Box>
                  <TextField
                    fullWidth
                    label="Title"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); setErrors((prev) => ({ ...prev, title: undefined })); }}
                    error={Boolean(errors.title)}
                    helperText={errors.title}
                    inputProps={{ maxLength: TITLE_MAX }}
                  />
                  <Typography variant="caption" color="text.disabled" align="right" display="block" sx={{ mt: 0.5 }}>
                    {title.length} / {TITLE_MAX}
                  </Typography>
                </Box>

                {/* Body */}
                <Box>
                  <TextField
                    fullWidth
                    label="Message"
                    multiline
                    rows={4}
                    value={body}
                    onChange={(e) => { setBody(e.target.value); setErrors((prev) => ({ ...prev, body: undefined })); }}
                    error={Boolean(errors.body)}
                    helperText={errors.body}
                    inputProps={{ maxLength: BODY_MAX }}
                  />
                  <Typography variant="caption" color="text.disabled" align="right" display="block" sx={{ mt: 0.5 }}>
                    {body.length} / {BODY_MAX}
                  </Typography>
                </Box>

                <Divider />

                {/* Target audience */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Send to</Typography>
                  <RadioGroup
                    value={targetType}
                    onChange={(e) => { setTargetType(e.target.value as 'all' | 'single'); setErrors((prev) => ({ ...prev, user_email: undefined })); }}
                  >
                    <FormControlLabel value="all" control={<Radio size="small" />} label="All active users" />
                    <FormControlLabel value="single" control={<Radio size="small" />} label="Single user (by email)" />
                  </RadioGroup>

                  {targetType === 'single' && (
                    <TextField
                      fullWidth
                      size="small"
                      label="User email"
                      type="email"
                      value={userEmail}
                      onChange={(e) => { setUserEmail(e.target.value); setErrors((prev) => ({ ...prev, user_email: undefined })); }}
                      error={Boolean(errors.user_email)}
                      helperText={errors.user_email}
                      sx={{ mt: 1.5 }}
                    />
                  )}
                </Box>

                <Divider />

                {/* Live preview */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Preview</Typography>
                  <NotificationPreview title={title} body={body} />
                </Box>

                {/* Send button */}
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  onClick={handleSendClick}
                  disabled={sending}
                  startIcon={
                    sending
                      ? <CircularProgress size={16} color="inherit" />
                      : <Iconify icon="solar:share-bold" width={18} />
                  }
                >
                  {sending ? 'Sending…' : 'Send Notification'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Right: History ── */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Send History" subheader="Previously sent custom notifications" />

            <Scrollbar>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title / Message</TableCell>
                      <TableCell>Target</TableCell>
                      <TableCell align="right">Recipients</TableCell>
                      <TableCell>Sent</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {historyLoading && (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                          <CircularProgress size={28} />
                        </TableCell>
                      </TableRow>
                    )}

                    {!historyLoading && history.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                          <Stack alignItems="center" spacing={1}>
                            <Iconify icon="solar:bell-bing-bold-duotone" width={40} sx={{ color: 'text.disabled', opacity: 0.4 }} />
                            <Typography variant="body2" color="text.secondary">
                              No notifications sent yet
                            </Typography>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    )}

                    {!historyLoading && history.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell sx={{ maxWidth: 260 }}>
                          <Typography variant="body2" fontWeight={600} noWrap>
                            {row.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {row.body}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          {row.target_type === 'all' ? (
                            <Label color="info">All users</Label>
                          ) : (
                            <Chip
                              size="small"
                              label={row.target_user_email ?? 'single'}
                              variant="outlined"
                              sx={{ maxWidth: 160, fontSize: 11 }}
                            />
                          )}
                        </TableCell>

                        <TableCell align="right">
                          <Typography variant="body2">{row.recipients_count.toLocaleString()}</Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2">{fDate(row.sent_at)}</Typography>
                          {row.sent_by && (
                            <Typography variant="caption" color="text.secondary">{row.sent_by}</Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            {historyTotal > 20 && (
              <TablePagination
                component="div"
                count={historyTotal}
                page={page}
                rowsPerPage={20}
                rowsPerPageOptions={[20]}
                onPageChange={(_, p) => setPage(p)}
              />
            )}
          </Card>
        </Grid>
      </Grid>

      {/* ── Confirmation dialog ── */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Send</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Send <strong>&ldquo;{title}&rdquo;</strong> to <strong>{confirmLabel}</strong>?
            This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleConfirmSend} variant="contained" autoFocus>
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Success / error snackbar ── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}
