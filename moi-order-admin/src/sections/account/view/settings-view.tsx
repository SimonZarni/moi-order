import { useState } from 'react';

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
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type DeviceSession = {
  id: string;
  username: string;
  account: string;
  browser: string;
  device: string;
  ip: string;
  location: string;
  lastActive: Date;
  isCurrent: boolean;
};

const MOCK_SESSIONS: DeviceSession[] = [
  { id: 's1', username: 'Admin User', account: 'admin@moiorder.com', browser: 'Chrome 124', device: 'MacBook Pro', ip: '192.168.1.42', location: 'Bangkok, Thailand', lastActive: new Date(), isCurrent: true },
  { id: 's2', username: 'Admin User', account: 'admin@moiorder.com', browser: 'Safari 17', device: 'iPhone 15 Pro', ip: '203.144.12.87', location: 'Bangkok, Thailand', lastActive: new Date(Date.now() - 3600000 * 2), isCurrent: false },
  { id: 's3', username: 'Admin User', account: 'admin@moiorder.com', browser: 'Firefox 125', device: 'Windows PC', ip: '58.11.220.5', location: 'Yangon, Myanmar', lastActive: new Date(Date.now() - 86400000 * 1), isCurrent: false },
  { id: 's4', username: 'Manager Ko', account: 'manager@moiorder.com', browser: 'Chrome 124', device: 'iPad Air', ip: '171.100.43.21', location: 'Vientiane, Laos', lastActive: new Date(Date.now() - 86400000 * 3), isCurrent: false },
];

const BROWSER_ICON: Record<string, string> = {
  Chrome: '/assets/icons/browsers/ic-chrome.svg',
  Safari: '/assets/icons/browsers/ic-safari.svg',
  Firefox: '/assets/icons/browsers/ic-firefox.svg',
};

const getBrowserKey = (browser: string) => Object.keys(BROWSER_ICON).find((k) => browser.startsWith(k)) ?? '';

// ----------------------------------------------------------------------

export function SettingsView() {
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
  const [sessions, setSessions] = useState<DeviceSession[]>(MOCK_SESSIONS);

  const pwMatch = newPw === confirmPw;
  const pwValid = currentPw.length > 0 && newPw.length >= 8 && pwMatch;

  const handleSignOutDevice = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSignOutAll = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
  };

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
                  <Button variant="outlined" color="warning" size="small" onClick={handleSignOutAll}>Sign Out All</Button>
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

        {/* Logged In Devices */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader
              title="Logged In Devices"
              subheader={`${sessions.length} active session${sessions.length !== 1 ? 's' : ''}`}
              action={
                sessions.filter((s) => !s.isCurrent).length > 0 && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="warning"
                    startIcon={<Iconify icon="solar:restart-bold" width={14} />}
                    onClick={handleSignOutAll}
                  >
                    Sign Out All Others
                  </Button>
                )
              }
            />
            <Divider />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Device / Browser</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>IP Address</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Last Active</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Avatar
                            sx={{ width: 36, height: 36, bgcolor: 'background.neutral' }}
                          >
                            <Iconify
                              icon={getBrowserKey(session.browser) === 'Safari' ? 'solar:eye-bold' : getBrowserKey(session.browser) === 'Firefox' ? 'solar:share-bold' : 'solar:settings-bold-duotone'}
                              width={18}
                              sx={{ color: 'text.secondary' }}
                            />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>{session.device}</Typography>
                            <Typography variant="caption" color="text.secondary">{session.browser}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>{session.username}</Typography>
                        <Typography variant="caption" color="text.secondary">{session.account}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{session.ip}</Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Iconify icon="solar:eye-bold" width={13} sx={{ color: 'text.disabled' }} />
                          <Typography variant="body2">{session.location}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{session.isCurrent ? 'Now' : fDate(session.lastActive)}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        {session.isCurrent
                          ? (
                            <Chip label="Current" size="small" color="primary" variant="outlined" />
                          )
                          : (
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<Iconify icon="mingcute:close-line" width={13} />}
                              onClick={() => handleSignOutDevice(session.id)}
                            >
                              Sign Out
                            </Button>
                          )
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                  {sessions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No active sessions
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>

    </DashboardContent>
  );
}
