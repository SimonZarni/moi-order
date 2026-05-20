import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';

import { useAuth } from 'src/context/auth-context';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { tbStore } from '../../shared/tb-mock-store';

import type { ClientType, TBIndividualClient } from '../../shared/tb-mock-store';

// ----------------------------------------------------------------------

type VisaStatus = 'active' | 'expiring_soon' | 'expired';

function getVisaStatus(expiry?: string): VisaStatus {
  if (!expiry) return 'active';
  const days = Math.ceil((new Date(expiry).getTime() - Date.now()) / 86_400_000);
  if (days < 0) return 'expired';
  if (days <= 60) return 'expiring_soon';
  return 'active';
}

const VISA_STATUS_LABEL: Record<VisaStatus, string> = {
  active: 'Active',
  expiring_soon: 'Expiring Soon',
  expired: 'Expired',
};
const VISA_STATUS_COLOR: Record<VisaStatus, string> = {
  active: '#10B981',
  expiring_soon: '#F59E0B',
  expired: '#EF4444',
};
const VISA_STATUS_BG: Record<VisaStatus, string> = {
  active: '#D1FAE5',
  expiring_soon: '#FEF3C7',
  expired: '#FEE2E2',
};
const VISA_STATUS_TEXT: Record<VisaStatus, string> = {
  active: '#065F46',
  expiring_soon: '#92400E',
  expired: '#991B1B',
};

// ----------------------------------------------------------------------

type AddClientForm = {
  name: string;
  nationality: string;
  phone: string;
  email: string;
  passportNo: string;
  companyId: string;
  visaType: string;
  visaExpiry: string;
  workPermit: boolean;
  clientType: ClientType;
  notes: string;
};

const INITIAL_FORM: AddClientForm = {
  name: '', nationality: '', phone: '', email: '', passportNo: '',
  companyId: '', visaType: '', visaExpiry: '', workPermit: false,
  clientType: 'visa_only', notes: '',
};

function genId() { return `person-${Date.now()}`; }

