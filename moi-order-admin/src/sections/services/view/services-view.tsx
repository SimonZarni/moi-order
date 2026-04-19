import type { IconifyName } from 'src/components/iconify';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import CardContent from '@mui/material/CardContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';

import { submissionsApi } from 'src/api/submissions';
import { DashboardContent } from 'src/layouts/dashboard';
import { servicesApi, type ServiceData, type ServiceTypeData } from 'src/api/services';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type FieldType = 'text' | 'number' | 'textarea' | 'photo' | 'select' | 'date';

type ServiceField = {
  id: string;
  label: string;
  placeholder: string;
  type: FieldType;
  required: boolean;
  options?: string[];
};

type LocalType = {
  tempId: string;
  id?: number;
  name: string;
  name_mm: string | null;
  price: number;
  is_active: boolean;
  fields: ServiceField[];
};

const genId = () => 'f' + Math.random().toString(36).slice(2, 10);

const SERVICE_ICON: IconifyName = 'solar:settings-bold-duotone';

const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: 'Short Text',
  number: 'Number',
  textarea: 'Long Text',
  photo: 'Photo Upload',
  select: 'Dropdown',
  date: 'Date',
};

const FIELD_TYPE_ICONS: Record<FieldType, IconifyName> = {
  text: 'solar:pen-bold',
  number: 'solar:restart-bold',
  textarea: 'solar:chat-round-dots-bold',
  photo: 'solar:eye-bold',
  select: 'ic:round-filter-list',
  date: 'solar:clock-circle-outline',
};

function toLocalType(t: ServiceTypeData): LocalType {
  return {
    tempId: String(t.id),
    id: t.id,
    name: t.name,
    name_mm: t.name_mm,
    price: t.price / 100,
    is_active: t.is_active,
    fields: t.field_schema.map((f) => ({
      id: f.key,
      label: f.label,
      placeholder: '',
      type: (f.type === 'file' ? 'photo' : f.type) as FieldType ?? 'text',
      required: f.required,
      options: f.options,
    })),
  };
}

function typeToPayload(t: LocalType, index: number) {
  return {
    name: t.name,
    name_en: t.name,
    price: Math.round(t.price * 100),
    is_active: t.is_active,
    sort_order: index + 1,
    field_schema: t.fields.map((f, i) => ({
      key: f.id,
      label: f.label,
      label_en: f.label,
      type: f.type === 'photo' ? 'file' : f.type,
      required: f.required,
      sort_order: i + 1,
      options: f.options,
      ...(f.type === 'photo' ? { accepts: ['image'] } : {}),
    })),
  };
}

// ----------------------------------------------------------------------

type FieldEditorProps = {
  field: ServiceField;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (id: string, updated: Partial<ServiceField>) => void;
  onDelete: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
};

