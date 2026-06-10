import type { HomeCardPayload } from 'src/api/home-cards';
import type { HomeCard, HomeCardIcon, HomeCardRoute } from 'src/types';

import { HexColorPicker } from 'react-colorful';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import ToggleButton from '@mui/material/ToggleButton';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { useRouter } from 'src/routes/hooks';

import { homeCardsApi } from 'src/api/home-cards';
import { DashboardContent } from 'src/layouts/dashboard';
import { homeCardIconsApi } from 'src/api/home-card-icons';
import { homeCardRoutesApi } from 'src/api/home-card-routes';

// ----------------------------------------------------------------------

const ACCENT_SWATCHES = [
  { label: 'Sage',   value: '#52796f' },
  { label: 'Gold',   value: '#b08d57' },
  { label: 'Teal',   value: '#6b9e94' },
  { label: 'Rose',   value: '#8b4353' },
  { label: 'Sky',    value: '#4a7fa5' },
  { label: 'Indigo', value: '#5c5a8a' },
  { label: 'Coral',  value: '#b85c45' },
  { label: 'Navy',   value: '#1e3d6b' },
  { label: 'Slate',  value: '#64748b' },
  { label: 'Amber',  value: '#c4813b' },
];

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

const AUTO_SLUG_CREATE_NEW = '__create_new__';