function AddClientDialog({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (c: TBIndividualClient) => void }) {
  const [form, setForm] = useState<AddClientForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof AddClientForm, string>>>({});

  const handleChange = useCallback(<K extends keyof AddClientForm>(field: K, value: AddClientForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const validate = useCallback((): boolean => {
    const e: Partial<Record<keyof AddClientForm, string>> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.nationality.trim()) e.nationality = 'Nationality is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;
    const selectedCompany = tbStore.clients.find((c) => c.id === form.companyId);
    onSubmit({
      id: genId(),
      name: form.name.trim(),
      nationality: form.nationality.trim(),
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      passportNo: form.passportNo.trim() || undefined,
      companyId: form.companyId || undefined,
      companyName: selectedCompany?.companyName,
      visaType: form.visaType.trim() || undefined,
      visaExpiry: form.visaExpiry || undefined,
      workPermit: form.workPermit,
      clientType: form.companyId ? 'company_linked' : 'visa_only',
      notes: form.notes.trim() || undefined,
    });
    setForm(INITIAL_FORM);
    setErrors({});
  }, [form, validate, onSubmit]);

  const handleClose = useCallback(() => {
    setForm(INITIAL_FORM);
    setErrors({});
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Client</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5}>
          <Typography variant="subtitle2" color="text.secondary">Personal Details</Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField fullWidth label="Full Name *" value={form.name} onChange={(e) => handleChange('name', e.target.value)} error={!!errors.name} helperText={errors.name} />
            <TextField fullWidth label="Nationality *" value={form.nationality} onChange={(e) => handleChange('nationality', e.target.value)} error={!!errors.nationality} helperText={errors.nationality} placeholder="Thai, British…" />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField fullWidth size="small" label="Phone" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+66 8X XXX XXXX" />
            <TextField fullWidth size="small" label="Email" type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
          </Stack>

          <TextField fullWidth size="small" label="Passport No." value={form.passportNo} onChange={(e) => handleChange('passportNo', e.target.value)} />

          <Divider />
          <Typography variant="subtitle2" color="text.secondary">Company Linkage</Typography>

          <FormControl fullWidth size="small">
            <InputLabel>Linked Company (optional)</InputLabel>
            <Select value={form.companyId} label="Linked Company (optional)" onChange={(e) => handleChange('companyId', e.target.value)}>
              <MenuItem value=""><em>None — Visa Only</em></MenuItem>
              {tbStore.clients.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  <Box>
                    <Typography variant="body2">{c.companyName}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>{c.thaiRegNumber}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider />
          <Typography variant="subtitle2" color="text.secondary">Visa / Work Permit</Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField fullWidth size="small" label="Visa Type" value={form.visaType} onChange={(e) => handleChange('visaType', e.target.value)} placeholder="Non-B, Non-O…" />
            <TextField fullWidth size="small" type="date" label="Visa Expiry" value={form.visaExpiry} onChange={(e) => handleChange('visaExpiry', e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
          </Stack>

          <FormControlLabel
            control={<Switch checked={form.workPermit} onChange={(e) => handleChange('workPermit', e.target.checked)} />}
            label="Has Work Permit"
          />

          <TextField fullWidth size="small" multiline rows={2} label="Notes" value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} placeholder="Internal notes…" />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Add Client</Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

export function TBPeopleView() {
  const router = useRouter();
  const { isSuperAdmin } = useAuth();
  const canEdit = isSuperAdmin();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<ClientType | 'all'>('all');
  const [addOpen, setAddOpen] = useState(false);
  const [rows, setRows] = useState<TBIndividualClient[]>(() => [...tbStore.individualClients]);
  const [notification, setNotification] = useState<string | null>(null);

  const handleAddClient = useCallback((client: TBIndividualClient) => {
    tbStore.individualClients.push(client);
    setRows([...tbStore.individualClients]);
    setAddOpen(false);
    setNotification(`Client "${client.name}" added.`);
  }, []);

  const filtered = rows.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.nationality.toLowerCase().includes(search.toLowerCase()) ||
      (r.companyName?.toLowerCase() ?? '').includes(search.toLowerCase());
    const matchType = filterType === 'all' || r.clientType === filterType;
    return matchSearch && matchType;
  });

  return (
    <DashboardContent maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Clients</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Individual clients — linked to a company or visa/work permit only.
          </Typography>
        </Box>
        {canEdit && (
          <Button variant="contained" startIcon={<Iconify icon="mingcute:add-line" width={18} />} onClick={() => setAddOpen(true)}>
            Add Client
          </Button>
        )}
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, nationality, or company…"
          size="small"
          sx={{ maxWidth: 420 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" width={18} sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <Stack direction="row" spacing={0.75}>
          {(['all', 'company_linked', 'visa_only'] as const).map((t) => (
            <Chip
              key={t}
              size="small"
              label={t === 'all' ? 'All' : t === 'company_linked' ? 'Company Linked' : 'Visa Only'}
              onClick={() => setFilterType(t)}
              variant={filterType === t ? 'filled' : 'outlined'}
              color={filterType === t ? 'primary' : 'default'}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Stack>
      </Stack>

      <Scrollbar>
        <TableContainer sx={{ minWidth: 900 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Nationality</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Visa Type</TableCell>
                <TableCell>Visa Expiry</TableCell>
                <TableCell>Work Permit</TableCell>
                <TableCell>Visa Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.disabled">No clients found.</Typography>
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((row) => {
                const vsKey = getVisaStatus(row.visaExpiry);
                return (
                  <TableRow key={row.id} hover onClick={() => router.push(`/tb/people/${row.id}`)} sx={{ cursor: 'pointer' }}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="fontWeightMedium">{row.name}</Typography>
                      {row.phone && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{row.phone}</Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{row.nationality}</Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={row.clientType === 'company_linked' ? 'Company Linked' : 'Visa Only'}
                        sx={{
                          fontSize: 11,
                          bgcolor: row.clientType === 'company_linked' ? '#E0E7FF' : '#F3F4F6',
                          color: row.clientType === 'company_linked' ? '#3730A3' : '#374151',
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ maxWidth: 200 }}>
                      {row.companyName ? (
                        <Tooltip title={row.companyName}>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {row.companyName}
                          </Typography>
                        </Tooltip>
                      ) : (
                        <Typography variant="body2" color="text.disabled">—</Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      {row.visaType ? (
                        <Typography variant="body2">{row.visaType}</Typography>
                      ) : (
                        <Typography variant="body2" color="text.disabled">—</Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      {row.visaExpiry ? (
                        <Typography variant="body2" sx={{ color: VISA_STATUS_COLOR[vsKey] }}>
                          {fDate(row.visaExpiry)}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.disabled">—</Typography>
                      )}
                    </TableCell>

                    <TableCell align="center">
                      {row.workPermit !== undefined ? (
                        <Typography variant="body2" sx={{ color: row.workPermit ? '#10B981' : 'text.disabled' }}>
                          {row.workPermit ? 'Yes' : 'No'}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.disabled">—</Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      {row.visaExpiry ? (
                        <Chip
                          size="small"
                          label={VISA_STATUS_LABEL[vsKey]}
                          sx={{
                            fontSize: 11,
                            bgcolor: VISA_STATUS_BG[vsKey],
                            color: VISA_STATUS_TEXT[vsKey],
                          }}
                        />
                      ) : (
                        <Typography variant="body2" color="text.disabled">—</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <AddClientDialog open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAddClient} />

      <Snackbar
        open={!!notification}
        autoHideDuration={3000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setNotification(null)} sx={{ width: '100%' }}>
          {notification}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}
