import type { IconifyName } from 'src/components/iconify';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import { DashboardContent } from 'src/layouts/dashboard';
import { servicesApi, type ServiceData, type ServiceTypeData } from 'src/api/services';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type FieldType = 'text' | 'number' | 'textarea' | 'photo' | 'select' | 'date';

type DocumentType =
  | 'passport_bio_page' | 'visa_page' | 'old_slip'
  | 'identity_card_front' | 'identity_card_back' | 'tm30'
  | 'upper_body_photo' | 'airplane_ticket' | 'passport_size_photo' | 'test_photo';

const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  passport_bio_page:   'Passport Bio Page',
  visa_page:           'Visa Page',
  old_slip:            'Previous 90-Day Slip',
  identity_card_front: 'Identity Card (Front)',
  identity_card_back:  'Identity Card (Back)',
  tm30:                'TM30',
  upper_body_photo:    'Upper Body Photo',
  airplane_ticket:     'Airplane Ticket',
  passport_size_photo: 'Passport Size Photo',
  test_photo:          'Test Photo',
};

type ServiceField = {
  id: string;
  label: string;
  placeholder: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  document_type?: DocumentType;
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

function buildNewTypeInitial(existingTypes: LocalType[]): LocalType | null {
  const template = existingTypes.find((t) => t.fields.length > 0);
  if (!template) return null;
  return {
    tempId:    genId(),
    name:      '',
    name_mm:   null,
    price:     0,
    is_active: true,
    fields:    template.fields.map((f) => ({ ...f })),
  };
}

const REPORT_ICON: IconifyName = 'solar:shield-keyhole-bold-duotone';

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
    price: t.price,
    is_active: t.is_active,
    fields: t.field_schema.map((f) => ({
      id:            f.key,
      label:         f.label,
      placeholder:   '',
      type:          (f.type === 'file' ? 'photo' : f.type) as FieldType ?? 'text',
      required:      f.required,
      options:       f.options,
      document_type: f.document_type as DocumentType | undefined,
    })),
  };
}

