import type { SelectChangeEvent } from '@mui/material/Select';

import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { placesApi } from 'src/api/places';
import { DashboardContent } from 'src/layouts/dashboard';
import { categoriesApi, type CategoryData } from 'src/api/categories';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type FormState = {
  name_my: string;
  name_en: string;
  name_th: string;
  category_id: string;
  city: string;
  address: string;
  short_description: string;
  long_description: string;
  latitude: string;
  longitude: string;
  opening_hours: string;
  contact_phone: string;
  website: string;
  google_map_url: string;
};

const EMPTY_FORM: FormState = {
  name_my: '',
  name_en: '',
  name_th: '',
  category_id: '',
  city: '',
  address: '',
  short_description: '',
  long_description: '',
  latitude: '',
  longitude: '',
  opening_hours: '',
  contact_phone: '',
  website: '',
  google_map_url: '',
};

// ----------------------------------------------------------------------

export function PlaceCreateView() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    categoriesApi.list({ per_page: 100 }).then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(
    () => () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const update = useCallback((field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    e.target.value = '';
    setPendingImages((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removePreview = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setPendingImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    setCreating(true);
    setError('');
    try {
      const payload: Record<string, unknown> = {
        name_my: form.name_my,
        name_en: form.name_en,
        category_id: Number(form.category_id),
      };
      if (form.name_th) payload.name_th = form.name_th;
      if (form.city) payload.city = form.city;
      if (form.address) payload.address = form.address;
      if (form.short_description) payload.short_description = form.short_description;
      if (form.long_description) payload.long_description = form.long_description;
      if (form.latitude) payload.latitude = Number(form.latitude);
      if (form.longitude) payload.longitude = Number(form.longitude);
      if (form.opening_hours) payload.opening_hours = form.opening_hours;
      if (form.contact_phone) payload.contact_phone = form.contact_phone;
      if (form.website) payload.website = form.website;
      if (form.google_map_url) payload.google_map_url = form.google_map_url;

      const place = await placesApi.create(payload);

      if (pendingImages.length > 0) {
        await placesApi.uploadImages(place.id, pendingImages);
      }

      router.push(`/places/${place.id}/edit`);
    } catch {
      setError('Failed to create place. Please check all required fields and try again.');
    } finally {
      setCreating(false);
    }
  };

  const canSubmit = !!form.name_my.trim() && !!form.name_en.trim() && !!form.category_id;

  return (
    <DashboardContent>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => router.push('/places')}>
          <Iconify icon="eva:arrow-ios-forward-fill" width={20} sx={{ transform: 'rotate(180deg)' }} />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">New Place</Typography>
          <Typography variant="body2" color="text.secondary">
            Fill in the details below then click Create Place
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreate}
          disabled={creating || !canSubmit}
          startIcon={
            creating ? (
              <CircularProgress size={14} color="inherit" />
            ) : (
              <Iconify icon="eva:checkmark-fill" width={14} />
            )
          }
        >
          {creating ? 'Creating…' : 'Create Place'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* ── Left column ── */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Names */}
            <Card>
              <CardHeader title="Basic Information" subheader="* required fields" />
              <CardContent>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      required
                      label="Name (Myanmar)"
                      value={form.name_my}
                      onChange={(e) => update('name_my', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      required
                      label="Name (English)"
                      value={form.name_en}
                      onChange={(e) => update('name_en', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Name (Thai)"
                      value={form.name_th}
                      onChange={(e) => update('name_th', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth required>
                      <InputLabel>Category *</InputLabel>
                      <Select
                        label="Category *"
                        value={form.category_id}
                        onChange={(e: SelectChangeEvent) => update('category_id', e.target.value)}
                      >
                        {categories.map((cat) => (
                          <MenuItem key={cat.id} value={String(cat.id)}>
                            {cat.name_my ?? cat.name_en ?? cat.slug}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="City"
                      value={form.city}
                      onChange={(e) => update('city', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Opening Hours"
                      placeholder="e.g. Mon–Fri 9:00–18:00"
                      value={form.opening_hours}
                      onChange={(e) => update('opening_hours', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Address"
                      value={form.address}
                      onChange={(e) => update('address', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Descriptions */}
            <Card>
              <CardHeader title="Description" />
              <CardContent>
                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    label="Short Description"
                    multiline
                    rows={2}
                    inputProps={{ maxLength: 500 }}
                    value={form.short_description}
                    onChange={(e) => update('short_description', e.target.value)}
                    helperText={`${form.short_description.length}/500`}
                  />
                  <TextField
                    fullWidth
                    label="Long Description"
                    multiline
                    rows={5}
                    inputProps={{ maxLength: 5000 }}
                    value={form.long_description}
                    onChange={(e) => update('long_description', e.target.value)}
                    helperText={`${form.long_description.length}/5000`}
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Contact & Links */}
            <Card>
              <CardHeader title="Contact & Links" />
              <CardContent>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={form.contact_phone}
                      onChange={(e) => update('contact_phone', e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <Iconify
                            icon="solar:chat-round-dots-bold"
                            width={16}
                            sx={{ mr: 1, color: 'text.disabled' }}
                          />
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Website"
                      placeholder="https://..."
                      value={form.website}
                      onChange={(e) => update('website', e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <Iconify
                            icon="solar:eye-bold"
                            width={16}
                            sx={{ mr: 1, color: 'text.disabled' }}
                          />
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Google Maps URL"
                      placeholder="https://maps.google.com/..."
                      value={form.google_map_url}
                      onChange={(e) => update('google_map_url', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Latitude"
                      type="number"
                      value={form.latitude}
                      onChange={(e) => update('latitude', e.target.value)}
                      inputProps={{ step: 'any', min: -90, max: 90 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Longitude"
                      type="number"
                      value={form.longitude}
                      onChange={(e) => update('longitude', e.target.value)}
                      inputProps={{ step: 'any', min: -180, max: 180 }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* ── Right column ── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardHeader
              title={`Gallery (${pendingImages.length} photos)`}
              subheader="Uploaded after place is created"
              action={
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Iconify icon="mingcute:add-line" width={14} />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Add Photos
                </Button>
              }
            />
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                hidden
                onChange={handleFileSelect}
              />
              <Grid container spacing={1}>
                {previewUrls.map((url, index) => (
                  <Grid key={url} size={{ xs: 6 }}>
                    <Box
                      sx={{
                        position: 'relative',
                        borderRadius: 1,
                        overflow: 'hidden',
                        '&:hover .del-btn': { opacity: 1 },
                      }}
                    >
                      <Avatar src={url} variant="rounded" sx={{ width: '100%', height: 80 }} />
                      <IconButton
                        className="del-btn"
                        size="small"
                        color="error"
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: 'rgba(255,255,255,0.9)',
                          opacity: 0,
                          transition: 'opacity 0.2s',
                          '&:hover': { bgcolor: 'white' },
                        }}
                        onClick={() => removePreview(index)}
                      >
                        <Iconify icon="mingcute:close-line" width={14} />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
                <Grid size={{ xs: 6 }}>
                  <Box
                    sx={{
                      height: 80,
                      border: '1px dashed',
                      borderColor: 'divider',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Iconify icon="mingcute:add-line" width={24} sx={{ color: 'text.disabled' }} />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
