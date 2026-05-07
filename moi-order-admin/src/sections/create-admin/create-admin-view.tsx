import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { sendAdminOtp, verifyAdminOtp, createAdminAccount } from 'src/api/roles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Step = 'form' | 'otp' | 'success';

type FieldErrors = Record<string, string>;

// ----------------------------------------------------------------------

export function CreateAdminView() {
  const router = useRouter();

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

  const formReady = name.trim() !== '' && email.trim() !== '' && password.trim() !== '';
  const otpReady = otp.trim().length === 6;

  if (step === 'success') {
    return (
      <DashboardContent>
        <Box sx={{ maxWidth: 480, mx: 'auto', mt: 8, textAlign: 'center' }}>
          <Iconify icon="eva:checkmark-fill" width={64} sx={{ color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Admin account created
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
            <strong>{name}</strong> can now log in at the admin dashboard using{' '}
            <strong>{email}</strong> and the password you set.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="outlined" onClick={() => router.push('/roles')}>
              View All Admins
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setStep('form');
                setName('');
                setEmail('');
                setPassword('');
                setOtp('');
                setVerifiedToken('');
              }}
            >
              Create Another
            </Button>
          </Stack>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Stack spacing={3} sx={{ maxWidth: 560, mx: 'auto' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Button
            size="small"
            color="inherit"
            startIcon={<Iconify icon="eva:arrow-ios-forward-fill" sx={{ transform: 'rotate(180deg)' }} />}
            onClick={() => router.back()}
          >
            Back
          </Button>
        </Stack>

        <Typography variant="h4">Create Admin Account</Typography>

        {globalError && (
          <Alert severity="error" onClose={clearErrors}>
            {globalError}
          </Alert>
        )}

        <Card>
          <CardHeader title="Account details" subheader="The new admin will log in with these credentials." />
          <Divider />
          <CardContent>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={step === 'otp' || loading}
                error={Boolean(fieldErrors.name)}
                helperText={fieldErrors.name}
              />
              <TextField
                fullWidth
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={step === 'otp' || loading}
                error={Boolean(fieldErrors.email)}
                helperText={fieldErrors.email}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={step === 'otp' || loading}
                error={Boolean(fieldErrors.password)}
                helperText={fieldErrors.password ?? 'Minimum 8 characters.'}
              />

              {step === 'form' && (
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  disabled={!formReady || loading}
                  onClick={handleSendOtp}
                  startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                >
                  {loading ? 'Sending OTP…' : 'Send OTP'}
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>

        {step === 'otp' && (
          <Card>
            <CardHeader
              title="Verify email"
              subheader={`Enter the 6-digit code sent to ${email}.`}
            />
            <Divider />
            <CardContent>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="OTP code"
                  inputProps={{ maxLength: 6, inputMode: 'numeric' }}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  disabled={loading}
                  error={Boolean(fieldErrors.otp)}
                  helperText={fieldErrors.otp ?? `Code expires in 10 minutes.`}
                />

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    size="large"
                    disabled={loading}
                    onClick={handleResend}
                    sx={{ flex: 1 }}
                  >
                    Resend
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    disabled={!otpReady || loading}
                    onClick={handleVerifyAndCreate}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                    sx={{ flex: 2 }}
                  >
                    {loading ? 'Creating…' : 'Verify & Create'}
                  </Button>
                </Stack>

                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Resend cooldown: {resendAfter} seconds.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>
    </DashboardContent>
  );
}
