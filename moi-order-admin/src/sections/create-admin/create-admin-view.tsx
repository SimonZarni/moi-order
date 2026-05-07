import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { sendAdminOtp, verifyAdminOtp, createAdminAccount } from 'src/api/roles';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Step = 'form' | 'otp' | 'success';

type FieldErrors = Record<string, string>;

// ----------------------------------------------------------------------

export function CreateAdminView() {
  const [step, setStep] = useState<Step>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [verifiedToken, setVerifiedToken] = useState('');
  const [resendAfter, setResendAfter] = useState(0);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const clearErrors = useCallback(() => {
    setGlobalError('');
    setFieldErrors({});
  }, []);

  const applyApiError = useCallback((err: unknown) => {
    const e = err as { message?: string; errors?: Record<string, string[]> };
    setGlobalError(e.message ?? 'Something went wrong.');
    if (e.errors) {
      const flat: FieldErrors = {};
      Object.entries(e.errors).forEach(([key, msgs]) => {
        flat[key] = msgs[0] ?? '';
      });
      setFieldErrors(flat);
    }
  }, []);

  const handleSendOtp = useCallback(async () => {
    clearErrors();
    setLoading(true);
    try {
      const result = await sendAdminOtp(email);
      setResendAfter(result.resend_after);
      setStep('otp');
    } catch (err) {
      applyApiError(err);
    } finally {
      setLoading(false);
    }
  }, [email, clearErrors, applyApiError]);

  const handleVerifyAndCreate = useCallback(async () => {
    clearErrors();
    setLoading(true);
    try {
      const token = verifiedToken || (await verifyAdminOtp(email, otp));
      if (!verifiedToken) setVerifiedToken(token);
      await createAdminAccount({ name, email, password, verified_token: token });
      setStep('success');
    } catch (err) {
      applyApiError(err);
    } finally {
      setLoading(false);
    }
  }, [verifiedToken, email, otp, name, password, clearErrors, applyApiError]);

  const handleResend = useCallback(async () => {
    clearErrors();
    setOtp('');
    setVerifiedToken('');
    setLoading(true);
    try {
      const result = await sendAdminOtp(email);
      setResendAfter(result.resend_after);
    } catch (err) {
      applyApiError(err);
    } finally {
      setLoading(false);
    }
  }, [email, clearErrors, applyApiError]);

  const handleReset = useCallback(() => {
    setStep('form');
    setName('');
    setEmail('');
    setPassword('');
    setOtp('');
    setVerifiedToken('');
    clearErrors();
  }, [clearErrors]);

  const formReady = name.trim() !== '' && email.trim() !== '' && password.trim() !== '';
  const otpReady = otp.trim().length === 6;

  // ── Success state ─────────────────────────────────────────────────────────

  if (step === 'success') {
    return (
      <DashboardContent>
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4">Create Admin Account</Typography>
          <Typography variant="body2" color="text.secondary">
            Super admin management
          </Typography>
        </Box>

        <Card sx={{ maxWidth: 480, mx: 'auto' }}>
          <CardContent sx={{ textAlign: 'center', py: 6, px: 4 }}>
            <Avatar
              sx={{
                width: 72,
                height: 72,
                mx: 'auto',
                mb: 3,
                bgcolor: 'success.lighter',
                color: 'success.dark',
              }}
            >
              <Iconify icon="eva:checkmark-fill" width={36} />
            </Avatar>

            <Typography variant="h5" gutterBottom>
              Account created successfully
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>{name}</strong> can now log in to the admin dashboard.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              {email}
            </Typography>

            <Label color="warning" sx={{ mb: 4 }}>Admin</Label>

            <Divider sx={{ my: 3 }} />

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="outlined" color="inherit" onClick={handleReset}>
                Create Another
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </DashboardContent>
    );
  }

  // ── Form + OTP ────────────────────────────────────────────────────────────

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4">Create Admin Account</Typography>
        <Typography variant="body2" color="text.secondary">
          Super admin management
        </Typography>
      </Box>

      {globalError && (
        <Alert severity="error" onClose={clearErrors} sx={{ mb: 3 }}>
          {globalError}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left info card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 5, pb: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mb: 2,
                  bgcolor: 'primary.lighter',
                  color: 'primary.dark',
                }}
              >
                <Iconify icon="solar:shield-keyhole-bold-duotone" width={40} />
              </Avatar>

              <Typography variant="h6" gutterBottom>
                New Admin
              </Typography>

              <Label color="warning" sx={{ mb: 3 }}>Admin Role</Label>

              <Divider sx={{ width: '100%', mb: 3 }} />

              <Stack spacing={2} sx={{ width: '100%' }}>
                {[
                  ['Role', 'Admin'],
                  ['Access', 'Dashboard only'],
                  ['Permissions', 'Assigned by Super Admin'],
                ].map(([label, value]) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">{label}</Typography>
                    <Typography variant="body2" fontWeight={500}>{value}</Typography>
                  </Box>
                ))}
              </Stack>

              {step === 'otp' && (
                <>
                  <Divider sx={{ width: '100%', my: 3 }} />
                  <Stack spacing={1} sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Name</Typography>
                      <Typography variant="body2" fontWeight={500}>{name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 130 }}>{email}</Typography>
                    </Box>
                  </Stack>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right form card */}
        <Grid size={{ xs: 12, md: 8 }}>
          {step === 'form' && (
            <Card>
              <CardHeader
                title="Account details"
                subheader="The new admin will log in with these credentials."
              />
              <Divider />
              <CardContent>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    error={Boolean(fieldErrors.name)}
                    helperText={fieldErrors.name}
                  />
                  <TextField
                    fullWidth
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    error={Boolean(fieldErrors.email)}
                    helperText={fieldErrors.email}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    error={Boolean(fieldErrors.password)}
                    helperText={fieldErrors.password ?? 'Minimum 8 characters.'}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      size="large"
                      variant="contained"
                      disabled={!formReady || loading}
                      onClick={handleSendOtp}
                      startIcon={
                        loading
                          ? <CircularProgress size={16} color="inherit" />
                          : <Iconify icon="solar:bell-bing-bold-duotone" width={18} />
                      }
                    >
                      {loading ? 'Sending OTP…' : 'Send OTP'}
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )}

          {step === 'otp' && (
            <Card>
              <CardHeader
                title="Verify email"
                subheader={`Enter the 6-digit code sent to ${email}.`}
              />
              <Divider />
              <CardContent>
                <Stack spacing={3}>
                  <Alert severity="info" icon={<Iconify icon="solar:bell-bing-bold-duotone" width={20} />}>
                    A verification code has been sent to <strong>{email}</strong>. Check your inbox.
                  </Alert>

                  <TextField
                    fullWidth
                    label="OTP code"
                    placeholder="000000"
                    inputProps={{ maxLength: 6, inputMode: 'numeric' }}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    disabled={loading}
                    error={Boolean(fieldErrors.otp)}
                    helperText={fieldErrors.otp ?? 'Code expires in 10 minutes.'}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Button
                        variant="text"
                        color="inherit"
                        size="small"
                        disabled={loading}
                        onClick={handleResend}
                        startIcon={<Iconify icon="solar:restart-bold" width={16} />}
                      >
                        Resend code
                      </Button>
                      <Typography variant="caption" color="text.disabled">
                        ({resendAfter}s cooldown)
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1.5}>
                      <Button
                        variant="outlined"
                        color="inherit"
                        disabled={loading}
                        onClick={handleReset}
                      >
                        Start over
                      </Button>
                      <Button
                        variant="contained"
                        disabled={!otpReady || loading}
                        onClick={handleVerifyAndCreate}
                        startIcon={
                          loading
                            ? <CircularProgress size={16} color="inherit" />
                            : <Iconify icon="eva:checkmark-fill" width={16} />
                        }
                      >
                        {loading ? 'Creating…' : 'Verify & Create'}
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