function FieldEditor({ field, index, isFirst, isLast, onUpdate, onDelete, onMoveUp, onMoveDown }: FieldEditorProps) {
  const [optionInput, setOptionInput] = useState('');

  const addOption = () => {
    if (!optionInput.trim()) return;
    onUpdate(field.id, { options: [...(field.options ?? []), optionInput.trim()] });
    setOptionInput('');
  };

  return (
    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Chip size="small" icon={<Iconify icon={FIELD_TYPE_ICONS[field.type]} width={14} />} label={FIELD_TYPE_LABELS[field.type]} color="primary" variant="outlined" />
        <Typography variant="caption" color="text.secondary">Field #{index + 1}</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton size="small" disabled={isFirst} onClick={() => onMoveUp(index)}>
          <Iconify icon="eva:arrow-ios-upward-fill" width={16} />
        </IconButton>
        <IconButton size="small" disabled={isLast} onClick={() => onMoveDown(index)}>
          <Iconify icon="eva:arrow-ios-downward-fill" width={16} />
        </IconButton>
        <IconButton size="small" color="error" onClick={() => onDelete(field.id)}>
          <Iconify icon="solar:trash-bin-trash-bold" width={16} />
        </IconButton>
      </Stack>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth size="small" label="Label" value={field.label} onChange={(e) => onUpdate(field.id, { label: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Field Type</InputLabel>
            <Select value={field.type} label="Field Type" onChange={(e) => onUpdate(field.id, { type: e.target.value as FieldType })}>
              {(Object.keys(FIELD_TYPE_LABELS) as FieldType[]).map((t) => (
                <MenuItem key={t} value={t}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon={FIELD_TYPE_ICONS[t]} width={16} />
                    <span>{FIELD_TYPE_LABELS[t]}</span>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {field.type !== 'photo' && (
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth size="small" label="Placeholder" value={field.placeholder} onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })} />
          </Grid>
        )}
        <Collapse in={field.type === 'select'} sx={{ width: '100%', px: 1 }}>
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Dropdown options</Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <TextField size="small" value={optionInput} onChange={(e) => setOptionInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addOption(); } }} placeholder="Add option..." sx={{ flexGrow: 1 }} />
              <Button size="small" variant="outlined" onClick={addOption}>Add</Button>
            </Stack>
            <Stack direction="row" flexWrap="wrap" gap={0.75}>
              {(field.options ?? []).map((opt) => (
                <Chip key={opt} label={opt} size="small" onDelete={() => onUpdate(field.id, { options: (field.options ?? []).filter((o) => o !== opt) })} />
              ))}
            </Stack>
          </Box>
        </Collapse>
        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={<Checkbox checked={field.required} onChange={(e) => onUpdate(field.id, { required: e.target.checked })} size="small" />}
            label={<Typography variant="body2">Required field</Typography>}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

// ----------------------------------------------------------------------

type ServiceTypeFormProps = {
  initial: LocalType | null;
  onSave: (t: LocalType) => void;
  onCancel: () => void;
};

function ServiceTypeForm({ initial, onSave, onCancel }: ServiceTypeFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [fields, setFields] = useState<ServiceField[]>(initial?.fields ?? []);

  const handleUpdateField = useCallback((fid: string, updated: Partial<ServiceField>) => {
    setFields((prev) => prev.map((f) => (f.id === fid ? { ...f, ...updated } : f)));
  }, []);

  const handleDeleteField = useCallback((fid: string) => {
    setFields((prev) => prev.filter((f) => f.id !== fid));
  }, []);

  const handleMoveUp = useCallback((i: number) => {
    if (i === 0) return;
    setFields((prev) => { const next = [...prev]; [next[i - 1], next[i]] = [next[i], next[i - 1]]; return next; });
  }, []);

  const handleMoveDown = useCallback((i: number) => {
    setFields((prev) => { if (i >= prev.length - 1) return prev; const next = [...prev]; [next[i], next[i + 1]] = [next[i + 1], next[i]]; return next; });
  }, []);

  const handleSave = () => {
    onSave({ tempId: initial?.tempId ?? genId(), id: initial?.id, name, name_mm: initial?.name_mm ?? null, price, is_active: isActive, fields });
  };

  return (
    <Box sx={{ p: 2, border: '1px solid', borderColor: 'primary.main', borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>{initial?.id ? 'Edit Type' : 'New Type'}</Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 5 }}>
          <TextField fullWidth size="small" label="Type Name" value={name} onChange={(e) => setName(e.target.value)} />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField fullWidth size="small" label="Price (THB)" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }}>
          <FormControlLabel sx={{ mt: 0.5 }} control={<Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)} size="small" />} label="Active" />
        </Grid>
      </Grid>

      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Form Fields ({fields.length})</Typography>
      <Stack spacing={1.5} sx={{ mb: 1.5 }}>
        {fields.map((field, i) => (
          <FieldEditor key={field.id} field={field} index={i} isFirst={i === 0} isLast={i === fields.length - 1} onUpdate={handleUpdateField} onDelete={handleDeleteField} onMoveUp={handleMoveUp} onMoveDown={handleMoveDown} />
        ))}
      </Stack>
      <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mb: 2 }}>
        {(Object.keys(FIELD_TYPE_LABELS) as FieldType[]).map((type) => (
          <Button key={type} size="small" variant="outlined" color="inherit" startIcon={<Iconify icon={FIELD_TYPE_ICONS[type]} width={12} />}
            onClick={() => setFields((prev) => [...prev, { id: genId(), label: '', placeholder: '', type, required: false, options: type === 'select' ? [] : undefined }])}>
            {FIELD_TYPE_LABELS[type]}
          </Button>
        ))}
      </Stack>

      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        <Button size="small" onClick={onCancel}>Cancel</Button>
        <Button size="small" variant="contained" color="primary" onClick={handleSave} disabled={!name.trim()}>Save Type</Button>
      </Stack>
    </Box>
  );
}

