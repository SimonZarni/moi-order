import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import CardContent from '@mui/material/CardContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';

import { submissionsApi } from 'src/api/submissions';
import { DashboardContent } from 'src/layouts/dashboard';
import { servicesApi, type ServiceData } from 'src/api/services';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type ServiceCreateDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

function ServiceCreateDialog({ open, onClose, onCreated }: ServiceCreateDialogProps) {
  const [name, setName]       = useState('');
  const [nameEn, setNameEn]   = useState('');
  const [nameMm, setNameMm]   = useState('');
  const [slug, setSlug]       = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving]   = useState(false);

  const handleNameEnChange = (v: string) => {
    setNameEn(v);
    setSlug(v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  };

  const handleCreate = () => {
    if (!name.trim() || !nameEn.trim() || !slug.trim()) return;
    setSaving(true);
    servicesApi
      .create({ name, name_en: nameEn, name_mm: nameMm || null, slug, is_active: isActive })
      .then(() => {
        onCreated();
        onClose();
        setName(''); setNameEn(''); setNameMm(''); setSlug('');
      })
      .catch(() => {})
      .finally(() => setSaving(false));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>New Service</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Thai Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            label="English Name"
            value={nameEn}
            onChange={(e) => handleNameEnChange(e.target.value)}
            helperText="Slug is auto-derived from this"
          />
          <TextField
            fullWidth
            label="Myanmar Name"
            value={nameMm}
            onChange={(e) => setNameMm(e.target.value)}
          />
          <TextField
            fullWidth
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            helperText="Lowercase letters, numbers, hyphens only"
          />
          <FormControlLabel
            control={<Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
            label="Active"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained" color="primary"
          onClick={handleCreate}
          disabled={!name.trim() || !nameEn.trim() || !slug.trim() || saving}
          startIcon={saving ? <CircularProgress size={14} color="inherit" /> : undefined}
        >
          {saving ? 'Creating…' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

export function ServicesView() {
  const router = useRouter();
  const [services, setServices]           = useState<ServiceData[]>([]);
  const [loading, setLoading]             = useState(false);
  const [createOpen, setCreateOpen]       = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [submissionCounts, setSubmissionCounts] = useState<Record<number, number>>({});

  const fetchServices = useCallback(() => {
    setLoading(true);
    servicesApi.list()
      .then((data) => {
        setServices(data);
        data.forEach((s) => {
          submissionsApi
            .list({ service_id: s.id, per_page: 1 })
            .then(({ meta }) => setSubmissionCounts((prev) => ({ ...prev, [s.id]: meta.total })))
            .catch(() => {});
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4">Other Services</Typography>
          <Typography variant="body2" color="text.secondary">Manage service types and form fields</Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained" color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setCreateOpen(true)}
        >
          New Service
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {services.map((service) => (
            <Grid key={service.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ mb: 2 }}>
                    <Box sx={{ width: 44, height: 44, borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'primary.lighter', flexShrink: 0 }}>
                      <Iconify icon="solar:settings-bold-duotone" width={22} sx={{ color: 'primary.main' }} />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                        <Typography variant="subtitle1" fontWeight={600}>{service.name_mm ?? service.name_en ?? service.name}</Typography>
                        <Label color={service.is_active ? 'success' : 'default'} variant="soft">
                          {service.is_active ? 'Active' : 'Inactive'}
                        </Label>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">/{service.slug}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" flexWrap="wrap" sx={{ mb: 2, gap: 1.5 }}>
                    <Box>
                      <Typography variant="h6" color="primary.main">{service.types_count ?? 0}</Typography>
                      <Typography variant="caption" color="text.secondary">Types</Typography>
                    </Box>
                    <Box sx={{ cursor: 'pointer', '&:hover': { opacity: 0.7 } }} onClick={() => router.push(`/services/submissions?service=${service.id}&status=all`)}>
                      <Typography variant="h6" color="text.primary">{submissionCounts[service.id] ?? '—'}</Typography>
                      <Typography variant="caption" color="text.secondary">Submissions</Typography>
                    </Box>
                  </Stack>
                </CardContent>

                <Divider />
                <Stack direction="row" sx={{ p: 1.5 }} spacing={1}>
                  <Button
                    size="small"
                    startIcon={<Iconify icon="solar:pen-bold" width={14} />}
                    onClick={() => router.push(`/services/${service.id}`)}
                    sx={{ flexGrow: 1 }}
                  >
                    Edit Types
                  </Button>
                  <IconButton size="small" color="error" onClick={() => setDeleteConfirm(service.id)}>
                    <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                  </IconButton>
                </Stack>
              </Card>
            </Grid>
          ))}

          {services.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Box sx={{ py: 10, textAlign: 'center', color: 'text.secondary' }}>
                <Iconify icon="solar:settings-bold-duotone" width={48} sx={{ mb: 2, opacity: 0.3 }} />
                <Typography variant="body1">No services yet</Typography>
                <Button sx={{ mt: 2 }} variant="contained" color="primary" onClick={() => setCreateOpen(true)}>
                  Create First Service
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      <ServiceCreateDialog open={createOpen} onClose={() => setCreateOpen(false)} onCreated={fetchServices} />

      <Dialog open={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Service?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This will permanently delete the service and all its types.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button
            variant="contained" color="error"
            onClick={() => {
              if (deleteConfirm !== null) {
                servicesApi.remove(deleteConfirm)
                  .then(() => { setDeleteConfirm(null); fetchServices(); })
                  .catch(() => setDeleteConfirm(null));
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
