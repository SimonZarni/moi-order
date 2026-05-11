import { useState, useEffect, useRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import ToggleButton from '@mui/material/ToggleButton';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { fDate, fToNow } from 'src/utils/format-time';

import { authApi } from 'src/api/auth';
import { settingsApi } from 'src/api/settings';
import { useAuth } from 'src/context/auth-context';
import { DashboardContent } from 'src/layouts/dashboard';
import { appAlertsApi, type InAppAlert } from 'src/api/appAlerts';
import { adminSessionsApi, type AdminSession, type AdminSessionMeta } from 'src/api/adminSessions';
import { appConfigApi, type AppUpdateConfig } from 'src/api/appConfig';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type AlertFormState = {
  title: string;
  message: string;
  frequency: 'once_per_day' | 'every_open';
  is_active: boolean;
};

const DEFAULT_ALERT_FORM: AlertFormState = {
  title: '',
  message: '',
  frequency: 'once_per_day',
  is_active: false,
};

// ----------------------------------------------------------------------

export function SettingsView() {
  const { isSuperAdmin } = useAuth();
  const superAdmin = isSuperAdmin();

  // ── Change Password ───────────────────────────────────────────────────────
  const [pwSaved, setPwSaved] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  // ── Notifications (UI stub) ────────────────────────────────────────────────
  const [notifBookings, setNotifBookings] = useState(true);
  const [notifSubmissions, setNotifSubmissions] = useState(true);
  const [notifPayments, setNotifPayments] = useState(true);
  const [notifReviews, setNotifReviews] = useState(false);

  // ── Admin Sessions (super-admin only) ────────────────────────────────────
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [sessionsMeta, setSessionsMeta] = useState<AdminSessionMeta | null>(null);
  const [sessionsPage, setSessionsPage] = useState(0);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<number | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);

  // ── Maintenance mode ──────────────────────────────────────────────────────
  const [maintenanceActive, setMaintenanceActive] = useState<boolean | null>(null);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [maintenanceError, setMaintenanceError] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // ── App Updates ───────────────────────────────────────────────────────────
  const [updateConfig, setUpdateConfig] = useState<AppUpdateConfig>({
    ios_min_version: '',
    android_min_version: '',
    type: 'none',
    title: '',
    message: '',
    ios_store_url: '',
    android_store_url: '',
  });
  const [updateSaving, setUpdateSaving] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // ── In-App Alerts ──────────────────────────────────────────────────────────
  const [alerts, setAlerts] = useState<InAppAlert[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [alertsError, setAlertsError] = useState<string | null>(null);

  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertDialogMode, setAlertDialogMode] = useState<'create' | 'edit'>('create');
  const [editingAlert, setEditingAlert] = useState<InAppAlert | null>(null);
  const [alertForm, setAlertForm] = useState<AlertFormState>(DEFAULT_ALERT_FORM);
  const [alertFormSaving, setAlertFormSaving] = useState(false);
  const [alertFormError, setAlertFormError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<InAppAlert | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [toggling, setToggling] = useState<number | null>(null);
  const [imageUploading, setImageUploading] = useState<number | null>(null);
  const [imageRemoving, setImageRemoving] = useState<number | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const imageTargetIdRef = useRef<number | null>(null);

  // ── Effects ───────────────────────────────────────────────────────────────

  useEffect(() => {
    settingsApi
      .getMaintenanceStatus()
      .then((s) => setMaintenanceActive(s.active))
      .catch(() => setMaintenanceActive(false));
  }, []);

  const fetchSessions = useCallback((page: number) => {
    setSessionsLoading(true);
    adminSessionsApi
      .list(page + 1)
      .then(({ data, meta }) => { setSessions(data); setSessionsMeta(meta); })
      .catch(() => setSessionsError('Failed to load sessions.'))
      .finally(() => setSessionsLoading(false));
  }, []);

  useEffect(() => {
    if (!superAdmin) return;
    fetchSessions(sessionsPage);
  }, [superAdmin, sessionsPage, fetchSessions]);

  useEffect(() => {
    appConfigApi
      .get()
      .then((data) => setUpdateConfig(data.update))
      .catch(() => {});
  }, []);

  const fetchAlerts = useCallback(() => {
    setAlertsLoading(true);
    appAlertsApi
      .list()
      .then(setAlerts)
      .catch(() => setAlertsError('Failed to load alerts.'))
      .finally(() => setAlertsLoading(false));
  }, []);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  // ── Handlers — password ───────────────────────────────────────────────────

  const pwMatch = newPw === confirmPw;
  const pwValid = currentPw.length > 0 && newPw.length >= 8 && pwMatch && !pwLoading;

  const handleChangePassword = useCallback(async () => {
    setPwLoading(true);
    setPwError(null);
    setPwSaved(false);
    try {
      await authApi.changePassword({
        current_password: currentPw,
        new_password: newPw,
        new_password_confirmation: confirmPw,
      });
      setPwSaved(true);
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    } catch (e: any) {
      const msg = e?.response?.data?.errors?.current_password?.[0];
      setPwError(msg ?? 'Failed to update password. Please try again.');
    } finally {
      setPwLoading(false);
    }
  }, [currentPw, newPw, confirmPw]);

  // ── Handlers — maintenance ────────────────────────────────────────────────

  const handleMaintenanceToggle = useCallback(() => {
    if (maintenanceActive) {
      setMaintenanceLoading(true);
      setMaintenanceError(null);
      settingsApi
        .disableMaintenance()
        .then((s) => setMaintenanceActive(s.active))
        .catch(() => setMaintenanceError('Failed to disable maintenance mode. Try again.'))
        .finally(() => setMaintenanceLoading(false));
    } else {
      setConfirmDialogOpen(true);
    }
  }, [maintenanceActive]);

  const handleConfirmEnable = useCallback(() => {
    setConfirmDialogOpen(false);
    setMaintenanceLoading(true);
    setMaintenanceError(null);
    settingsApi
      .enableMaintenance()
      .then((s) => setMaintenanceActive(s.active))
      .catch(() => setMaintenanceError('Failed to enable maintenance mode. Try again.'))
      .finally(() => setMaintenanceLoading(false));
  }, []);

  // ── Handlers — update config ──────────────────────────────────────────────

  const handleSaveUpdate = useCallback(() => {
    setUpdateSaving(true);
    setUpdateError(null);
    setUpdateSuccess(false);
    appConfigApi
      .update({
        ios_min_version:     updateConfig.ios_min_version || null,
        android_min_version: updateConfig.android_min_version || null,
        update_type:         updateConfig.type,
        update_title:        updateConfig.title || null,
        update_message:      updateConfig.message || null,
        ios_store_url:       updateConfig.ios_store_url || null,
        android_store_url:   updateConfig.android_store_url || null,
      })
      .then((data) => { setUpdateConfig(data.update); setUpdateSuccess(true); })
      .catch(() => setUpdateError('Failed to save update settings. Please try again.'))
      .finally(() => setUpdateSaving(false));
  }, [updateConfig]);

  // ── Handlers — sessions ───────────────────────────────────────────────────

  const handleRevokeSession = useCallback((tokenId: number) => {
    setRevoking(tokenId);
    setSessionsError(null);
    adminSessionsApi
      .revoke(tokenId)
      .then(() => {
        const remaining = sessions.filter((s) => s.id !== tokenId).length;
        const targetPage = remaining === 0 && sessionsPage > 0 ? sessionsPage - 1 : sessionsPage;
        if (targetPage !== sessionsPage) {
          setSessionsPage(targetPage);
        } else {
          fetchSessions(sessionsPage);
        }
      })
      .catch(() => setSessionsError('Failed to delete session. Please try again.'))
      .finally(() => setRevoking(null));
  }, [sessions, sessionsPage, fetchSessions]);

  const handleRevokeOthers = useCallback(() => {
    setRevokingAll(true);
    setSessionsError(null);
    adminSessionsApi
      .revokeOthers()
      .then(() => { setSessionsPage(0); fetchSessions(0); })
      .catch(() => setSessionsError('Failed to sign out others. Please try again.'))
      .finally(() => setRevokingAll(false));
  }, [fetchSessions]);

  // ── Handlers — alerts ─────────────────────────────────────────────────────

  const openCreateDialog = useCallback(() => {
    setAlertDialogMode('create');
    setEditingAlert(null);
    setAlertForm(DEFAULT_ALERT_FORM);
    setAlertFormError(null);
    setAlertDialogOpen(true);
  }, []);

  const openEditDialog = useCallback((alert: InAppAlert) => {
    setAlertDialogMode('edit');
    setEditingAlert(alert);
    setAlertForm({
      title: alert.title,
      message: alert.message,
      frequency: alert.frequency,
      is_active: alert.is_active,
    });
    setAlertFormError(null);
    setAlertDialogOpen(true);
  }, []);

  const closeAlertDialog = useCallback(() => {
    setAlertDialogOpen(false);
    setAlertFormSaving(false);
  }, []);

  const handleSaveAlertForm = useCallback(async () => {
    setAlertFormSaving(true);
    setAlertFormError(null);
    try {
      if (alertDialogMode === 'create') {
        const created = await appAlertsApi.store(alertForm);
        setAlerts((prev) => [created, ...prev]);
      } else if (editingAlert) {
        const updated = await appAlertsApi.update(editingAlert.id, alertForm);
        setAlerts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      }
      closeAlertDialog();
    } catch {
      setAlertFormError('Failed to save alert. Please try again.');
    } finally {
      setAlertFormSaving(false);
    }
  }, [alertDialogMode, editingAlert, alertForm, closeAlertDialog]);

  const handleToggleActive = useCallback(async (alert: InAppAlert) => {
    setToggling(alert.id);
    try {
      const updated = alert.is_active
        ? await appAlertsApi.deactivate(alert.id)
        : await appAlertsApi.activate(alert.id);
      setAlerts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    } catch {
      setAlertsError('Failed to update alert status.');
    } finally {
      setToggling(null);
    }
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await appAlertsApi.destroy(deleteTarget.id);
      setAlerts((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      setAlertsError('Failed to delete alert.');
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget]);

  const handleImageUploadClick = useCallback((alertId: number) => {
    imageTargetIdRef.current = alertId;
    imageInputRef.current?.click();
  }, []);

  const handleImageFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetId = imageTargetIdRef.current;
    if (!file || !targetId) return;
    setImageUploading(targetId);
    try {
      const updated = await appAlertsApi.uploadImage(targetId, file);
      setAlerts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    } catch {
      setAlertsError('Failed to upload image.');
    } finally {
      setImageUploading(null);
      e.target.value = '';
      imageTargetIdRef.current = null;
    }
  }, []);

  const handleRemoveImage = useCallback(async (alertId: number) => {
    setImageRemoving(alertId);
    try {
      const updated = await appAlertsApi.removeImage(alertId);
      setAlerts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    } catch {
      setAlertsError('Failed to remove image.');
    } finally {
      setImageRemoving(null);
    }
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4">Settings</Typography>
        <Typography variant="body2" color="text.secondary">Manage your account security and preferences</Typography>
      </Box>

      <Grid container spacing={3}>

        {/* ── Change Password ──────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title="Change Password" subheader="Use a strong password of at least 8 characters" />
            <Divider />
            <CardContent>
              {pwSaved && (
                <Alert severity="success" sx={{ mb: 2.5 }} onClose={() => setPwSaved(false)}>
                  Password updated successfully.
                </Alert>
              )}
              {pwError && (
                <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setPwError(null)}>
                  {pwError}
                </Alert>
              )}
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPw}
                  onChange={(e) => { setCurrentPw(e.target.value); setPwError(null); }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowCurrent((v) => !v)} edge="end" size="small">
                          <Iconify icon={showCurrent ? 'solar:eye-bold' : 'solar:eye-closed-bold'} width={18} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="New Password"
                  type={showNew ? 'text' : 'password'}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  error={newPw.length > 0 && newPw.length < 8}
                  helperText={newPw.length > 0 && newPw.length < 8 ? 'At least 8 characters' : ''}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowNew((v) => !v)} edge="end" size="small">
                          <Iconify icon={showNew ? 'solar:eye-bold' : 'solar:eye-closed-bold'} width={18} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  error={confirmPw.length > 0 && !pwMatch}
                  helperText={confirmPw.length > 0 && !pwMatch ? 'Passwords do not match' : ''}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirm((v) => !v)} edge="end" size="small">
                          <Iconify icon={showConfirm ? 'solar:eye-bold' : 'solar:eye-closed-bold'} width={18} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={!pwValid}
                  onClick={handleChangePassword}
                  startIcon={pwLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
                >
                  {pwLoading ? 'Updating…' : 'Update Password'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Notifications ────────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title="Notifications" subheader="Choose what alerts you receive" />
            <Divider />
            <CardContent>
              <Stack spacing={0.5}>
                {[
                  { label: 'New Bookings', sub: 'When a new booking is placed', state: notifBookings, set: setNotifBookings },
                  { label: 'Service Submissions', sub: 'When users submit a service form', state: notifSubmissions, set: setNotifSubmissions },
                  { label: 'Payments', sub: 'When a payment is received or refunded', state: notifPayments, set: setNotifPayments },
                  { label: 'New Reviews', sub: 'When a user leaves a review', state: notifReviews, set: setNotifReviews },
                ].map(({ label, sub, state, set }) => (
                  <Box key={label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>{label}</Typography>
                      <Typography variant="caption" color="text.secondary">{sub}</Typography>
                    </Box>
                    <Switch checked={state} onChange={(e) => set(e.target.checked)} color="primary" />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Danger Zone ──────────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ border: '1px solid', borderColor: 'error.light' }}>
            <CardHeader title="Danger Zone" subheader="Irreversible actions — proceed with caution" />
            <Divider />
            <CardContent>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>Sign out all devices</Typography>
                    <Typography variant="caption" color="text.secondary">Revoke all active sessions</Typography>
                  </Box>
                  <Button variant="outlined" color="warning" size="small" disabled={revokingAll} onClick={handleRevokeOthers}>
                    Sign Out All
                  </Button>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" fontWeight={500} color="error.main">Deactivate account</Typography>
                    <Typography variant="caption" color="text.secondary">Disable this admin account</Typography>
                  </Box>
                  <Button variant="outlined" color="error" size="small">Deactivate</Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Maintenance Mode ─────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ border: '1px solid', borderColor: maintenanceActive ? 'warning.light' : 'divider', transition: 'border-color 0.3s' }}>
            <CardHeader
              title="Maintenance Mode"
              subheader="Block all users and display a maintenance screen in the app"
              action={
                maintenanceActive === null || maintenanceLoading ? (
                  <CircularProgress size={24} sx={{ mr: 1, mt: 0.5 }} />
                ) : (
                  <Switch checked={maintenanceActive} onChange={handleMaintenanceToggle} color="warning" disabled={maintenanceLoading} />
                )
              }
            />
            <Divider />
            <CardContent>
              {maintenanceError && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setMaintenanceError(null)}>
                  {maintenanceError}
                </Alert>
              )}
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: maintenanceActive ? 'warning.lighter' : 'success.lighter', flexShrink: 0 }}>
                  <Iconify icon={maintenanceActive ? 'solar:restart-bold' : 'solar:check-circle-bold'} width={24} sx={{ color: maintenanceActive ? 'warning.dark' : 'success.dark' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {maintenanceActive ? 'Under Maintenance' : 'All Systems Live'}
                    </Typography>
                    <Chip size="small" variant="outlined" label={maintenanceActive ? 'Maintenance' : 'Live'} color={maintenanceActive ? 'warning' : 'success'} />
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {maintenanceActive
                      ? 'The app is in maintenance mode. All users see a maintenance screen.'
                      : 'The app is running normally. All users have full access.'}
                  </Typography>
                </Box>
              </Stack>
              {maintenanceActive && (
                <Alert severity="warning" sx={{ mt: 2 }} icon={<Iconify icon="solar:clock-circle-outline" width={20} />}>
                  <Typography variant="caption">
                    Users are currently blocked. Disable maintenance mode as soon as your work is complete.
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ── Admin Sessions ───────────────────────────────────────────── */}
        {superAdmin && (
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardHeader
                title="Admin Sessions"
                subheader="All currently active admin logins — revoke any session instantly"
                action={
                  sessions.filter((s) => !s.is_current).length > 0 && (
                    <Button size="small" variant="outlined" color="warning" disabled={revokingAll}
                      startIcon={revokingAll ? <CircularProgress size={12} color="inherit" /> : <Iconify icon="solar:restart-bold" width={14} />}
                      onClick={handleRevokeOthers}
                    >
                      Sign Out All Others
                    </Button>
                  )
                }
              />
              <Divider />
              {sessionsError && (
                <Alert severity="error" sx={{ mx: 2, mt: 2 }} onClose={() => setSessionsError(null)}>
                  {sessionsError}
                </Alert>
              )}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Admin</TableCell>
                      <TableCell>Device</TableCell>
                      <TableCell>IP / Location</TableCell>
                      <TableCell>Last Active</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sessionsLoading && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <CircularProgress size={24} />
                        </TableCell>
                      </TableRow>
                    )}
                    {!sessionsLoading && sessions.map((session) => (
                      <TableRow key={session.id} hover>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Avatar sx={{ width: 36, height: 36, fontSize: 14 }}>
                              {session.admin?.name?.[0]?.toUpperCase() ?? '?'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>{session.admin?.name ?? '—'}</Typography>
                              <Stack direction="row" alignItems="center" spacing={0.75}>
                                <Typography variant="caption" color="text.secondary">{session.admin?.email ?? '—'}</Typography>
                                {session.admin?.role && (
                                  <Chip label={session.admin.role.label} size="small" variant="outlined" color={session.admin.role.slug === 'super_admin' ? 'error' : 'default'} sx={{ height: 16, fontSize: 10 }} />
                                )}
                              </Stack>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{session.device ?? '—'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{session.location ?? session.ip_address ?? '—'}</Typography>
                          {session.location && session.ip_address && session.location !== session.ip_address && (
                            <Typography variant="caption" color="text.secondary">{session.ip_address}</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {session.is_current ? 'Now (you)' : session.last_used_at ? fToNow(session.last_used_at) : '—'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          {session.is_current ? (
                            <Chip label="Current" size="small" color="primary" variant="outlined" />
                          ) : (
                            <Button size="small" variant="outlined" color="error" disabled={revoking === session.id}
                              startIcon={revoking === session.id ? <CircularProgress size={12} color="inherit" /> : <Iconify icon="solar:trash-bin-trash-bold" width={14} />}
                              onClick={() => handleRevokeSession(session.id)}
                            >
                              Delete
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {!sessionsLoading && sessions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                          No active sessions
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {sessionsMeta && sessionsMeta.total > sessionsMeta.per_page && (
                <TablePagination
                  component="div"
                  count={sessionsMeta.total}
                  page={sessionsPage}
                  onPageChange={(_, newPage) => setSessionsPage(newPage)}
                  rowsPerPage={5}
                  rowsPerPageOptions={[5]}
                />
              )}
            </Card>
          </Grid>
        )}

        {/* ── App Updates ──────────────────────────────────────────────── */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title="App Updates" subheader="Control version gating — force or suggest updates to mobile users" />
            <Divider />
            <CardContent>
              {updateError && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setUpdateError(null)}>{updateError}</Alert>
              )}
              {updateSuccess && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setUpdateSuccess(false)}>Update settings saved.</Alert>
              )}
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>Update Type</Typography>
                  <ToggleButtonGroup
                    value={updateConfig.type}
                    exclusive
                    onChange={(_, v) => { if (v !== null) setUpdateConfig((prev) => ({ ...prev, type: v as string })); }}
                    size="small"
                  >
                    <ToggleButton value="none">None</ToggleButton>
                    <ToggleButton value="optional">Optional</ToggleButton>
                    <ToggleButton value="required">Required</ToggleButton>
                  </ToggleButtonGroup>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="iOS App Store URL" placeholder="https://apps.apple.com/app/id..." value={updateConfig.ios_store_url} onChange={(e) => setUpdateConfig((prev) => ({ ...prev, ios_store_url: e.target.value }))} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Google Play URL" placeholder="https://play.google.com/store/apps/details?id=..." value={updateConfig.android_store_url} onChange={(e) => setUpdateConfig((prev) => ({ ...prev, android_store_url: e.target.value }))} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="iOS Min Version" placeholder="1.0.0" value={updateConfig.ios_min_version} onChange={(e) => setUpdateConfig((prev) => ({ ...prev, ios_min_version: e.target.value }))} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Android Min Version" placeholder="1.0.0" value={updateConfig.android_min_version} onChange={(e) => setUpdateConfig((prev) => ({ ...prev, android_min_version: e.target.value }))} />
                  </Grid>
                </Grid>
                <TextField fullWidth label="Update Title" placeholder="Update Available" value={updateConfig.title} onChange={(e) => setUpdateConfig((prev) => ({ ...prev, title: e.target.value }))} />
                <TextField fullWidth multiline minRows={3} label="Update Message" placeholder="A new version of the app is available with improvements and fixes." value={updateConfig.message} onChange={(e) => setUpdateConfig((prev) => ({ ...prev, message: e.target.value }))} inputProps={{ maxLength: 1000 }} helperText={`${updateConfig.message.length}/1000`} />
                <Button variant="contained" color="primary" disabled={updateSaving} onClick={handleSaveUpdate}
                  startIcon={updateSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {updateSaving ? 'Saving…' : 'Save Update Settings'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ── In-App Alerts ────────────────────────────────────────────── */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader
              title="In-App Alerts"
              subheader="Dismissible notices shown to users in the app — max 1 active per frequency slot"
              action={
                <Button size="small" variant="contained" startIcon={<Iconify icon="mingcute:add-line" width={16} />} onClick={openCreateDialog}>
                  New Alert
                </Button>
              }
            />
            <Divider />
            {alertsError && (
              <Alert severity="error" sx={{ mx: 2, mt: 2 }} onClose={() => setAlertsError(null)}>{alertsError}</Alert>
            )}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Frequency</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alertsLoading && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  )}
                  {!alertsLoading && alerts.map((alert) => (
                    <TableRow key={alert.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>{alert.title}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {alert.message}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          variant="outlined"
                          label={alert.frequency === 'once_per_day' ? 'Once / day' : 'Every open'}
                          color={alert.frequency === 'once_per_day' ? 'info' : 'warning'}
                        />
                      </TableCell>
                      <TableCell>
                        {alert.image_url ? (
                          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                            <Box
                              component="img"
                              src={alert.image_url}
                              alt="alert"
                              sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover', border: '1px solid', borderColor: 'divider' }}
                            />
                            <Tooltip title="Remove image">
                              <IconButton
                                size="small"
                                onClick={() => handleRemoveImage(alert.id)}
                                disabled={imageRemoving === alert.id}
                                sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', width: 18, height: 18 }}
                              >
                                {imageRemoving === alert.id
                                  ? <CircularProgress size={10} />
                                  : <Iconify icon="mingcute:close-line" width={10} />
                                }
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ) : (
                          <Typography variant="caption" color="text.disabled">—</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={alert.is_active ? 'Active' : 'Inactive'}
                          color={alert.is_active ? 'success' : 'default'}
                          variant={alert.is_active ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">{fDate(alert.created_at)}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title={alert.is_active ? 'Deactivate' : 'Activate'}>
                            <span>
                              <IconButton size="small" onClick={() => handleToggleActive(alert)} disabled={toggling === alert.id}>
                                {toggling === alert.id
                                  ? <CircularProgress size={16} />
                                  : <Iconify icon={alert.is_active ? 'solar:eye-closed-bold' : 'solar:eye-bold'} width={18} sx={{ color: alert.is_active ? 'text.disabled' : 'success.main' }} />
                                }
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Upload image">
                            <span>
                              <IconButton size="small" onClick={() => handleImageUploadClick(alert.id)} disabled={imageUploading === alert.id}>
                                {imageUploading === alert.id
                                  ? <CircularProgress size={16} />
                                  : <Iconify icon="solar:share-bold" width={18} />
                                }
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => openEditDialog(alert)}>
                              <Iconify icon="solar:pen-bold" width={18} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => setDeleteTarget(alert)}>
                              <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!alertsLoading && alerts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No alerts created yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

      </Grid>

      {/* Hidden image file input */}
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        style={{ display: 'none' }}
        onChange={handleImageFileChange}
      />

      {/* ── Alert Create / Edit dialog ───────────────────────────────── */}
      <Dialog open={alertDialogOpen} onClose={closeAlertDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {alertDialogMode === 'create' ? 'New Alert' : 'Edit Alert'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {alertFormError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setAlertFormError(null)}>
              {alertFormError}
            </Alert>
          )}

          {/* Preview card */}
          <Box
            sx={{
              bgcolor: 'background.neutral',
              borderRadius: 2,
              p: 2,
              mb: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="caption" color="text.disabled" sx={{ mb: 1, display: 'block' }}>
              Preview
            </Typography>
            <Box sx={{ bgcolor: 'background.paper', borderRadius: 1.5, overflow: 'hidden', boxShadow: 1 }}>
              {editingAlert?.image_url && (
                <Box component="img" src={editingAlert.image_url} alt="alert preview" sx={{ width: '100%', maxHeight: 120, objectFit: 'cover' }} />
              )}
              <Box sx={{ p: 1.5 }}>
                <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>
                  {alertForm.title || 'Alert Title'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {alertForm.message || 'Your alert message will appear here…'}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Title"
              required
              value={alertForm.title}
              onChange={(e) => setAlertForm((prev) => ({ ...prev, title: e.target.value }))}
              inputProps={{ maxLength: 255 }}
            />
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Message"
              required
              value={alertForm.message}
              onChange={(e) => setAlertForm((prev) => ({ ...prev, message: e.target.value }))}
              inputProps={{ maxLength: 1000 }}
              helperText={`${alertForm.message.length}/1000`}
            />
            <Box>
              <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>Frequency</Typography>
              <ToggleButtonGroup
                value={alertForm.frequency}
                exclusive
                onChange={(_, v) => { if (v !== null) setAlertForm((prev) => ({ ...prev, frequency: v as 'once_per_day' | 'every_open' })); }}
                size="small"
              >
                <ToggleButton value="once_per_day">Once per day</ToggleButton>
                <ToggleButton value="every_open">Every open</ToggleButton>
              </ToggleButtonGroup>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Activating displaces any other active alert in the same frequency slot.
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={alertForm.is_active}
                  onChange={(e) => setAlertForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                  color="success"
                />
              }
              label={alertForm.is_active ? 'Active — users will see this alert' : 'Inactive — saved but not shown'}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={closeAlertDialog} color="inherit" disabled={alertFormSaving}>Cancel</Button>
          <Button
            variant="contained"
            disabled={alertFormSaving || !alertForm.title.trim() || !alertForm.message.trim()}
            onClick={handleSaveAlertForm}
            startIcon={alertFormSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {alertFormSaving ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete confirmation dialog ───────────────────────────────── */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Alert?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            <strong>"{deleteTarget?.title}"</strong> will be permanently removed. This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeleteTarget(null)} color="inherit" disabled={deleting}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            disabled={deleting}
            onClick={handleConfirmDelete}
            startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Maintenance enable confirmation ─────────────────────────── */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="solar:restart-bold" width={22} sx={{ color: 'warning.main' }} />
          Enable Maintenance Mode?
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This will immediately block <strong>all users</strong> from the app.
          </Alert>
          <Typography variant="body2" color="text.secondary">
            The app will display a maintenance screen to every user. Admin routes remain accessible.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setConfirmDialogOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleConfirmEnable} variant="contained" color="warning">Enable Maintenance</Button>
        </DialogActions>
      </Dialog>

    </DashboardContent>
  );
}
