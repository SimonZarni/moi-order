import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import RadioGroup from '@mui/material/RadioGroup';
import DialogTitle from '@mui/material/DialogTitle';
import CardContent from '@mui/material/CardContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';

import { useAuth } from 'src/context/auth-context';
import { submissionsApi } from 'src/api/submissions';
import { DashboardContent } from 'src/layouts/dashboard';
import { servicesApi, type ServiceData, serviceCategoriesApi, type ServiceCategoryData } from 'src/api/services';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

// Label shown for services with no category (OtherServices screen).
const UNCATEGORIZED_LABEL = 'Other Services';
const UNCATEGORIZED_SCREEN = 'OtherServices';

// Slugs that are hardcoded to dedicated screens — excluded from general lists.
const DEDICATED_SLUGS = new Set(['90-day-report', 'airport-fast-track']);

// ----------------------------------------------------------------------

type ServiceCreateDialogProps = {
  open: boolean;
  categories: ServiceCategoryData[];
  onClose: () => void;
  onCreated: () => void;
};

function ServiceCreateDialog({ open, categories, onClose, onCreated }: ServiceCreateDialogProps) {
  const [name, setName]         = useState('');
  const [nameEn, setNameEn]     = useState('');
  const [nameMm, setNameMm]     = useState('');
  const [slug, setSlug]         = useState('');
  const [isActive, setIsActive] = useState(true);
  const [categoryId, setCategoryId] = useState<string>('null');
  const [saving, setSaving]     = useState(false);

  const handleNameEnChange = (v: string) => {
    setNameEn(v);
    setSlug(v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  };

  const handleClose = () => {
    setName(''); setNameEn(''); setNameMm(''); setSlug('');
    setIsActive(true); setCategoryId('null');
    onClose();
  };

  const handleCreate = () => {
    if (!name.trim() || !nameEn.trim() || !slug.trim()) return;
    setSaving(true);
    servicesApi
      .create({
        name,
        name_en:             nameEn,
        name_mm:             nameMm || null,
        slug,
        is_active:           isActive,
        service_category_id: categoryId === 'null' ? null : Number(categoryId),
      })
      .then(() => { onCreated(); handleClose(); })
      .catch(() => {})
      .finally(() => setSaving(false));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>New Service</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <Stack spacing={2}>
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

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              Appears on home screen
            </Typography>
            <RadioGroup value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <FormControlLabel
                value="null"
                control={<Radio size="small" />}
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={500}>{UNCATEGORIZED_LABEL}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      General services screen
                    </Typography>
                  </Box>
                }
                sx={{ mb: 0.5, alignItems: 'flex-start', '& .MuiFormControlLabel-label': { pt: 0.5 } }}
              />
              {categories.map((cat) => (
                <FormControlLabel
                  key={cat.id}
                  value={String(cat.id)}
                  control={<Radio size="small" />}
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>{cat.name_en}</Typography>
                      {cat.navigation_screen && (
                        <Typography variant="caption" color="text.secondary">
                          {cat.navigation_screen} screen
                        </Typography>
                      )}
                    </Box>
                  }
                  sx={{ mb: 0.5, alignItems: 'flex-start', '& .MuiFormControlLabel-label': { pt: 0.5 } }}
                />
              ))}
            </RadioGroup>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
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

type ServiceCardProps = {
  service: ServiceData;
  submissionCount: number | undefined;
  canUpdate: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

function ServiceCard({ service, submissionCount, canUpdate, canDelete, onEdit, onDelete }: ServiceCardProps) {
  const router = useRouter();
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ mb: 2 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'primary.lighter', flexShrink: 0 }}>
            <Iconify icon="solar:settings-bold-duotone" width={22} sx={{ color: 'primary.main' }} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
              <Typography variant="subtitle1" fontWeight={600}>
                {service.name_mm ?? service.name_en ?? service.name}
              </Typography>
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
          <Box
            sx={{ cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
            onClick={() => router.push(`/services/submissions?service=${service.id}&status=all`)}
          >
            <Typography variant="h6" color="text.primary">{submissionCount ?? '—'}</Typography>
            <Typography variant="caption" color="text.secondary">Submissions</Typography>
          </Box>
        </Stack>
      </CardContent>

      <Divider />
      <Stack direction="row" sx={{ p: 1.5 }} spacing={1}>
        {canUpdate && (
          <Button
            size="small"
            startIcon={<Iconify icon="solar:pen-bold" width={14} />}
            onClick={onEdit}
            sx={{ flexGrow: 1 }}
          >
            Edit Types
          </Button>
        )}
        {canDelete && (
          <IconButton size="small" color="error" onClick={onDelete}>
            <Iconify icon="solar:trash-bin-trash-bold" width={16} />
          </IconButton>
        )}
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ServiceGroup = {
  key: string;
  label: string;
  screen: string | null;
  categoryId: number | null;
  services: ServiceData[];
  isDedicated: boolean;
};

function groupServices(services: ServiceData[], categories: ServiceCategoryData[]): ServiceGroup[] {
  const dedicated = services.filter((s) => DEDICATED_SLUGS.has(s.slug));
  const uncategorized = services.filter((s) => !DEDICATED_SLUGS.has(s.slug) && s.service_category_id === null);
  const groups: ServiceGroup[] = [];

  groups.push({
    key:        'uncategorized',
    label:      UNCATEGORIZED_LABEL,
    screen:     UNCATEGORIZED_SCREEN,
    categoryId: null,
    services:   uncategorized,
    isDedicated: false,
  });

  for (const cat of categories) {
    const catServices = services.filter(
      (s) => !DEDICATED_SLUGS.has(s.slug) && s.service_category_id === cat.id
    );
    groups.push({
      key:        cat.slug,
      label:      cat.name_en ?? cat.name,
      screen:     cat.navigation_screen,
      categoryId: cat.id,
      services:   catServices,
      isDedicated: false,
    });
  }

  if (dedicated.length > 0) {
    groups.push({
      key:        'dedicated',
      label:      'Dedicated Screens',
      screen:     null,
      categoryId: null,
      services:   dedicated,
      isDedicated: true,
    });
  }

  return groups;
}

// ----------------------------------------------------------------------

export function ServicesView() {
  const router = useRouter();
  const { hasPermission } = useAuth();
  const canCreate = hasPermission('services.create');
  const canUpdate = hasPermission('services.update');
  const canDelete = hasPermission('services.delete');

  const [services, setServices]       = useState<ServiceData[]>([]);
  const [categories, setCategories]   = useState<ServiceCategoryData[]>([]);
  const [loading, setLoading]         = useState(false);
  const [createOpen, setCreateOpen]   = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [submissionCounts, setSubmissionCounts] = useState<Record<number, number>>({});

  const fetchAll = useCallback(() => {
    setLoading(true);
    Promise.all([servicesApi.list(), serviceCategoriesApi.list()])
      .then(([serviceList, categoryList]) => {
        setServices(serviceList);
        setCategories(categoryList);
        serviceList.forEach((s) => {
          submissionsApi
            .list({ service_id: s.id, per_page: 1 })
            .then(({ meta }) => setSubmissionCounts((prev) => ({ ...prev, [s.id]: meta.total })))
            .catch(() => {});
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const groups = groupServices(services, categories);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4">Other Services</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage service types and form fields
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        {canCreate && (
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setCreateOpen(true)}
          >
            New Service
          </Button>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={4}>
          {groups.map((group) => (
            <Box key={group.key}>
              {/* Group header */}
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={700}>
                  {group.label}
                </Typography>
                {group.screen && (
                  <Label color="default" variant="soft" sx={{ fontFamily: 'monospace', fontSize: 11 }}>
                    {group.screen}
                  </Label>
                )}
                {group.isDedicated && (
                  <Label color="warning" variant="soft">read-only</Label>
                )}
                <Typography variant="caption" color="text.disabled">
                  {group.services.length} service{group.services.length !== 1 ? 's' : ''}
                </Typography>
              </Stack>

              {group.services.length === 0 ? (
                <Box
                  sx={{
                    py: 4,
                    textAlign: 'center',
                    color: 'text.disabled',
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 1.5,
                  }}
                >
                  <Typography variant="body2">No services in this group yet.</Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {group.services.map((service) => (
                    <Grid key={service.id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <ServiceCard
                        service={service}
                        submissionCount={submissionCounts[service.id]}
                        canUpdate={canUpdate && !group.isDedicated}
                        canDelete={canDelete && !group.isDedicated}
                        onEdit={() => router.push(`/services/${service.id}`)}
                        onDelete={() => setDeleteConfirm(service.id)}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          ))}

          {services.length === 0 && (
            <Box sx={{ py: 10, textAlign: 'center', color: 'text.secondary' }}>
              <Iconify icon="solar:settings-bold-duotone" width={48} sx={{ mb: 2, opacity: 0.3 }} />
              <Typography variant="body1">No services yet</Typography>
              {canCreate && (
                <Button sx={{ mt: 2 }} variant="contained" onClick={() => setCreateOpen(true)}>
                  Create First Service
                </Button>
              )}
            </Box>
          )}
        </Stack>
      )}

      <ServiceCreateDialog
        open={createOpen}
        categories={categories}
        onClose={() => setCreateOpen(false)}
        onCreated={fetchAll}
      />

      <Dialog
        open={deleteConfirm !== null}
        onClose={() => { setDeleteConfirm(null); setDeleteError(''); }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Service?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This will permanently delete the service and all its types.
          </Typography>
          {deleteError && <Alert severity="error" sx={{ mt: 2 }}>{deleteError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDeleteConfirm(null); setDeleteError(''); }}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (deleteConfirm !== null) {
                servicesApi.remove(deleteConfirm)
                  .then(() => { setDeleteConfirm(null); setDeleteError(''); fetchAll(); })
                  .catch((err) => setDeleteError(err?.response?.data?.message ?? 'Failed to delete. Please try again.'));
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
