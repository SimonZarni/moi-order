import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Iconify } from 'src/components/iconify';

import {
  STATUS_COLORS,
  STATUS_LABELS,
  DOCUMENT_CATEGORIES,
  DOCUMENT_CATEGORY_LABELS,
} from '../../shared/tb-mock-store';

import type { TBClient, StatusLevel, CompanyDocumentCategory } from '../../shared/tb-mock-store';

// ----------------------------------------------------------------------

type FormDirector = {
  id: string;
  name: string;
  nationality: string;
  position: string;
  hasVisa: boolean;
  visaType: string;
  visaExpiry: string;
  workPermit: boolean;
};

type FormState = {
  companyName: string;
  thaiRegNumber: string;
  registrationDate: string;
  clientName: string;
  clientPhone: string;
  notes: string;
  taxStatus: StatusLevel;
  companyStatus: StatusLevel;
  directorVisaStatus: StatusLevel;
  vatRegistered: boolean;
  monthlyAccounting: boolean;
  clientAppAccess: boolean;
  clientEmail: string;
  clientPassword: string;
  clientPasswordConfirm: string;
};

type FormErrors = Partial<Record<keyof FormState | 'directors', string>>;

// ----------------------------------------------------------------------

const INITIAL_FORM: FormState = {
  companyName: '',
  thaiRegNumber: '',
  registrationDate: '',
  clientName: '',
  clientPhone: '',
  notes: '',
  taxStatus: 'good',
  companyStatus: 'good',
  directorVisaStatus: 'good',
  vatRegistered: false,
  monthlyAccounting: false,
  clientAppAccess: false,
  clientEmail: '',
  clientPassword: '',
  clientPasswordConfirm: '',
};

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ----------------------------------------------------------------------

function StatusSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: StatusLevel;
  onChange: (val: StatusLevel) => void;
}) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value as StatusLevel)}
        renderValue={(val) => (
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: STATUS_COLORS[val as StatusLevel], flexShrink: 0 }} />
            <span>{STATUS_LABELS[val as StatusLevel]}</span>
          </Stack>
        )}
      >
        {(['good', 'warning', 'critical'] as StatusLevel[]).map((lvl) => (
          <MenuItem key={lvl} value={lvl}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: STATUS_COLORS[lvl], flexShrink: 0 }} />
              <span>{STATUS_LABELS[lvl]}</span>
            </Stack>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

// ----------------------------------------------------------------------

function DirectorRow({
  director,
  onChange,
  onRemove,
}: {
  director: FormDirector;
  onChange: (id: string, field: string, val: string | boolean) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="subtitle2">Director</Typography>
        <IconButton size="small" color="error" onClick={() => onRemove(director.id)}>
          <Iconify icon="solar:trash-bin-trash-bold" width={18} />
        </IconButton>
      </Stack>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Director Name *"
            value={director.name}
            onChange={(e) => onChange(director.id, 'name', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Nationality"
            value={director.nationality}
            onChange={(e) => onChange(director.id, 'nationality', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            size="small"
            label="Position / Title"
            value={director.position}
            onChange={(e) => onChange(director.id, 'position', e.target.value)}
          />
        </Grid>
      </Grid>

      <FormControlLabel
        control={
          <Switch
            size="small"
            checked={director.hasVisa}
            onChange={(e) => onChange(director.id, 'hasVisa', e.target.checked)}
          />
        }
        label={<Typography variant="caption">Has Visa / Work Permit</Typography>}
        sx={{ mt: 1.5 }}
      />

      {director.hasVisa && (
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Visa Type"
              placeholder="e.g. Non-B"
              value={director.visaType}
              onChange={(e) => onChange(director.id, 'visaType', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Visa Expiry"
              value={director.visaExpiry}
              onChange={(e) => onChange(director.id, 'visaExpiry', e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={director.workPermit}
                  onChange={(e) => onChange(director.id, 'workPermit', e.target.checked)}
                />
              }
              label={<Typography variant="caption">Work Permit</Typography>}
            />
          </Grid>
        </Grid>
      )}
    </Paper>
  );
}

// ----------------------------------------------------------------------

function DocumentUploadRow({
  category,
  fileName,
  onSelect,
}: {
  category: CompanyDocumentCategory;
  fileName: string;
  onSelect: (category: CompanyDocumentCategory, name: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onSelect(category, file.name);
      e.target.value = '';
    },
    [category, onSelect]
  );

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
        <Iconify
          icon={fileName ? 'solar:check-circle-bold' : 'eva:done-all-fill'}
          width={18}
          sx={{ color: fileName ? '#10B981' : 'text.disabled', flexShrink: 0 }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2">{DOCUMENT_CATEGORY_LABELS[category]}</Typography>
          {fileName && (
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
              {fileName}
            </Typography>
          )}
        </Box>
      </Stack>

      <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" hidden onChange={handleChange} />

      <Button
        size="small"
        variant={fileName ? 'outlined' : 'contained'}
        color={fileName ? 'success' : 'primary'}
        onClick={handleClick}
        startIcon={<Iconify icon="mingcute:add-line" width={14} />}
        sx={{ flexShrink: 0, ml: 2 }}
      >
        {fileName ? 'Replace' : 'Upload'}
      </Button>
    </Stack>
  );
}

// ----------------------------------------------------------------------

export type TBCompanyFormDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<TBClient, 'id' | 'history' | 'dbdUrl'>) => void;
};

export function TBCompanyFormDialog({ open, onClose, onSubmit }: TBCompanyFormDialogProps) {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [directors, setDirectors] = useState<FormDirector[]>([]);
  const [docFiles, setDocFiles] = useState<Partial<Record<CompanyDocumentCategory, string>>>({});
  const [errors, setErrors] = useState<FormErrors>({});

  const handleFormChange = useCallback(
    (field: keyof FormState, value: string | boolean | StatusLevel) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const handleAddDirector = useCallback(() => {
    setDirectors((prev) => [
      ...prev,
      { id: genId(), name: '', nationality: '', position: '', hasVisa: false, visaType: '', visaExpiry: '', workPermit: false },
    ]);
  }, []);

  const handleRemoveDirector = useCallback((id: string) => {
    setDirectors((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const handleDirectorChange = useCallback((id: string, field: string, val: string | boolean) => {
    setDirectors((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: val } : d)));
  }, []);

  const handleDocSelect = useCallback((category: CompanyDocumentCategory, name: string) => {
    setDocFiles((prev) => ({ ...prev, [category]: name }));
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    if (!form.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!form.thaiRegNumber.trim()) newErrors.thaiRegNumber = 'Registration number is required';
    if (!form.registrationDate) newErrors.registrationDate = 'Registration date is required';
    if (!form.clientName.trim()) newErrors.clientName = 'Client name is required';
    if (!form.clientPhone.trim()) newErrors.clientPhone = 'Client phone is required';
    if (directors.some((d) => !d.name.trim())) newErrors.directors = 'All directors must have a name';
    if (form.clientAppAccess) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail);
      if (!form.clientEmail.trim()) newErrors.clientEmail = 'Email is required';
      else if (!emailOk) newErrors.clientEmail = 'Enter a valid email address';
      if (!form.clientPassword) newErrors.clientPassword = 'Password is required';
      else if (form.clientPassword.length < 8) newErrors.clientPassword = 'Minimum 8 characters';
      if (form.clientPassword && form.clientPassword !== form.clientPasswordConfirm) {
        newErrors.clientPasswordConfirm = 'Passwords do not match';
      }
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.companyName || newErrors.thaiRegNumber || newErrors.registrationDate || newErrors.clientName || newErrors.clientPhone) {
        setTab(0);
      } else if (newErrors.directors) {
        setTab(1);
      } else if (newErrors.clientEmail || newErrors.clientPassword || newErrors.clientPasswordConfirm) {
        setTab(3);
      }
    }
    return Object.keys(newErrors).length === 0;
  }, [form, directors]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;

    const documents = DOCUMENT_CATEGORIES.filter((cat) => docFiles[cat]).map((cat) => ({
      id: genId(),
      category: cat,
      fileName: docFiles[cat]!,
      uploadedAt: new Date().toISOString(),
    }));

    onSubmit({
      companyName: form.companyName.trim(),
      thaiRegNumber: form.thaiRegNumber.trim(),
      registrationDate: form.registrationDate,
      clientName: form.clientName.trim(),
      clientPhone: form.clientPhone.trim(),
      notes: form.notes.trim() || undefined,
      directors: directors.map((d) => ({
        id: d.id,
        name: d.name.trim(),
        nationality: d.nationality.trim(),
        position: d.position.trim(),
        ...(d.hasVisa && d.visaType ? { visaType: d.visaType } : {}),
        ...(d.hasVisa && d.visaExpiry ? { visaExpiry: d.visaExpiry } : {}),
        ...(d.hasVisa ? { workPermit: d.workPermit } : {}),
      })),
      taxStatus: form.taxStatus,
      companyStatus: form.companyStatus,
      directorVisaStatus: form.directorVisaStatus,
      vatRegistered: form.vatRegistered,
      monthlyAccounting: form.monthlyAccounting,
      documents,
      clientAppAccess: form.clientAppAccess,
      ...(form.clientAppAccess && form.clientEmail ? { clientEmail: form.clientEmail.trim() } : {}),
      clientPasswordSet: form.clientAppAccess && form.clientPassword.length >= 8,
    });

    // Reset form
    setForm(INITIAL_FORM);
    setDirectors([]);
    setDocFiles({});
    setErrors({});
    setTab(0);
  }, [form, directors, docFiles, validate, onSubmit]);

  const handleClose = useCallback(() => {
    setForm(INITIAL_FORM);
    setDirectors([]);
    setDocFiles({});
    setErrors({});
    setTab(0);
    onClose();
  }, [onClose]);

  const hasTabError = useCallback(
    (tabIndex: number): boolean => {
      if (tabIndex === 0) return !!(errors.companyName || errors.thaiRegNumber || errors.registrationDate || errors.clientName || errors.clientPhone);
      if (tabIndex === 1) return !!errors.directors;
      if (tabIndex === 3) return !!(errors.clientEmail || errors.clientPassword || errors.clientPasswordConfirm);
      return false;
    },
    [errors]
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 0 }}>Add Company</DialogTitle>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ px: 3, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Tab label={<Stack direction="row" spacing={0.5} alignItems="center"><span>Company & Client</span>{hasTabError(0) && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'error.main' }} />}</Stack>} />
        <Tab label={<Stack direction="row" spacing={0.5} alignItems="center"><span>Directors ({directors.length})</span>{hasTabError(1) && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'error.main' }} />}</Stack>} />
        <Tab label="Status & Documents" />
        <Tab label={<Stack direction="row" spacing={0.5} alignItems="center"><span>Client Access</span>{hasTabError(3) && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'error.main' }} />}</Stack>} />
      </Tabs>

      <DialogContent dividers sx={{ minHeight: 440, maxHeight: '60vh' }}>

        {/* Tab 0: Company & Client */}
        {tab === 0 && (
          <Stack spacing={2.5}>
            <Typography variant="subtitle2" color="text.secondary">Company Information</Typography>

            <TextField
              fullWidth
              label="Company Name (Thai) *"
              value={form.companyName}
              onChange={(e) => handleFormChange('companyName', e.target.value)}
              error={!!errors.companyName}
              helperText={errors.companyName}
              placeholder="บริษัท ... จำกัด"
            />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 7 }}>
                <TextField
                  fullWidth
                  label="Thai Registration Number *"
                  value={form.thaiRegNumber}
                  onChange={(e) => handleFormChange('thaiRegNumber', e.target.value)}
                  error={!!errors.thaiRegNumber}
                  helperText={errors.thaiRegNumber}
                  placeholder="0105565000000"
                  slotProps={{ input: { sx: { fontFamily: 'monospace' } } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 5 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Registration Date *"
                  value={form.registrationDate}
                  onChange={(e) => handleFormChange('registrationDate', e.target.value)}
                  error={!!errors.registrationDate}
                  helperText={errors.registrationDate}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
            </Grid>

            <Divider />
            <Typography variant="subtitle2" color="text.secondary">
              Client Details
              <Typography component="span" variant="caption" color="text.disabled" sx={{ ml: 1 }}>
                (person requesting on behalf of the company)
              </Typography>
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Client Name *"
                  value={form.clientName}
                  onChange={(e) => handleFormChange('clientName', e.target.value)}
                  error={!!errors.clientName}
                  helperText={errors.clientName}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Client Phone *"
                  value={form.clientPhone}
                  onChange={(e) => handleFormChange('clientPhone', e.target.value)}
                  error={!!errors.clientPhone}
                  helperText={errors.clientPhone}
                  placeholder="+66 8X XXX XXXX"
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes"
              value={form.notes}
              onChange={(e) => handleFormChange('notes', e.target.value)}
              placeholder="Internal notes, BOI status, special requirements…"
            />
          </Stack>
        )}

        {/* Tab 1: Directors */}
        {tab === 1 && (
          <Stack spacing={2}>
            {errors.directors && (
              <Alert severity="error" sx={{ mb: 1 }}>{errors.directors}</Alert>
            )}

            {directors.length === 0 && (
              <Paper
                elevation={0}
                sx={{ p: 4, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 1.5 }}
              >
                <Typography variant="body2" color="text.disabled" sx={{ mb: 2 }}>
                  No directors added yet.
                </Typography>
              </Paper>
            )}

            {directors.map((director) => (
              <DirectorRow
                key={director.id}
                director={director}
                onChange={handleDirectorChange}
                onRemove={handleRemoveDirector}
              />
            ))}

            <Button
              variant="outlined"
              startIcon={<Iconify icon="mingcute:add-line" width={16} />}
              onClick={handleAddDirector}
              sx={{ alignSelf: 'flex-start' }}
            >
              Add Director
            </Button>
          </Stack>
        )}

        {/* Tab 2: Status & Documents */}
        {tab === 2 && (
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Company Status
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <StatusSelect label="Company Tax Status" value={form.taxStatus} onChange={(v) => handleFormChange('taxStatus', v)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <StatusSelect label="Company Status" value={form.companyStatus} onChange={(v) => handleFormChange('companyStatus', v)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <StatusSelect label="Director Visa Status" value={form.directorVisaStatus} onChange={(v) => handleFormChange('directorVisaStatus', v)} />
                </Grid>
              </Grid>

              <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                <FormControlLabel
                  control={<Switch checked={form.vatRegistered} onChange={(e) => handleFormChange('vatRegistered', e.target.checked)} color="success" />}
                  label="VAT Registered"
                />
                <FormControlLabel
                  control={<Switch checked={form.monthlyAccounting} onChange={(e) => handleFormChange('monthlyAccounting', e.target.checked)} />}
                  label="Monthly Accounting"
                />
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Documents
              </Typography>
              <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 2 }}>
                Upload available documents. You can add more later from the company detail view.
              </Typography>

              <Stack divider={<Divider />}>
                {DOCUMENT_CATEGORIES.map((cat) => (
                  <DocumentUploadRow
                    key={cat}
                    category={cat}
                    fileName={docFiles[cat] ?? ''}
                    onSelect={handleDocSelect}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        )}

        {/* Tab 3: Client Access */}
        {tab === 3 && (
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Client App Access
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                When enabled, the client will receive login credentials to access their company
                portal on the mobile app.
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.clientAppAccess}
                    onChange={(e) => {
                      handleFormChange('clientAppAccess', e.target.checked);
                      if (!e.target.checked) {
                        handleFormChange('clientEmail', '');
                        handleFormChange('clientPassword', '');
                        handleFormChange('clientPasswordConfirm', '');
                      }
                    }}
                  />
                }
                label="Enable Client App Access"
              />
            </Box>

            {form.clientAppAccess && (
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  type="email"
                  label="Client Email *"
                  value={form.clientEmail}
                  onChange={(e) => handleFormChange('clientEmail', e.target.value)}
                  error={!!errors.clientEmail}
                  helperText={errors.clientEmail ?? 'This email will be used to log in to the mobile app'}
                  placeholder="client@company.com"
                />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Password *"
                      value={form.clientPassword}
                      onChange={(e) => handleFormChange('clientPassword', e.target.value)}
                      error={!!errors.clientPassword}
                      helperText={errors.clientPassword ?? 'Minimum 8 characters'}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Confirm Password *"
                      value={form.clientPasswordConfirm}
                      onChange={(e) => handleFormChange('clientPasswordConfirm', e.target.value)}
                      error={!!errors.clientPasswordConfirm}
                      helperText={errors.clientPasswordConfirm}
                    />
                  </Grid>
                </Grid>
              </Stack>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Stack direction="row" spacing={1}>
          {tab > 0 && (
            <Button variant="outlined" onClick={() => setTab((v) => v - 1)}>
              Back
            </Button>
          )}
          {tab < 3 ? (
            <Button variant="contained" onClick={() => setTab((v) => v + 1)}>
              Next
            </Button>
          ) : (
            <Button variant="contained" onClick={handleSubmit}>
              Add Company
            </Button>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
