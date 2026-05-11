import { useState, useEffect, useCallback } from 'react';

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
import TablePagination from '@mui/material/TablePagination';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { fDate, fToNow } from 'src/utils/format-time';

import { settingsApi } from 'src/api/settings';
import { useAuth } from 'src/context/auth-context';
import { DashboardContent } from 'src/layouts/dashboard';
import { adminSessionsApi, type AdminSession, type AdminSessionMeta } from 'src/api/adminSessions';
import { appConfigApi, type AppAlertConfig, type AppUpdateConfig } from 'src/api/appConfig';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SettingsView() {
  const { isSuperAdmin } = useAuth();
  const superAdmin = isSuperAdmin();

  const [pwSaved, setPwSaved] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [notifBookings, setNotifBookings] = useState(true);
  const [notifSubmissions, setNotifSubmissions] = useState(true);
  const [notifPayments, setNotifPayments] = useState(true);
  const [notifReviews, setNotifReviews] = useState(false);

  // ── Admin Sessions (super-admin only) ────────────────────────────────────
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [sessionsMeta, setSessionsMeta] = useState<AdminSessionMeta | null>(null);
  const [sessionsPage, setSessionsPage] = useState(0); // MUI is 0-based; backend is 1-based
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

  // ── In-App Alert ──────────────────────────────────────────────────────────
  const [alertConfig, setAlertConfig] = useState<AppAlertConfig>({
    is_active: false,
    title: '',
    message: '',
    frequency: 'once_per_day',
  });
  const [alertSaving, setAlertSaving] = useState(false);
  const [alertError, setAlertError] = useState<string | null>(null);
  const [alertSuccess, setAlertSuccess] = useState(false);

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
      .then((data) => {
        setUpdateConfig(data.update);
        setAlertConfig(data.alert);
      })
      .catch(() => {
        // Non-fatal — admin can still edit; defaults will be saved on first save
      });
  }, []);

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
        alert_is_active:     alertConfig.is_active,
        alert_title:         alertConfig.title || null,
        alert_message:       alertConfig.message || null,
        alert_frequency:     alertConfig.frequency,
      })
      .then((data) => {
        setUpdateConfig(data.update);
        setUpdateSuccess(true);
      })
      .catch(() => setUpdateError('Failed to save update settings. Please try again.'))
      .finally(() => setUpdateSaving(false));
  }, [updateConfig, alertConfig]);

  const handleSaveAlert = useCallback(() => {
    setAlertSaving(true);
    setAlertError(null);
    setAlertSuccess(false);
    appConfigApi
      .update({
        ios_min_version:     updateConfig.ios_min_version || null,
        android_min_version: updateConfig.android_min_version || null,
        update_type:         updateConfig.type,
        update_title:        updateConfig.title || null,
        update_message:      updateConfig.message || null,
        ios_store_url:       updateConfig.ios_store_url || null,
        android_store_url:   updateConfig.android_store_url || null,
        alert_is_active:     alertConfig.is_active,
        alert_title:         alertConfig.title || null,
        alert_message:       alertConfig.message || null,
        alert_frequency:     alertConfig.frequency,
      })
      .then((data) => {
        setAlertConfig(data.alert);
        setAlertSuccess(true);
      })
      .catch(() => setAlertError('Failed to save alert settings. Please try again.'))
      .finally(() => setAlertSaving(false));
  }, [updateConfig, alertConfig]);

  const pwMatch = newPw === confirmPw;
  const pwValid = currentPw.length > 0 && newPw.length >= 8 && pwMatch;

  const handleRevokeSession = useCallback((tokenId: number) => {
    setRevoking(tokenId);
    setSessionsError(null);
    adminSessionsApi
      .revoke(tokenId)
      .then(() => {
        // If we just deleted the last row on a non-first page, step back.
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

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4">Settings</Typography>
        <Typography variant="body2" color="text.secondary">Manage your account security and preferences</Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Change Password */}
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
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
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
                  onClick={() => { setPwSaved(true); setCurrentPw(''); setNewPw(''); setConfirmPw(''); }}
                >
                  Update Password
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Change Email */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title="Change Email" subheader="Current: admin@moiorder.com" />
            <Divider />
            <CardContent>
              {emailSaved && (
                <Alert severity="success" sx={{ mb: 2.5 }} onClose={() => setEmailSaved(false)}>
                  Verification email sent. Please check your inbox.
                </Alert>
              )}
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  label="New Email Address"
                  type="email"
                  value={newEmail}
                  onChange={(e) => { setNewEmail(e.target.value); setEmailSaved(false); }}
                />
                <TextField
                  fullWidth
                  label="Confirm with Password"
                  type="password"
                  placeholder="Enter your current password"
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={!newEmail.includes('@')}
                  onClick={() => setEmailSaved(true)}
                >
                  Send Verification Email
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
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

        {/* Danger Zone */}
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
                  <Button variant="outlined" color="warning" size="small" onClick={handleRevokeOthers}>Sign Out All</Button>
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

        {/* Maintenance Mode */}
        <Grid size={{ xs: 12 }}>
          <Card
            sx={{
              border: '1px solid',
              borderColor: maintenanceActive ? 'warning.light' : 'divider',
              transition: 'border-color 0.3s',
            }}
          >
            <CardHeader
              title="Maintenance Mode"
              subheader="Block all users and display a maintenance screen in the app"
              action={
                maintenanceActive === null || maintenanceLoading ? (
                  <CircularProgress size={24} sx={{ mr: 1, mt: 0.5 }} />
                ) : (
                  <Switch
                    checked={maintenanceActive}
                    onChange={handleMaintenanceToggle}
                    color="warning"
                    disabled={maintenanceLoading}
                  />
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
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: maintenanceActive ? 'warning.lighter' : 'success.lighter',
                    flexShrink: 0,
                  }}
                >
                  <Iconify
                    icon={maintenanceActive ? 'solar:restart-bold' : 'solar:check-circle-bold'}
                    width={24}
                    sx={{ color: maintenanceActive ? 'warning.dark' : 'success.dark' }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {maintenanceActive ? 'Under Maintenance' : 'All Systems Live'}
                    </Typography>
                    <Chip
                      size="small"
                      variant="outlined"
                      label={maintenanceActive ? 'Maintenance' : 'Live'}
                      color={maintenanceActive ? 'warning' : 'success'}
                    />
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {maintenanceActive
                      ? 'The app is in maintenance mode. All users see a maintenance screen. Admin routes remain accessible.'
                      : 'The app is running normally. All users have full access to the service.'}
                  </Typography>
                </Box>
              </Stack>

              {maintenanceActive && (
                <Alert
                  severity="warning"
                  sx={{ mt: 2 }}
                  icon={<Iconify icon="solar:clock-circle-outline" width={20} />}
                >
                  <Typography variant="caption">
                    Users are currently blocked. Disable maintenance mode as soon as your work is complete.
                    The retry countdown shown in the app is set to <strong>60 minutes</strong>.
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Admin Sessions — super-admin only */}
        {superAdmin && (
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardHeader
                title="Admin Sessions"
                subheader="All currently active admin logins — revoke any session instantly"
                action={
                  sessions.filter((s) => !s.is_current).length > 0 && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="warning"
                      disabled={revokingAll}
                      startIcon={
                        revokingAll
                          ? <CircularProgress size={12} color="inherit" />
                          : <Iconify icon="solar:restart-bold" width={14} />
                      }
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
                              <Typography variant="body2" fontWeight={500}>
                                {session.admin?.name ?? '—'}
                              </Typography>
                              <Stack direction="row" alignItems="center" spacing={0.75}>
                                <Typography variant="caption" color="text.secondary">
                                  {session.admin?.email ?? '—'}
                                </Typography>
                                {session.admin?.role && (
                                  <Chip
                                    label={session.admin.role.label}
                                    size="small"
                                    variant="outlined"
                                    color={session.admin.role.slug === 'super_admin' ? 'error' : 'default'}
                                    sx={{ height: 16, fontSize: 10 }}
                                  />
                                )}
                              </Stack>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {session.device ?? '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {session.location ?? session.ip_address ?? '—'}
                          </Typography>
                          {session.location && session.ip_address && session.location !== session.ip_address && (
                            <Typography variant="caption" color="text.secondary">
                              {session.ip_address}
                            </Typography>
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
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              disabled={revoking === session.id}
                              startIcon={
                                revoking === session.id
                                  ? <CircularProgress size={12} color="inherit" />
                                  : <Iconify icon="solar:trash-bin-trash-bold" width={14} />
                              }
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
        {/* App Updates */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader
              title="App Updates"
              subheader="Control version gating — force or suggest updates to mobile users"
            />
            <Divider />
            <CardContent>
              {updateError && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setUpdateError(null)}>
                  {updateError}
                </Alert>
              )}
              {updateSuccess && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setUpdateSuccess(false)}>
                  Update settings saved successfully.
                </Alert>
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
                    <TextField
                      fullWidth
                      label="iOS App Store URL"
                      placeholder="https://apps.apple.com/app/id..."
                      value={updateConfig.ios_store_url}
                      onChange={(e) => setUpdateConfig((prev) => ({ ...prev, ios_store_url: e.target.value }))}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Google Play URL"
                      placeholder="https://play.google.com/store/apps/details?id=..."
                      value={updateConfig.android_store_url}
                      onChange={(e) => setUpdateConfig((prev) => ({ ...prev, android_store_url: e.target.value }))}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="iOS Min Version"
                      placeholder="1.0.0"
                      value={updateConfig.ios_min_version}
                      onChange={(e) => setUpdateConfig((prev) => ({ ...prev, ios_min_version: e.target.value }))}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Android Min Version"
                      placeholder="1.0.0"
                      value={updateConfig.android_min_version}
                      onChange={(e) => setUpdateConfig((prev) => ({ ...prev, android_min_version: e.target.value }))}
                    />
                  </Grid>
                </Grid>
                <TextField
                  fullWidth
                  label="Update Title"
                  placeholder="Update Available"
                  value={updateConfig.title}
                  onChange={(e) => setUpdateConfig((prev) => ({ ...prev, title: e.target.value }))}
                />
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Update Message"
                  placeholder="A new version of the app is available with improvements and fixes."
                  value={updateConfig.message}
                  onChange={(e) => setUpdateConfig((prev) => ({ ...prev, message: e.target.value }))}
                  inputProps={{ maxLength: 1000 }}
                  helperText={`${updateConfig.message.length}/1000`}
                />
                <Button
                  variant="contained"
                  color="primary"
                  disabled={updateSaving}
                  onClick={handleSaveUpdate}
                  startIcon={updateSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {updateSaving ? 'Saving…' : 'Save Update Settings'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* In-App Alert */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader
              title="In-App Alert"
              subheader="Display a dismissible notice to all users on app open"
              action={
                <Switch
                  checked={alertConfig.is_active}
                  onChange={(e) => setAlertConfig((prev) => ({ ...prev, is_active: e.target.checked }))}
                  color="primary"
                />
              }
            />
            <Divider />
            <CardContent>
              {alertError && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setAlertError(null)}>
                  {alertError}
                </Alert>
              )}
              {alertSuccess && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setAlertSuccess(false)}>
                  Alert settings saved successfully.
                </Alert>
              )}
              <Stack spacing={2.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>Alert Active</Typography>
                    <Typography variant="caption" color="text.secondary">
                      When enabled, the alert is shown to all users according to the frequency below
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={alertConfig.is_active}
                        onChange={(e) => setAlertConfig((prev) => ({ ...prev, is_active: e.target.checked }))}
                        color="primary"
                      />
                    }
                    label={alertConfig.is_active ? 'Active' : 'Inactive'}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>Frequency</Typography>
                  <ToggleButtonGroup
                    value={alertConfig.frequency}
                    exclusive
                    onChange={(_, v) => { if (v !== null) setAlertConfig((prev) => ({ ...prev, frequency: v as string })); }}
                    size="small"
                  >
                    <ToggleButton value="once_per_day">Once per day</ToggleButton>
                    <ToggleButton value="every_open">Every open</ToggleButton>
                  </ToggleButtonGroup>
                </Box>
                <TextField
                  fullWidth
                  label="Alert Title"
                  placeholder="Important Notice"
                  value={alertConfig.title}
                  onChange={(e) => setAlertConfig((prev) => ({ ...prev, title: e.target.value }))}
                />
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Alert Message"
                  placeholder="We have an important update for our users…"
                  value={alertConfig.message}
                  onChange={(e) => setAlertConfig((prev) => ({ ...prev, message: e.target.value }))}
                  inputProps={{ maxLength: 1000 }}
                  helperText={`${alertConfig.message.length}/1000`}
                />
                <Button
                  variant="contained"
                  color="primary"
                  disabled={alertSaving}
                  onClick={handleSaveAlert}
                  startIcon={alertSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {alertSaving ? 'Saving…' : 'Save Alert Settings'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* Maintenance enable confirmation */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="solar:restart-bold" width={22} sx={{ color: 'warning.main' }} />
          Enable Maintenance Mode?
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This will immediately block <strong>all users</strong> from the app.
          </Alert>
          <Typography variant="body2" color="text.secondary">
            The app will display a maintenance screen to every user. Requests to all API endpoints
            will return a 503 response. Admin routes and the health check endpoint remain accessible.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
            Make sure you are ready to take the service down before confirming.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setConfirmDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmEnable} variant="contained" color="warning">
            Enable Maintenance
          </Button>
        </DialogActions>
      </Dialog>

    </DashboardContent>
  );
}