function typeToPayload(t: LocalType, index: number) {
  return {
    name: t.name,
    name_en: t.name,
    price: Math.round(t.price),
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
      ...(f.type === 'photo' ? { accepts: ['image'], document_type: f.document_type ?? null } : {}),
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
        {field.type === 'photo' && (
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth size="small" error={!field.document_type}>
              <InputLabel shrink={!!field.document_type}>Document Type *</InputLabel>
              <Select
                value={field.document_type ?? ''}
                label="Document Type *"
                onChange={(e) => onUpdate(field.id, { document_type: e.target.value as DocumentType })}
              >
                {(Object.keys(DOCUMENT_TYPE_LABELS) as DocumentType[]).map((dt) => (
                  <MenuItem key={dt} value={dt}>{DOCUMENT_TYPE_LABELS[dt]}</MenuItem>
                ))}
              </Select>
              {!field.document_type && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                  Required for file upload fields
                </Typography>
              )}
            </FormControl>
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
  apiError?: string;
};

function ServiceTypeForm({ initial, onSave, onCancel, apiError }: ServiceTypeFormProps) {
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

      {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}

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
        <Button size="small" variant="contained" color="primary" onClick={handleSave} disabled={!name.trim() || fields.some((f) => f.type === 'photo' && !f.document_type)}>Save Type</Button>
      </Stack>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function ReportView() {
  const [reportService, setReportService] = useState<ServiceData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [types, setTypes] = useState<LocalType[]>([]);
  const [loading, setLoading] = useState(true);
  const [formTarget, setFormTarget] = useState<LocalType | null | 'new'>(null);
  const [typeFormError, setTypeFormError] = useState('');

  useEffect(() => {
    servicesApi
      .list()
      .then((data) => {
        const found =
          data.find(
            (s) =>
              s.slug.includes('90') ||
              s.slug.includes('ninety') ||
              s.name.toLowerCase().includes('90')
          ) ?? null;
        if (!found) {
          setNotFound(true);
          setLoading(false);
          return Promise.resolve([] as typeof types);
        }
        setReportService(found);
        return servicesApi.listTypes(found.id).then((td) => td.map(toLocalType));
      })
      .then((mapped) => setTypes(mapped))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveType = useCallback(
    (t: LocalType) => {
      if (!reportService) return;
      const payload = typeToPayload(t, t.id ? types.findIndex((x) => x.id === t.id) : types.length);
      const call = t.id
        ? servicesApi.updateType(reportService.id, t.id, payload)
        : servicesApi.createType(reportService.id, payload);
      setTypeFormError('');
      call
        .then((saved) => {
          setTypes((prev) => {
            const exists = prev.find((x) => x.id === saved.id);
            return exists
              ? prev.map((x) => (x.id === saved.id ? toLocalType(saved) : x))
              : [...prev, toLocalType(saved)];
          });
          setFormTarget(null);
        })
        .catch((err) => {
          const msg = err?.response?.data?.message ?? 'Failed to save. Please try again.';
          setTypeFormError(msg);
        });
    },
    [reportService, types]
  );

  const handleDeleteType = useCallback(
    (typeId: number) => {
      if (!reportService) return;
      servicesApi
        .removeType(reportService.id, typeId)
        .then(() => setTypes((prev) => prev.filter((x) => x.id !== typeId)))
        .catch(() => {});
    },
    [reportService]
  );

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (notFound || !reportService) {
    return (
      <DashboardContent>
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4">90-Days Report Service</Typography>
          <Typography variant="body2" color="text.secondary">Embassy 90-day report types and form fields</Typography>
        </Box>
        <Box sx={{ py: 10, textAlign: 'center', color: 'text.secondary' }}>
          <Iconify icon={REPORT_ICON} width={48} sx={{ mb: 2, opacity: 0.3 }} />
          <Typography variant="body1">No 90-day report service found</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>Create a service with a name or slug containing &quot;90&quot; to get started.</Typography>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">90-Days Report Service</Typography>
          <Typography variant="body2" color="text.secondary">
            {reportService.name} · {types.length} type(s)
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setFormTarget('new')}
          disabled={formTarget !== null}
        >
          Add Type
        </Button>
      </Box>

      <Stack spacing={2}>
        {types.map((t) => (
          <Box key={t.tempId}>
            {formTarget !== null && typeof formTarget === 'object' && formTarget.tempId === t.tempId ? (
              <ServiceTypeForm initial={t} onSave={handleSaveType} onCancel={() => { setFormTarget(null); setTypeFormError(''); }} apiError={typeFormError} />
            ) : (
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{ width: 44, height: 44, borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'primary.lighter', flexShrink: 0 }}>
                      <Iconify icon={REPORT_ICON} width={22} sx={{ color: 'primary.main' }} />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                        <Typography variant="subtitle1" fontWeight={600}>{t.name_mm ?? t.name}</Typography>
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
                </CardContent>
              </Card>
            )}
          </Box>
        ))}

        {formTarget === 'new' && (
          <ServiceTypeForm initial={buildNewTypeInitial(types)} onSave={handleSaveType} onCancel={() => { setFormTarget(null); setTypeFormError(''); }} apiError={typeFormError} />
        )}

        {types.length === 0 && formTarget === null && (
          <Box sx={{ py: 10, textAlign: 'center', color: 'text.secondary' }}>
            <Iconify icon={REPORT_ICON} width={48} sx={{ mb: 2, opacity: 0.3 }} />
            <Typography variant="body1">No report types yet</Typography>
            <Button sx={{ mt: 2 }} variant="contained" color="primary" onClick={() => setFormTarget('new')}>
              Add First Type
            </Button>
          </Box>
        )}
      </Stack>
    </DashboardContent>
  );
}
