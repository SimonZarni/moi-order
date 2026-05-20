import { useParams } from 'react-router-dom';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';

import { useAuth } from 'src/context/auth-context';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { tbStore, updateIndividualClient } from '../../shared/tb-mock-store';

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

const VISA_STATUS_LABEL: Record<VisaStatus, string> = { active: 'Active', expiring_soon: 'Expiring Soon', expired: 'Expired' };
const VISA_STATUS_COLOR: Record<VisaStatus, string> = { active: '#10B981', expiring_soon: '#F59E0B', expired: '#EF4444' };
const VISA_STATUS_BG: Record<VisaStatus, string> = { active: '#D1FAE5', expiring_soon: '#FEF3C7', expired: '#FEE2E2' };
const VISA_STATUS_TEXT: Record<VisaStatus, string> = { active: '#065F46', expiring_soon: '#92400E', expired: '#991B1B' };

// ----------------------------------------------------------------------

type EditForm = {
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

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Typography variant="overline" color="text.disabled" sx={{ display: 'block', mb: 2, letterSpacing: 1 }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
}

function InfoRow({ label, value, valueColor }: { label: string; value: React.ReactNode; valueColor?: string }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.75 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" sx={{ color: valueColor }}>{value}</Typography>
    </Stack>
  );
}

// ----------------------------------------------------------------------