// ----------------------------------------------------------------------

type ServiceTypesDialogProps = {
  open: boolean;
  service: ServiceData | null;
  onClose: () => void;
};

function ServiceTypesDialog({ open, service, onClose }: ServiceTypesDialogProps) {
  const [types, setTypes] = useState<LocalType[]>([]);
  const [loading, setLoading] = useState(false);
  const [formTarget, setFormTarget] = useState<LocalType | null | 'new'>(null);

  useEffect(() => {
    if (!open || !service) return;
    setFormTarget(null);
    setLoading(true);
    servicesApi.listTypes(service.id)
      .then((data) => setTypes(data.map(toLocalType)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, service]);

  const handleSaveType = (t: LocalType) => {
    if (!service) return;
    const payload = typeToPayload(t, t.id ? types.findIndex((x) => x.id === t.id) : types.length);
    const call = t.id
      ? servicesApi.updateType(service.id, t.id, payload)
      : servicesApi.createType(service.id, payload);
    call.then((saved) => {
      setTypes((prev) => {
        const exists = prev.find((x) => x.id === saved.id);
        return exists
          ? prev.map((x) => (x.id === saved.id ? toLocalType(saved) : x))
          : [...prev, toLocalType(saved)];
      });
      setFormTarget(null);
    }).catch(() => {});
  };

  const handleDeleteType = (typeId: number) => {
    if (!service) return;
    servicesApi.removeType(service.id, typeId)
      .then(() => setTypes((prev) => prev.filter((x) => x.id !== typeId)))
      .catch(() => {});
  };

  if (!service) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center">
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Types: {service.name_mm ?? service.name}</Typography>
          <Button size="small" variant="outlined" startIcon={<Iconify icon="mingcute:add-line" width={14} />} onClick={() => setFormTarget('new')} disabled={formTarget !== null}>
            Add Type
          </Button>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <Stack spacing={2}>
            {types.map((t) => (
              <Box key={t.tempId}>
                {formTarget !== null && typeof formTarget === 'object' && formTarget.tempId === t.tempId ? (
                  <ServiceTypeForm initial={t} onSave={handleSaveType} onCancel={() => setFormTarget(null)} />
                ) : (
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="subtitle2">{t.name_mm ?? t.name}</Typography>
                          <Label color={t.is_active ? 'success' : 'default'} variant="soft">{t.is_active ? 'Active' : 'Inactive'}</Label>
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          {t.price.toFixed(0)} THB · {t.fields.length} field(s)
                        </Typography>
                      </Box>
                      <IconButton size="small" onClick={() => setFormTarget(t)} disabled={formTarget !== null}>
                        <Iconify icon="solar:pen-bold" width={16} />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => t.id && handleDeleteType(t.id)} disabled={formTarget !== null}>
                        <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                      </IconButton>
                    </Stack>
                  </Box>
                )}
              </Box>
            ))}

            {formTarget === 'new' && (
              <ServiceTypeForm initial={null} onSave={handleSaveType} onCancel={() => setFormTarget(null)} />
            )}

            {types.length === 0 && formTarget === null && (
              <Box sx={{ py: 4, textAlign: 'center', color: 'text.disabled', border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="body2">No types yet. Click &quot;Add Type&quot; to create one.</Typography>
              </Box>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

type ServiceCreateDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

function ServiceCreateDialog({ open, onClose, onCreated }: ServiceCreateDialogProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleNameChange = (v: string) => {
    setName(v);
    setSlug(v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  };

  const handleCreate = () => {
    if (!name.trim() || !slug.trim()) return;
    setSaving(true);
    servicesApi.create({ name, name_en: name, slug, is_active: isActive })
      .then(() => { onCreated(); onClose(); setName(''); setSlug(''); })
      .catch(() => {})
      .finally(() => setSaving(false));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>New Service</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField fullWidth label="Service Name" value={name} onChange={(e) => handleNameChange(e.target.value)} />
          <TextField fullWidth label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} helperText="Lowercase letters, numbers, hyphens only" />
          <FormControlLabel control={<Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />} label="Active" />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleCreate} disabled={!name.trim() || !slug.trim() || saving}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

export function ServicesView() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [typesService, setTypesService] = useState<ServiceData | null>(null);
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
        <Button variant="contained" color="primary" startIcon={<Iconify icon="mingcute:add-line" />} onClick={() => setCreateOpen(true)}>
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
                      <Iconify icon={SERVICE_ICON} width={22} sx={{ color: 'primary.main' }} />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                        <Typography variant="subtitle1" fontWeight={600}>{service.name_mm ?? service.name}</Typography>
                        <Label color={service.is_active ? 'success' : 'default'} variant="soft">{service.is_active ? 'Active' : 'Inactive'}</Label>
                      </Stack>
                    </Box>
                  </Stack>

                  <Stack direction="row" flexWrap="wrap" sx={{ mb: 2, gap: 1.5 }}>
                    {[
                      { label: 'Types', value: service.types_count ?? 0, color: 'primary.main' },
                    ].map((stat) => (
                      <Box key={stat.label}>
                        <Typography variant="h6" color={stat.color}>{stat.value}</Typography>
                        <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                      </Box>
                    ))}
                    <Box sx={{ cursor: 'pointer', '&:hover': { opacity: 0.7 } }} onClick={() => router.push(`/services/submissions?service=${service.id}&status=all`)}>
                      <Typography variant="h6" color="text.primary">{submissionCounts[service.id] ?? '—'}</Typography>
                      <Typography variant="caption" color="text.secondary">Submissions</Typography>
                    </Box>
                  </Stack>
                </CardContent>

                <Divider />
                <Stack direction="row" sx={{ p: 1.5 }} spacing={1}>
                  <Button size="small" startIcon={<Iconify icon="solar:pen-bold" width={14} />} onClick={() => setTypesService(service)} sx={{ flexGrow: 1 }}>
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
                <Iconify icon={SERVICE_ICON} width={48} sx={{ mb: 2, opacity: 0.3 }} />
                <Typography variant="body1">No services yet</Typography>
                <Button sx={{ mt: 2 }} variant="contained" color="primary" onClick={() => setCreateOpen(true)}>Create First Service</Button>
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      <ServiceCreateDialog open={createOpen} onClose={() => setCreateOpen(false)} onCreated={fetchServices} />

      <ServiceTypesDialog open={!!typesService} service={typesService} onClose={() => setTypesService(null)} />

      <Dialog open={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Service?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">This will permanently delete the service and all its types.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => {
            if (deleteConfirm !== null) {
              servicesApi.remove(deleteConfirm).then(() => { setDeleteConfirm(null); fetchServices(); }).catch(() => setDeleteConfirm(null));
            }
          }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
