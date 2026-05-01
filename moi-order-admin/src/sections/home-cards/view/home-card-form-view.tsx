import type { HomeCardPayload } from 'src/api/home-cards';
import type { HomeCard, HomeCardIconKey, HomeCardNavigationScreen } from 'src/types';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import CardContent from '@mui/material/CardContent';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { homeCardsApi } from 'src/api/home-cards';
import { DashboardContent } from 'src/layouts/dashboard';

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

const ICON_OPTIONS: { label: string; value: HomeCardIconKey }[] = [
  { label: 'Calendar',  value: 'calendar'  },
  { label: 'Location',  value: 'location'  },
  { label: 'Flash',     value: 'flash'     },
  { label: 'Embassy',   value: 'embassy'   },
  { label: 'Airport',   value: 'airport'   },
  { label: 'Bus',       value: 'bus'       },
  { label: 'Passport',  value: 'passport'  },
  { label: 'Food',      value: 'food'      },
  { label: 'Ticket',    value: 'ticket'    },
];

const NAVIGATION_GROUPS: { group: string; options: { label: string; value: HomeCardNavigationScreen }[] }[] = [
  {
    group: 'Services',
    options: [
      { label: '90-Day Report',    value: 'NinetyDayReport'  },
      { label: 'Other Services',   value: 'OtherServices'    },
      { label: 'Embassy Services', value: 'EmbassyServices'  },
      { label: 'Airport Fast Track', value: 'AirportFastTrack' },
    ],
  },
  {
    group: 'Explore',
    options: [
      { label: 'Places',  value: 'Places'  },
      { label: 'Tickets', value: 'Tickets' },
    ],
  },
  {
    group: 'Food',
    options: [{ label: 'Food', value: 'Food' }],
  },
  {
    group: 'Documents',
    options: [{ label: 'Passport Vault', value: 'PassportVault' }],
  },
  {
    group: 'Other',
    options: [
      { label: 'Search',     value: 'Search'    },
      { label: 'Places Map', value: 'PlacesMap' },
    ],
  },
];

// ----------------------------------------------------------------------

type FormState = {
  slug: string;
  title_en: string;
  title_mm: string;
  subtitle_en: string;
  subtitle_mm: string;
  tag_en: string;
  tag_mm: string;
  accent_color: string;
  icon_key: HomeCardIconKey;
  navigation_screen: HomeCardNavigationScreen;
  navigation_params_raw: string; // raw JSON string for the textarea
  is_active: boolean;
  is_coming_soon: boolean;
};

function defaultForm(card?: HomeCard): FormState {
  return {
    slug:                  card?.slug              ?? '',
    title_en:              card?.title_en          ?? '',
    title_mm:              card?.title_mm          ?? '',
    subtitle_en:           card?.subtitle_en       ?? '',
    subtitle_mm:           card?.subtitle_mm       ?? '',
    tag_en:                card?.tag_en            ?? '',
    tag_mm:                card?.tag_mm            ?? '',
    accent_color:          card?.accent_color      ?? '#52796f',
    icon_key:              card?.icon_key          ?? 'calendar',
    navigation_screen:     card?.navigation_screen ?? 'NinetyDayReport',
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

  const update = useCallback(<K extends keyof FormState>(field: K, value: FormState[K]) => {
    setSaved(false);
    setFieldErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

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
      slug:              form.slug,
      title_en:          form.title_en,
      title_mm:          form.title_mm,
      subtitle_en:       form.subtitle_en || null,
      subtitle_mm:       form.subtitle_mm || null,
      tag_en:            form.tag_en,
      tag_mm:            form.tag_mm,
      accent_color:      form.accent_color,
      icon_key:          form.icon_key,
      navigation_screen: form.navigation_screen,
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
                  <TextField
                    fullWidth
                    required
                    label="Slug"
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

          <Card sx={{ mb: 3 }}>
            <CardHeader title="Appearance" subheader="Accent colour and icon shown on the card" />
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Accent Colour</Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
                {ACCENT_SWATCHES.map((swatch) => (
                  <Tooltip key={swatch.value} title={swatch.label}>
                    <Box
                      onClick={() => update('accent_color', swatch.value)}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: swatch.value,
                        cursor: 'pointer',
                        border: form.accent_color === swatch.value ? '3px solid' : '3px solid transparent',
                        borderColor: form.accent_color === swatch.value ? 'primary.main' : 'transparent',
                        outline: form.accent_color === swatch.value ? '2px solid white' : 'none',
                        outlineOffset: -4,
                        transition: 'border-color 0.15s',
                      }}
                    />
                  </Tooltip>
                ))}
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Icon</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {ICON_OPTIONS.map((icon) => (
                  <Tooltip key={icon.value} title={icon.label}>
                    <Box
                      onClick={() => update('icon_key', icon.value)}
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5,
                        cursor: 'pointer',
                        border: '2px solid',
                        borderColor: form.icon_key === icon.value ? 'primary.main' : 'divider',
                        bgcolor: form.icon_key === icon.value ? 'primary.lighter' : 'background.neutral',
                        transition: 'all 0.15s',
                      }}
                    >
                      <Typography variant="caption" fontWeight={600} color={form.icon_key === icon.value ? 'primary.dark' : 'text.secondary'}>
                        {icon.label}
                      </Typography>
                    </Box>
                  </Tooltip>
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardHeader title="Navigation" subheader="Where the card takes the user when tapped" />
            <CardContent>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth required error={!!fieldErrors.navigation_screen}>
                    <InputLabel>Tap Destination</InputLabel>
                    <Select
                      label="Tap Destination"
                      value={form.navigation_screen}
                      onChange={(e) => update('navigation_screen', e.target.value as HomeCardNavigationScreen)}
                    >
                      {NAVIGATION_GROUPS.map((group) => [
                        <MenuItem key={`header-${group.group}`} disabled sx={{ fontWeight: 700, fontSize: 11, letterSpacing: 1, color: 'text.disabled', textTransform: 'uppercase' }}>
                          {group.group}
                        </MenuItem>,
                        ...group.options.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value} sx={{ pl: 3 }}>
                            {opt.label}
                          </MenuItem>
                        )),
                      ])}
                    </Select>
                    {fieldErrors.navigation_screen && (
                      <FormHelperText>{fieldErrors.navigation_screen}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
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
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderTop: `4px solid ${form.accent_color}`,
                  p: 2,
                  minHeight: 120,
                  position: 'relative',
                  opacity: form.is_coming_soon ? 0.5 : 1,
                  boxShadow: 2,
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={700}
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
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 6,
                    right: 8,
                    width: 28,
                    height: 28,
                    borderRadius: 1,
                    bgcolor: form.accent_color,
                    opacity: 0.25,
                  }}
                />
                {form.is_coming_soon && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      bgcolor: 'grey.100',
                      borderRadius: 99,
                      px: 1,
                      py: 0.25,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="caption" fontWeight={700} sx={{ fontSize: 9, letterSpacing: 1 }}>
                      SOON
                    </Typography>
                  </Box>
                )}
              </Box>

              <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1.5, textAlign: 'center' }}>
                Icon: {form.icon_key} · Goes to: {form.navigation_screen}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
