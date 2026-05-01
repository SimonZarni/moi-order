import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { merchantsApi } from 'src/api/merchants';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type FormState = {
  name: string;
  email: string;
  password: string;
  business_name: string;
  business_type: string;
  business_address: string;
};

const EMPTY_FORM: FormState = {
  name:             '',
  email:            '',
  password:         '',
  business_name:    '',
  business_type:    '',
  business_address: '',
};

// ----------------------------------------------------------------------

export function CreateMerchantView() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const set = useCallback((field: keyof FormState, value: string) => {
    setFieldErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    const errors: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim())             errors.name             = 'Full name is required.';
    if (!form.email.trim())            errors.email            = 'Email is required.';
    if (!form.password)                errors.password         = 'Password is required.';
    if (!form.business_name.trim())    errors.business_name    = 'Business name is required.';
    if (!form.business_type.trim())    errors.business_type    = 'Business type is required.';
    if (!form.business_address.trim()) errors.business_address = 'Business address is required.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    merchantsApi
      .createMerchant({
        name:             form.name.trim(),
        email:            form.email.trim(),
        password:         form.password,
        business_name:    form.business_name.trim(),
        business_type:    form.business_type.trim(),
        business_address: form.business_address.trim(),
      })
      .then(() => {
        setSuccessMsg('Merchant account created. Credentials have been sent.');
        setForm(EMPTY_FORM);
        setFieldErrors({});
      })
      .catch((err) => {
        if (err?.response?.status === 422) {
          const errs = err.response.data?.errors ?? {};
          const flat: Partial<Record<keyof FormState, string>> = {};
          Object.entries(errs).forEach(([k, v]) => {
            flat[k as keyof FormState] = Array.isArray(v) ? v[0] : String(v);
          });
          setFieldErrors(flat);
        } else {
          setErrorMsg(err?.response?.data?.message ?? 'Failed to create merchant account.');
        }
      })
      .finally(() => setSaving(false));
  }, [form]);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Create Merchant Account
        </Typography>
      </Box>

      {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}
      {errorMsg && <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>}

      <Card sx={{ maxWidth: 640 }}>
        <CardHeader
          title="New Merchant"
          subheader="Create a merchant account directly, bypassing the KYC flow — for high-value partnerships."
        />
        <CardContent>
          <Stack spacing={2.5}>
            <TextField
              label="Full Name"
              required
              fullWidth
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              error={!!fieldErrors.name}
              helperText={fieldErrors.name}
            />
            <TextField
              label="Email"
              required
              type="email"
              fullWidth
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
            />
            <TextField
              label="Password"
              required
              fullWidth
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      <Iconify
                        icon={showPassword ? 'solar:eye-bold' : 'solar:eye-bold'}
                        width={18}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Business Name"
              required
              fullWidth
              value={form.business_name}
              onChange={(e) => set('business_name', e.target.value)}
              error={!!fieldErrors.business_name}
              helperText={fieldErrors.business_name}
            />
            <TextField
              label="Business Type"
              required
              fullWidth
              value={form.business_type}
              onChange={(e) => set('business_type', e.target.value)}
              error={!!fieldErrors.business_type}
              helperText={fieldErrors.business_type}
              placeholder="e.g. Restaurant, Retail, Services"
            />
            <TextField
              label="Business Address"
              required
              fullWidth
              multiline
              rows={3}
              value={form.business_address}
              onChange={(e) => set('business_address', e.target.value)}
              error={!!fieldErrors.business_address}
              helperText={fieldErrors.business_address}
            />
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleSubmit}
              disabled={saving}
              startIcon={
                saving
                  ? <CircularProgress size={16} color="inherit" />
                  : <Iconify icon="mingcute:add-line" />
              }
            >
              {saving ? 'Creating…' : 'Create Merchant'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </DashboardContent>
  );
}