export function TBPeopleDetailView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isSuperAdmin } = useAuth();
  const canEdit = isSuperAdmin();

  const [version, setVersion] = useState(0);
  const client = useMemo(
    () => tbStore.individualClients.find((c) => c.id === id) ?? null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, version]
  );

  const [editOpen, setEditOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const linkedCompany = useMemo(
    () => (client?.companyId ? tbStore.clients.find((c) => c.id === client.companyId) : null),
    [client]
  );

  const handleEditSubmit = useCallback(
    (form: EditForm) => {
      if (!id) return;
      const company = tbStore.clients.find((c) => c.id === form.companyId);
      updateIndividualClient(id, {
        name: form.name.trim(),
        nationality: form.nationality.trim(),
        phone: form.phone.trim() || undefined,
        email: form.email.trim() || undefined,
        passportNo: form.passportNo.trim() || undefined,
        companyId: form.companyId || undefined,
        companyName: company?.companyName,
        visaType: form.visaType.trim() || undefined,
        visaExpiry: form.visaExpiry || undefined,
        workPermit: form.workPermit,
        clientType: form.companyId ? 'company_linked' : 'visa_only',
        notes: form.notes.trim() || undefined,
      });
      setVersion((v) => v + 1);
      setEditOpen(false);
      setNotification('Client updated.');
    },
    [id]
  );

  if (!client) {
    return (
      <DashboardContent maxWidth="xl">
        <Stack alignItems="center" justifyContent="center" sx={{ py: 12 }}>
          <Typography variant="h5" color="text.secondary">Client not found.</Typography>
          <Button sx={{ mt: 2 }} onClick={() => router.push('/tb/people')}>Back to Clients</Button>
        </Stack>
      </DashboardContent>
    );
  }

  const vsKey = getVisaStatus(client.visaExpiry);
  const daysLeft = client.visaExpiry
    ? Math.ceil((new Date(client.visaExpiry).getTime() - Date.now()) / 86_400_000)
    : null;

  return (
    <DashboardContent maxWidth="xl">
      {/* Back nav */}
      <Button
        color="inherit"
        onClick={() => router.push('/tb/people')}
        startIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ transform: 'rotate(180deg)' }} />}
        sx={{ mb: 2, ml: -1, alignSelf: 'flex-start' }}
      >
        Clients
      </Button>

      {/* Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'flex-start' }} justifyContent="space-between" spacing={2} sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>{client.name}</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
            <Chip size="small" label={client.nationality} sx={{ bgcolor: 'background.neutral' }} />
            <Chip
              size="small"
              label={client.clientType === 'company_linked' ? 'Company Linked' : 'Visa Only'}
              sx={{ bgcolor: client.clientType === 'company_linked' ? '#E0E7FF' : '#F3F4F6', color: client.clientType === 'company_linked' ? '#3730A3' : '#374151' }}
            />
            {client.visaExpiry && (
              <Chip size="small" label={VISA_STATUS_LABEL[vsKey]}
                sx={{ bgcolor: VISA_STATUS_BG[vsKey], color: VISA_STATUS_TEXT[vsKey] }}
              />
            )}
          </Stack>
        </Box>

        {canEdit && (
          <Button variant="outlined" startIcon={<Iconify icon="solar:pen-bold" width={16} />} onClick={() => setEditOpen(true)} sx={{ flexShrink: 0 }}>
            Edit Client
          </Button>
        )}
      </Stack>

      <Grid container spacing={3}>

        {/* ── Left column ── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>

            <SectionCard title="Personal Details">
              <Stack divider={<Divider />}>
                <InfoRow label="Nationality" value={client.nationality} />
                <InfoRow label="Phone" value={client.phone ?? '—'} />
                <InfoRow label="Email" value={client.email ?? '—'} />
                <InfoRow label="Passport No." value={client.passportNo ?? '—'} />
              </Stack>
              {client.notes && (
                <Box sx={{ mt: 2, p: 1.5, bgcolor: 'background.neutral', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">{client.notes}</Typography>
                </Box>
              )}
            </SectionCard>

            <SectionCard title="Company Linkage">
              {linkedCompany ? (
                <Stack divider={<Divider />}>
                  <InfoRow label="Company" value={linkedCompany.companyName} />
                  <InfoRow label="Reg. No." value={
                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{linkedCompany.thaiRegNumber}</Typography>
                  } />
                </Stack>
              ) : (
                <Typography variant="body2" color="text.disabled">No company linked — Visa Only client.</Typography>
              )}
            </SectionCard>

          </Stack>
        </Grid>

        {/* ── Right column ── */}
        <Grid size={{ xs: 12, md: 8 }}>
          <SectionCard title="Visa & Work Permit">
            {!client.visaType && !client.visaExpiry ? (
              <Typography variant="body2" color="text.disabled">No visa information on record.</Typography>
            ) : (
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.5 }}>Visa Type</Typography>
                    <Typography variant="body2" fontWeight="fontWeightMedium">{client.visaType ?? '—'}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.5 }}>Expiry Date</Typography>
                    <Typography variant="body2" fontWeight="fontWeightMedium" sx={{ color: VISA_STATUS_COLOR[vsKey] }}>
                      {client.visaExpiry ? fDate(client.visaExpiry) : '—'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.5 }}>Work Permit</Typography>
                    <Typography variant="body2" fontWeight="fontWeightMedium" sx={{ color: client.workPermit ? '#10B981' : '#EF4444' }}>
                      {client.workPermit ? 'Yes' : 'No'}
                    </Typography>
                  </Grid>
                </Grid>

                {client.visaExpiry && (
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 1.5, bgcolor: VISA_STATUS_BG[vsKey], border: `1px solid ${VISA_STATUS_COLOR[vsKey]}30` }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="solar:clock-circle-outline" width={18} sx={{ color: VISA_STATUS_COLOR[vsKey] }} />
                      <Typography variant="body2" sx={{ color: VISA_STATUS_TEXT[vsKey], fontWeight: 600 }}>
                        {daysLeft === null ? '' : daysLeft < 0 ? `Expired ${Math.abs(daysLeft)} days ago` : daysLeft === 0 ? 'Expires today' : `${daysLeft} days remaining`}
                      </Typography>
                    </Stack>
                  </Paper>
                )}
              </Stack>
            )}
          </SectionCard>
        </Grid>

      </Grid>

      {/* Edit dialog */}
      {editOpen && (
        <EditClientDialog
          open={editOpen}
          client={client}
          onClose={() => setEditOpen(false)}
          onSubmit={handleEditSubmit}
        />
      )}

      <Snackbar open={!!notification} autoHideDuration={3000} onClose={() => setNotification(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" onClose={() => setNotification(null)} sx={{ width: '100%' }}>{notification}</Alert>
      </Snackbar>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

type EditClientDialogProps = {
  open: boolean;
  client: TBIndividualClient;
  onClose: () => void;
  onSubmit: (form: EditForm) => void;
};

function EditClientDialog({ open, client, onClose, onSubmit }: EditClientDialogProps) {
  const [form, setForm] = useState<EditForm>({
    name: client.name,
    nationality: client.nationality,
    phone: client.phone ?? '',
    email: client.email ?? '',
    passportNo: client.passportNo ?? '',
    companyId: client.companyId ?? '',
    visaType: client.visaType ?? '',
    visaExpiry: client.visaExpiry ?? '',
    workPermit: client.workPermit ?? false,
    clientType: client.clientType,
    notes: client.notes ?? '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EditForm, string>>>({});

  const handleChange = useCallback(<K extends keyof EditForm>(field: K, value: EditForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const validate = (): boolean => {
    const e: Partial<Record<keyof EditForm, string>> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.nationality.trim()) e.nationality = 'Nationality is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Client</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5}>
          <Typography variant="subtitle2" color="text.secondary">Personal Details</Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField fullWidth label="Full Name *" value={form.name} onChange={(e) => handleChange('name', e.target.value)} error={!!errors.name} helperText={errors.name} />
            <TextField fullWidth label="Nationality *" value={form.nationality} onChange={(e) => handleChange('nationality', e.target.value)} error={!!errors.nationality} helperText={errors.nationality} />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField fullWidth size="small" label="Phone" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+66 8X XXX XXXX" />
            <TextField fullWidth size="small" label="Email" type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
          </Stack>

          <TextField fullWidth size="small" label="Passport No." value={form.passportNo} onChange={(e) => handleChange('passportNo', e.target.value)} />

          <Divider />
          <Typography variant="subtitle2" color="text.secondary">Company Linkage</Typography>

          <FormControl fullWidth size="small">
            <InputLabel>Linked Company</InputLabel>
            <Select value={form.companyId} label="Linked Company" onChange={(e) => handleChange('companyId', e.target.value)}>
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
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save Changes</Button>
      </DialogActions>
    </Dialog>
  );
}
