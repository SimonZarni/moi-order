import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
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
  business_phone: string;
};

type DocKey = 'national_id' | 'business_registration' | 'bank_book' | 'storefront_photo';

type DocFiles = Record<DocKey, File | null>;

const EMPTY_FORM: FormState = {
  name:             '',
  email:            '',
  password:         '',
  business_name:    '',
  business_type:    '',
  business_address: '',
  business_phone:   '',
};

const EMPTY_DOCS: DocFiles = {
  national_id:           null,
  business_registration: null,
  bank_book:             null,
  storefront_photo:      null,
};

const DOC_LABELS: Record<DocKey, string> = {
  national_id:           'National ID / Passport',
  business_registration: 'Business Registration Certificate',
  bank_book:             'Bank Book / Bank Account Evidence',
  storefront_photo:      'Storefront Photo',
};

// ----------------------------------------------------------------------

export function CreateMerchantView() {
  const [form, setForm]               = useState<FormState>(EMPTY_FORM);
  const [docs, setDocs]               = useState<DocFiles>(EMPTY_DOCS);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving]           = useState(false);
  const [successMsg, setSuccessMsg]   = useState<string | null>(null);
  const [errorMsg, setErrorMsg]       = useState<string | null>(null);
  const [errors, setErrors]           = useState<Record<string, string>>({});

  const setField = useCallback((field: keyof FormState, value: string) => {
    setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setDoc = useCallback((key: DocKey, file: File | null) => {
    setErrors((prev) => { const n = { ...prev }; delete n[`documents.${key}`]; return n; });
    setDocs((prev) => ({ ...prev, [key]: file }));
  }, []);

  const handleSubmit = useCallback(() => {
    const errs: Record<string, string> = {};
    if (!form.name.trim())             errs.name             = 'Full name is required.';
    if (!form.email.trim())            errs.email            = 'Email is required.';
    if (!form.password)                errs.password         = 'Password is required.';
    if (!form.business_name.trim())    errs.business_name    = 'Business name is required.';
    if (!form.business_type.trim())    errs.business_type    = 'Business type is required.';
    if (!form.business_address.trim()) errs.business_address = 'Business address is required.';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
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
        business_phone:   form.business_phone.trim(),
        documents: {
          national_id:           docs.national_id           ?? undefined,
          business_registration: docs.business_registration ?? undefined,
          bank_book:             docs.bank_book             ?? undefined,
          storefront_photo:      docs.storefront_photo      ?? undefined,
        },
      })
      .then(() => {
        setSuccessMsg('Merchant account created successfully.');
        setForm(EMPTY_FORM);
        setDocs(EMPTY_DOCS);
        setErrors({});
      })
      .catch((err) => {
        if (err?.status === 422 && err?.errors) {
          const flat: Record<string, string> = {};
          Object.entries(err.errors as Record<string, string[]>).forEach(([k, v]) => {
            flat[k] = Array.isArray(v) ? v[0] : String(v);
          });
          setErrors(flat);
        } else {
          setErrorMsg(err?.message ?? 'Failed to create merchant account.');
        }
      })
      .finally(() => setSaving(false));
  }, [form, docs]);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Create Merchant Account
        </Typography>
      </Box>

      {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}
      {errorMsg   && <Alert severity="error"   sx={{ mb: 3 }}>{errorMsg}</Alert>}

      <Stack spacing={3} sx={{ maxWidth: 680 }}>

        {/* ── Account Details ─────────────────────────────────────── */}
        <Card>
          <CardHeader title="Account Details" />
          <Divider />
          <CardContent>
            <Stack spacing={2.5}>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Full Name"
                  required
                  fullWidth
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                />
                <TextField
                  label="Email Address"
                  required
                  type="email"
                  fullWidth
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Stack>
              <TextField
                label="Password"
                required
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setField('password', e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPassword((p) => !p)} edge="end">
                        <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} width={18} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* ── Business Details ─────────────────────────────────────── */}
        <Card>
          <CardHeader title="Business Details" />
          <Divider />
          <CardContent>
            <Stack spacing={2.5}>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Business Name"
                  required
                  fullWidth
                  value={form.business_name}
                  onChange={(e) => setField('business_name', e.target.value)}
                  error={!!errors.business_name}
                  helperText={errors.business_name}
                />
                <TextField
                  label="Business Type"
                  required
                  fullWidth
                  value={form.business_type}
                  onChange={(e) => setField('business_type', e.target.value)}
                  error={!!errors.business_type}
                  helperText={errors.business_type}
                  placeholder="e.g. Restaurant, Retail, Services"
                />
              </Stack>
              <TextField
                label="Business Phone"
                fullWidth
                value={form.business_phone}
                onChange={(e) => setField('business_phone', e.target.value)}
                error={!!errors.business_phone}
                helperText={errors.business_phone || 'Optional'}
                placeholder="+66 8X XXX XXXX"
              />
              <TextField
                label="Business Address"
                required
                fullWidth
                multiline
                rows={3}
                value={form.business_address}
                onChange={(e) => setField('business_address', e.target.value)}
                error={!!errors.business_address}
                helperText={errors.business_address}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* ── KYC Documents ────────────────────────────────────────── */}
        <Card>
          <CardHeader
            title="KYC Documents"
            subheader="Optional — admin-verified accounts may upload documents for record-keeping."
          />
          <Divider />
          <CardContent>
            <Stack spacing={2.5}>
              {(Object.keys(DOC_LABELS) as DocKey[]).map((key) => (
                <DocumentUploadBox
                  key={key}
                  label={DOC_LABELS[key]}
                  file={docs[key]}
                  error={errors[`documents.${key}`]}
                  onSelect={(file) => setDoc(key, file)}
                  onRemove={() => setDoc(key, null)}
                />
              ))}
            </Stack>
          </CardContent>
        </Card>

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
          {saving ? 'Creating…' : 'Create Merchant Account'}
        </Button>

      </Stack>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

interface DocumentUploadBoxProps {
  label: string;
  file: File | null;
  error?: string;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

function DocumentUploadBox({ label, file, error, onSelect, onRemove }: DocumentUploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 500 }}>
        {label}
      </Typography>

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onSelect(f);
          e.target.value = '';
        }}
      />

      {file ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 1.5,
            border: '1px solid',
            borderColor: 'success.main',
            borderRadius: 1,
            bgcolor: 'success.lighter',
            gap: 1,
          }}
        >
          <Iconify icon="solar:file-bold" width={20} sx={{ color: 'success.main', flexShrink: 0 }} />
          <Typography
            variant="body2"
            sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {file.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', flexShrink: 0 }}>
            {(file.size / 1024).toFixed(0)} KB
          </Typography>
          <IconButton size="small" onClick={onRemove} sx={{ flexShrink: 0 }}>
            <Iconify icon="mingcute:close-line" width={16} />
          </IconButton>
        </Box>
      ) : (
        <Box
          onClick={() => inputRef.current?.click()}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 2,
            border: '1.5px dashed',
            borderColor: error ? 'error.main' : 'divider',
            borderRadius: 1,
            cursor: 'pointer',
            transition: 'border-color 0.2s, background-color 0.2s',
            '&:hover': { borderColor: 'text.secondary', bgcolor: 'action.hover' },
          }}
        >
          <Iconify icon="mingcute:add-line" width={20} sx={{ color: 'text.disabled' }} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Click to upload &nbsp;·&nbsp; JPG, PNG, PDF &nbsp;·&nbsp; max 10 MB
          </Typography>
        </Box>
      )}

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