function toSlug(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// ----------------------------------------------------------------------

type FormState = {
  parent_id: number | null;
  slug: string;
  title_en: string;
  title_mm: string;
  subtitle_en: string;
  subtitle_mm: string;
  tag_en: string;
  tag_mm: string;
  accent_color: string;
  border_color: string;
  icon_key: string;
  navigation_screen: string;
  navigation_params_raw: string;
  is_active: boolean;
  is_coming_soon: boolean;
};

function defaultForm(card?: HomeCard): FormState {
  return {
    parent_id:             card?.parent_id         ?? null,
    slug:                  card?.slug              ?? '',
    title_en:              card?.title_en          ?? '',
    title_mm:              card?.title_mm          ?? '',
    subtitle_en:           card?.subtitle_en       ?? '',
    subtitle_mm:           card?.subtitle_mm       ?? '',
    tag_en:                card?.tag_en            ?? '',
    tag_mm:                card?.tag_mm            ?? '',
    accent_color:          card?.accent_color      ?? '#52796f',
    border_color:          card?.border_color      ?? '#52796f',
    icon_key:              card?.icon_key          ?? 'calendar',
    navigation_screen:     card?.navigation_screen ?? '',
    navigation_params_raw: card?.navigation_params ? JSON.stringify(card.navigation_params, null, 2) : '{}',
    is_active:             card?.is_active         ?? true,
    is_coming_soon:        card?.is_coming_soon    ?? false,
  };
}

// ----------------------------------------------------------------------

type Props = {
  mode: 'create' | 'edit';
  card?: HomeCard;
};

export function HomeCardFormView({ mode, card }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(defaultForm(card));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // ── Color pickers ───────────────────────────────────────────────────────────
  const [accentPickerAnchor, setAccentPickerAnchor] = useState<HTMLElement | null>(null);
  const [borderPickerAnchor, setBorderPickerAnchor] = useState<HTMLElement | null>(null);
  const [accentHexDraft, setAccentHexDraft] = useState(form.accent_color);
  const [borderHexDraft, setBorderHexDraft] = useState(form.border_color);

  // ── Dynamic icon, route and parent-card lists ───────────────────────────────
  const [icons, setIcons] = useState<HomeCardIcon[]>([]);
  const [iconsLoading, setIconsLoading] = useState(true);
  const [routes, setRoutes] = useState<HomeCardRoute[]>([]);
  const [routesLoading, setRoutesLoading] = useState(true);
  const [parentOptions, setParentOptions] = useState<HomeCard[]>([]);
  const [parentOptionsLoading, setParentOptionsLoading] = useState(true);

  useEffect(() => {
    homeCardIconsApi.list()
      .then(setIcons)
      .finally(() => setIconsLoading(false));
    homeCardRoutesApi.list()
      .then(setRoutes)
      .finally(() => setRoutesLoading(false));
    homeCardsApi.list({ per_page: 100 })
      .then(({ data }) =>
        setParentOptions(
          data.filter((c) => c.parent_id === null && !c.deleted_at && c.id !== card?.id),
        )
      )
      .finally(() => setParentOptionsLoading(false));
  }, [card?.id]);

  // ── Create Icon dialog ──────────────────────────────────────────────────────
  const [createIconOpen, setCreateIconOpen] = useState(false);
  const [newIconLabel, setNewIconLabel] = useState('');
  const [newIconKey, setNewIconKey] = useState('');
  const [newIconFile, setNewIconFile] = useState<File | null>(null);
  const [newIconPreview, setNewIconPreview] = useState<string | null>(null);
  const [creatingIcon, setCreatingIcon] = useState(false);
  const [createIconError, setCreateIconError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNewIconLabelChange = useCallback((value: string) => {
    setNewIconLabel(value);
    setNewIconKey(toSlug(value));
  }, []);

  const handleIconFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setNewIconFile(file);
    setNewIconPreview(file ? URL.createObjectURL(file) : null);
  }, []);

  const handleCloseIconDialog = useCallback(() => {
    setCreateIconOpen(false);
    setNewIconLabel('');
    setNewIconKey('');
    setNewIconFile(null);
    setNewIconPreview(null);
    setCreateIconError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleSaveIcon = useCallback(() => {
    if (!newIconFile) return;
    const formData = new FormData();
    formData.append('key', newIconKey);
    formData.append('label', newIconLabel);
    formData.append('image', newIconFile);

    setCreatingIcon(true);
    setCreateIconError('');
    homeCardIconsApi.create(formData)
      .then((newIcon) => {
        setIcons((prev) => [...prev, newIcon]);
        setForm((prev) => ({ ...prev, icon_key: newIcon.key }));
        handleCloseIconDialog();
      })
      .catch((err) => {
        const msg = err?.response?.data?.errors?.key?.[0]
          ?? err?.response?.data?.message
          ?? 'Failed to create icon.';
        setCreateIconError(msg);
      })
      .finally(() => setCreatingIcon(false));
  }, [newIconFile, newIconKey, newIconLabel, handleCloseIconDialog]);

  // ── Create Route dialog ─────────────────────────────────────────────────────
  const [createRouteOpen, setCreateRouteOpen] = useState(false);
  const [newRouteLabelEn, setNewRouteLabelEn] = useState('');
  const [newRouteLabelMm, setNewRouteLabelMm] = useState('');
  const [newRouteKey, setNewRouteKey] = useState('');
  const [newRouteType, setNewRouteType] = useState<'internal' | 'external_url'>('internal');
  const [newRouteUrl, setNewRouteUrl] = useState('');
  const [creatingRoute, setCreatingRoute] = useState(false);
  const [createRouteError, setCreateRouteError] = useState('');

  const handleNewRouteLabelEnChange = useCallback((value: string) => {
    setNewRouteLabelEn(value);
    setNewRouteKey(toSlug(value));
  }, []);

  const handleCloseRouteDialog = useCallback(() => {
    setCreateRouteOpen(false);
    setNewRouteLabelEn('');
    setNewRouteLabelMm('');
    setNewRouteKey('');
    setNewRouteType('internal');
    setNewRouteUrl('');
    setCreateRouteError('');
  }, []);

  const handleSaveRoute = useCallback(() => {
    setCreatingRoute(true);
    setCreateRouteError('');
    homeCardRoutesApi.create({
      key:      newRouteKey,
      label_en: newRouteLabelEn,
      label_mm: newRouteLabelMm,
      type:     newRouteType,
      url:      newRouteType === 'external_url' ? newRouteUrl : null,
    })
      .then((newRoute) => {
        setRoutes((prev) => [...prev, newRoute]);
        setForm((prev) => ({ ...prev, navigation_screen: newRoute.key }));
        handleCloseRouteDialog();
      })
      .catch((err) => {
        const msg = err?.response?.data?.errors?.key?.[0]
          ?? err?.response?.data?.message
          ?? 'Failed to create route.';
        setCreateRouteError(msg);
      })
      .finally(() => setCreatingRoute(false));
  }, [newRouteKey, newRouteLabelEn, newRouteLabelMm, newRouteType, newRouteUrl, handleCloseRouteDialog]);

  // ── Main form ───────────────────────────────────────────────────────────────
  const update = useCallback(<K extends keyof FormState>(field: K, value: FormState[K]) => {
    setSaved(false);
    setFieldErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleAccentHexInput = useCallback((raw: string) => {
    const val = raw.startsWith('#') ? raw : `#${raw}`;
    setAccentHexDraft(val);
    if (HEX_RE.test(val)) update('accent_color', val);
  }, [update]);

  const handleBorderHexInput = useCallback((raw: string) => {
    const val = raw.startsWith('#') ? raw : `#${raw}`;
    setBorderHexDraft(val);
    if (HEX_RE.test(val)) update('border_color', val);
  }, [update]);

  const buildPayload = useCallback((): HomeCardPayload | null => {
    let navigationParams: Record<string, unknown> | null = null;
    const raw = form.navigation_params_raw.trim();
    if (raw && raw !== '{}') {
      try {
        navigationParams = JSON.parse(raw);
      } catch {
        setFieldErrors((prev) => ({ ...prev, navigation_params_raw: 'Must be valid JSON.' }));
        return null;
      }
    }
    return {
      parent_id:         form.parent_id,
      slug:              form.slug,
      title_en:          form.title_en,
      title_mm:          form.title_mm,
      subtitle_en:       form.subtitle_en || null,
      subtitle_mm:       form.subtitle_mm || null,
      tag_en:            form.tag_en,
      tag_mm:            form.tag_mm,
      accent_color:      form.accent_color,
      border_color:      form.border_color,
      icon_key:          form.icon_key,
      navigation_screen: form.navigation_screen || null,
      navigation_params: navigationParams,
      is_active:         form.is_active,
      is_coming_soon:    form.is_coming_soon,
    };
  }, [form]);

  const handleSave = useCallback(() => {
    const payload = buildPayload();
    if (!payload) return;

    setSaving(true);
    setError('');

    const request =
      mode === 'create'
        ? homeCardsApi.create(payload)
        : homeCardsApi.update(card!.id, payload);

    request
      .then(() => {
        if (mode === 'create') {
          router.push('/home-cards');
        } else {
          setSaved(true);
        }
      })
      .catch((err) => {
        const apiErrors = err?.response?.data?.errors as Record<string, string[]> | undefined;
        if (apiErrors) {
          const mapped: Record<string, string> = {};
          Object.entries(apiErrors).forEach(([k, v]) => { mapped[k] = v[0]; });
          setFieldErrors(mapped);
        } else {
          setError(err?.response?.data?.message ?? 'Failed to save card.');
        }
      })
      .finally(() => setSaving(false));
  }, [mode, card, buildPayload, router]);

  const title = mode === 'create' ? 'Add Home Card' : 'Edit Home Card';
  const selectedRoute = routes.find((r) => r.key === form.navigation_screen);

  return (
    <DashboardContent>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4">{title}</Typography>
          <Typography
            variant="body2"
            color="primary.main"
            sx={{ mt: 0.5, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={() => router.push('/home-cards')}
          >
            ← Back to Home Cards
          </Typography>
        </Box>
        <Button
          variant="contained"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={14} /> : undefined}
          onClick={handleSave}
        >
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {saved && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSaved(false)}>Card saved successfully.</Alert>}

      <Grid container spacing={3}>
        {/* ── Left column: form ── */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Content" subheader="Bilingual title, subtitle and tag" />
            <CardContent>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth error={!!fieldErrors.parent_id}>
                    <InputLabel>Parent Card</InputLabel>
                    <Select
                      label="Parent Card"
                      value={parentOptionsLoading ? '' : (form.parent_id ?? '')}
                      disabled={parentOptionsLoading}
                      onChange={(e) =>
                        update('parent_id', e.target.value === '' ? null : Number(e.target.value))
                      }
                    >
                      <MenuItem value="">
                        <em>None (root card)</em>
                      </MenuItem>
                      {parentOptions.map((rc) => (
                        <MenuItem key={rc.id} value={rc.id}>
                          {rc.title_en}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {fieldErrors.parent_id ?? 'Optional. Set to nest this card under a group card.'}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth required label="Slug"
                    placeholder="ninety-day-report"
                    value={form.slug}
                    onChange={(e) => update('slug', e.target.value)}
                    error={!!fieldErrors.slug}
                    helperText={fieldErrors.slug ?? 'Lowercase letters, numbers, hyphens only. Cannot be changed after creation.'}
                    disabled={mode === 'edit'}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth required label="Tag (English)" value={form.tag_en}
                    onChange={(e) => update('tag_en', e.target.value)}
                    error={!!fieldErrors.tag_en} helperText={fieldErrors.tag_en} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth required label="Tag (Myanmar)" value={form.tag_mm}
                    onChange={(e) => update('tag_mm', e.target.value)}
                    error={!!fieldErrors.tag_mm} helperText={fieldErrors.tag_mm} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth required label="Title (English)" value={form.title_en}
                    onChange={(e) => update('title_en', e.target.value)}
                    error={!!fieldErrors.title_en} helperText={fieldErrors.title_en} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth required label="Title (Myanmar)" value={form.title_mm}
                    onChange={(e) => update('title_mm', e.target.value)}
                    error={!!fieldErrors.title_mm} helperText={fieldErrors.title_mm} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Subtitle (English)" value={form.subtitle_en}
                    onChange={(e) => update('subtitle_en', e.target.value)}
                    error={!!fieldErrors.subtitle_en} helperText={fieldErrors.subtitle_en ?? 'Optional'} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Subtitle (Myanmar)" value={form.subtitle_mm}
                    onChange={(e) => update('subtitle_mm', e.target.value)}
                    error={!!fieldErrors.subtitle_mm} helperText={fieldErrors.subtitle_mm ?? 'Optional'} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* ── Appearance ── */}
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Appearance" subheader="Border and accent colours for the card" />
            <CardContent>

              {/* Border Colour */}
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Border Colour</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                Controls the top stripe on the card
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                <Box
                  onClick={(e) => setBorderPickerAnchor(e.currentTarget)}
                  sx={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    bgcolor: form.border_color, cursor: 'pointer',
                    border: '3px solid', borderColor: 'divider',
                    boxShadow: 2, transition: 'transform 0.15s',
                    '&:hover': { transform: 'scale(1.1)' },
                  }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                  {form.border_color}
                </Typography>
              </Box>
              <Popover
                open={Boolean(borderPickerAnchor)}
                anchorEl={borderPickerAnchor}
                onClose={() => setBorderPickerAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              >
                <Box sx={{ p: 2, width: 240 }}>
                  <HexColorPicker
                    color={form.border_color}
                    onChange={(hex) => { update('border_color', hex); setBorderHexDraft(hex); }}
                    style={{ width: '100%' }}
                  />
                  <TextField
                    size="small" fullWidth sx={{ mt: 1.5 }}
                    value={borderHexDraft}
                    onChange={(e) => handleBorderHexInput(e.target.value)}
                    onBlur={() => setBorderHexDraft(form.border_color)}
                    error={!HEX_RE.test(borderHexDraft)}
                    helperText={!HEX_RE.test(borderHexDraft) ? 'Enter a valid 6-digit hex' : ' '}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start">#</InputAdornment>,
                      },
                    }}
                    inputProps={{ maxLength: 7, style: { fontFamily: 'monospace' } }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, mb: 0.5 }}>Quick picks</Typography>
                  <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                    {ACCENT_SWATCHES.map((s) => (
                      <Tooltip key={s.value} title={s.label}>
                        <Box
                          onClick={() => { update('border_color', s.value); setBorderHexDraft(s.value); }}
                          sx={{
                            width: 24, height: 24, borderRadius: '50%', cursor: 'pointer',
                            bgcolor: s.value, border: '2px solid',
                            borderColor: form.border_color === s.value ? 'primary.main' : 'transparent',
                            transition: 'border-color 0.15s',
                          }}
                        />
                      </Tooltip>
                    ))}
                  </Box>
                </Box>
              </Popover>

              <Divider sx={{ my: 2.5 }} />

              {/* Accent Colour */}
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Accent Colour</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                Controls the tag text and icon tint
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                <Box
                  onClick={(e) => setAccentPickerAnchor(e.currentTarget)}
                  sx={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    bgcolor: form.accent_color, cursor: 'pointer',
                    border: '3px solid', borderColor: 'divider',
                    boxShadow: 2, transition: 'transform 0.15s',
                    '&:hover': { transform: 'scale(1.1)' },
                  }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                  {form.accent_color}
                </Typography>
              </Box>
              <Popover
                open={Boolean(accentPickerAnchor)}
                anchorEl={accentPickerAnchor}
                onClose={() => setAccentPickerAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              >
                <Box sx={{ p: 2, width: 240 }}>
                  <HexColorPicker
                    color={form.accent_color}
                    onChange={(hex) => { update('accent_color', hex); setAccentHexDraft(hex); }}
                    style={{ width: '100%' }}
                  />
                  <TextField
                    size="small" fullWidth sx={{ mt: 1.5 }}
                    value={accentHexDraft}
                    onChange={(e) => handleAccentHexInput(e.target.value)}
                    onBlur={() => setAccentHexDraft(form.accent_color)}
                    error={!HEX_RE.test(accentHexDraft)}
                    helperText={!HEX_RE.test(accentHexDraft) ? 'Enter a valid 6-digit hex' : ' '}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start">#</InputAdornment>,
                      },
                    }}
                    inputProps={{ maxLength: 7, style: { fontFamily: 'monospace' } }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, mb: 0.5 }}>Quick picks</Typography>
                  <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                    {ACCENT_SWATCHES.map((s) => (
                      <Tooltip key={s.value} title={s.label}>
                        <Box
                          onClick={() => { update('accent_color', s.value); setAccentHexDraft(s.value); }}
                          sx={{
                            width: 24, height: 24, borderRadius: '50%', cursor: 'pointer',
                            bgcolor: s.value, border: '2px solid',
                            borderColor: form.accent_color === s.value ? 'primary.main' : 'transparent',
                            transition: 'border-color 0.15s',
                          }}
                        />
                      </Tooltip>
                    ))}
                  </Box>
                </Box>
              </Popover>

              <Divider sx={{ my: 2.5 }} />

              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Icon</Typography>
              {iconsLoading ? (
                <CircularProgress size={20} />
              ) : (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {icons.map((icon) => (
                    <Tooltip key={icon.key} title={icon.label}>
                      <Box
                        onClick={() => update('icon_key', icon.key)}
                        sx={{
                          width: 64, height: 64, borderRadius: 2,
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center',
                          gap: 0.5, cursor: 'pointer', border: '2px solid',
                          overflow: 'hidden',
                          borderColor: form.icon_key === icon.key ? 'primary.main' : 'divider',
                          bgcolor: form.icon_key === icon.key ? 'primary.lighter' : 'background.neutral',
                          transition: 'all 0.15s',
                        }}
                      >
                        {icon.type === 'custom' && icon.image_url && (
                          <Box
                            component="img"
                            src={icon.image_url}
                            alt={icon.label}
                            sx={{ width: 32, height: 32, objectFit: 'contain' }}
                          />
                        )}
                        <Typography
                          variant="caption" fontWeight={600} noWrap
                          sx={{
                            px: 0.5, fontSize: '0.6rem',
                            color: form.icon_key === icon.key ? 'primary.dark' : 'text.secondary',
                          }}
                        >
                          {icon.label}
                        </Typography>
                      </Box>
                    </Tooltip>
                  ))}

                  {/* New Icon tile */}
                  <Tooltip title="Add custom icon">
                    <Box
                      onClick={() => setCreateIconOpen(true)}
                      sx={{
                        width: 64, height: 64, borderRadius: 2,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        gap: 0.5, cursor: 'pointer',
                        border: '2px dashed', borderColor: 'primary.main',
                        bgcolor: 'background.neutral', transition: 'all 0.15s',
                        '&:hover': { bgcolor: 'primary.lighter' },
                      }}
                    >
                      <Typography variant="h6" color="primary.main" lineHeight={1}>＋</Typography>
                      <Typography variant="caption" color="primary.main" fontWeight={600} sx={{ fontSize: '0.6rem' }}>
                        New Icon
                      </Typography>
                    </Box>
                  </Tooltip>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* ── Navigation ── */}
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Navigation" subheader="Where the card takes the user when tapped" />
            <CardContent>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth error={!!fieldErrors.navigation_screen}>
                    <InputLabel>Tap Destination</InputLabel>
                    <Select
                      label="Tap Destination"
                      value={routesLoading ? '' : form.navigation_screen}
                      disabled={routesLoading}
                      onChange={(e) => {
                        if (e.target.value === AUTO_SLUG_CREATE_NEW) {
                          setCreateRouteOpen(true);
                        } else {
                          update('navigation_screen', e.target.value);
                        }
                      }}
                    >
                      <MenuItem value="">
                        <em>None (group card — no direct navigation)</em>
                      </MenuItem>
                      <Divider />
                      {routes.filter((r) => r.type === 'internal').map((route) => (
                        <MenuItem key={route.key} value={route.key}>
                          {route.label_en}
                        </MenuItem>
                      ))}
                      {routes.some((r) => r.type === 'external_url') && (
                        <MenuItem disabled sx={{ fontWeight: 700, fontSize: 11, letterSpacing: 1, color: 'text.disabled', textTransform: 'uppercase' }}>
                          External URLs
                        </MenuItem>
                      )}
                      {routes.filter((r) => r.type === 'external_url').map((route) => (
                        <MenuItem key={route.key} value={route.key} sx={{ pl: 3 }}>
                          {route.label_en}
                        </MenuItem>
                      ))}
                      <Divider />
                      <MenuItem value={AUTO_SLUG_CREATE_NEW} sx={{ color: 'primary.main', fontWeight: 600 }}>
                        ＋ Add new route…
                      </MenuItem>
                    </Select>
                    {fieldErrors.navigation_screen && (
                      <FormHelperText>{fieldErrors.navigation_screen}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth multiline rows={3}
                    label="Extra Params (JSON)"
                    placeholder="{}"
                    value={form.navigation_params_raw}
                    onChange={(e) => update('navigation_params_raw', e.target.value)}
                    error={!!fieldErrors.navigation_params_raw}
                    helperText={fieldErrors.navigation_params_raw ?? 'Leave {} if no params needed. Advanced use only.'}
                    inputProps={{ style: { fontFamily: 'monospace', fontSize: 13 } }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* ── Settings ── */}
          <Card>
            <CardHeader title="Settings" />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={<Switch checked={form.is_active} onChange={(e) => update('is_active', e.target.checked)} />}
                  label={<Box><Typography variant="subtitle2">Active</Typography><Typography variant="caption" color="text.secondary">Card is visible on the home screen</Typography></Box>}
                />
                <FormControlLabel
                  control={<Switch checked={form.is_coming_soon} onChange={(e) => update('is_coming_soon', e.target.checked)} />}
                  label={<Box><Typography variant="subtitle2">Coming Soon</Typography><Typography variant="caption" color="text.secondary">Card appears dimmed with a &ldquo;SOON&rdquo; badge</Typography></Box>}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Right column: live preview ── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ position: 'sticky', top: 80 }}>
            <CardHeader title="Live Preview" subheader="How it looks on the home screen" />
            <CardContent>
              <Box
                sx={{
                  borderRadius: 2, bgcolor: 'background.paper',
                  border: '1px solid', borderColor: 'divider',
                  borderTop: `4px solid ${form.border_color}`,
                  p: 2, minHeight: 120, position: 'relative',
                  opacity: form.is_coming_soon ? 0.5 : 1,
                  boxShadow: 2,
                }}
              >
                <Typography
                  variant="caption" fontWeight={700}
                  sx={{ textTransform: 'uppercase', letterSpacing: 1, color: form.accent_color, display: 'block', mb: 0.5 }}
                >
                  {form.tag_en || 'TAG'}
                </Typography>
                <Typography variant="subtitle1" fontWeight={800} lineHeight={1.3}>
                  {form.title_en || 'Card Title'}
                </Typography>
                {form.subtitle_en && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    {form.subtitle_en}
                  </Typography>
                )}
                <Box sx={{ position: 'absolute', bottom: 6, right: 8, width: 28, height: 28, borderRadius: 1, bgcolor: form.accent_color, opacity: 0.25 }} />
                {form.is_coming_soon && (
                  <Box sx={{ position: 'absolute', top: 10, right: 10, bgcolor: 'grey.100', borderRadius: 99, px: 1, py: 0.25, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" fontWeight={700} sx={{ fontSize: 9, letterSpacing: 1 }}>SOON</Typography>
                  </Box>
                )}
              </Box>
              <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1.5, textAlign: 'center' }}>
                Icon: {form.icon_key}
                {form.parent_id && ` · Child of: ${parentOptions.find((p) => p.id === form.parent_id)?.title_en ?? '…'}`}
                {form.navigation_screen
                  ? selectedRoute
                    ? ` · Goes to: ${selectedRoute.label_en}${selectedRoute.type === 'external_url' ? ' (ext)' : ''}`
                    : ` · Goes to: ${form.navigation_screen}`
                  : ' · No navigation (group)'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── Create Icon Dialog ── */}
      <Dialog open={createIconOpen} onClose={handleCloseIconDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Add Custom Icon</DialogTitle>
        <DialogContent>
          {createIconError && <Alert severity="error" sx={{ mb: 2 }}>{createIconError}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth label="Label"
              placeholder="Hotel"
              value={newIconLabel}
              onChange={(e) => handleNewIconLabelChange(e.target.value)}
            />
            <TextField
              fullWidth label="Key"
              placeholder="hotel"
              value={newIconKey}
              onChange={(e) => setNewIconKey(e.target.value)}
              helperText="Lowercase letters and hyphens only"
            />

            {/* Upload zone */}
            <Box
              component="label"
              sx={{
                border: '2px dashed', borderColor: 'divider', borderRadius: 2,
                p: 3, display: 'flex', flexDirection: 'column',
                alignItems: 'center', cursor: 'pointer',
                transition: 'all 0.15s',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.lighter' },
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                hidden
                onChange={handleIconFileChange}
              />
              {newIconPreview ? (
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    component="img"
                    src={newIconPreview}
                    alt="preview"
                    sx={{ width: 80, height: 80, objectFit: 'contain', display: 'block', mx: 'auto' }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {newIconFile?.name} · {((newIconFile?.size ?? 0) / 1024).toFixed(0)} KB
                  </Typography>
                  <Button
                    size="small" color="error" sx={{ mt: 0.5 }}
                    onClick={(e) => {
                      e.preventDefault();
                      setNewIconFile(null);
                      setNewIconPreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    Remove
                  </Button>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">↑ Drop image here or click to browse</Typography>
                  <Typography variant="caption" color="text.disabled">PNG or JPEG · max 2 MB</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseIconDialog}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!newIconKey || !newIconLabel || !newIconFile || creatingIcon}
            startIcon={creatingIcon ? <CircularProgress size={14} /> : undefined}
            onClick={handleSaveIcon}
          >
            {creatingIcon ? 'Saving…' : 'Save Icon'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Create Route Dialog ── */}
      <Dialog open={createRouteOpen} onClose={handleCloseRouteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Add Navigation Route</DialogTitle>
        <DialogContent>
          {createRouteError && <Alert severity="error" sx={{ mb: 2 }}>{createRouteError}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth label="Label (English)"
                placeholder="Hotels"
                value={newRouteLabelEn}
                onChange={(e) => handleNewRouteLabelEnChange(e.target.value)}
              />
              <TextField
                fullWidth label="Label (Myanmar)"
                value={newRouteLabelMm}
                onChange={(e) => setNewRouteLabelMm(e.target.value)}
              />
            </Box>

            <TextField
              fullWidth label="Route Key"
              value={newRouteKey}
              onChange={(e) => setNewRouteKey(e.target.value)}
              helperText="Must match the mobile screen name for internal routes"
            />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Route Type</Typography>
              <ToggleButtonGroup
                exclusive
                value={newRouteType}
                onChange={(_, v) => { if (v) setNewRouteType(v); }}
                size="small"
              >
                <ToggleButton value="internal">Internal Screen</ToggleButton>
                <ToggleButton value="external_url">External URL</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {newRouteType === 'external_url' && (
              <TextField
                fullWidth label="URL"
                placeholder="https://..."
                value={newRouteUrl}
                onChange={(e) => setNewRouteUrl(e.target.value)}
                helperText="Tapping the card will open this URL in the app"
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRouteDialog}>Cancel</Button>
          <Button
            variant="contained"
            disabled={
              !newRouteKey || !newRouteLabelEn || !newRouteLabelMm
              || (newRouteType === 'external_url' && !newRouteUrl)
              || creatingRoute
            }
            startIcon={creatingRoute ? <CircularProgress size={14} /> : undefined}
            onClick={handleSaveRoute}
          >
            {creatingRoute ? 'Saving…' : 'Save Route'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
