import type { SelectChangeEvent } from '@mui/material/Select';

import { useParams } from 'react-router-dom';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import CardContent from '@mui/material/CardContent';
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

// ----------------------------------------------------------------------

export function PlaceEditView() {
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [images, setImages] = useState<Array<{ id: number; url: string; sort_order: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      placesApi.get(id),
      categoriesApi.list({ per_page: 100 }),
    ])
      .then(([place, { data: cats }]) => {
        setCategories(cats);
        setImages(place.images ?? []);
        setForm({
          name_my: place.name_my ?? '',
          name_en: place.name_en ?? '',
          name_th: place.name_th ?? '',
          category_id: place.category ? String(place.category.id) : '',
          city: place.city ?? '',
          address: place.address ?? '',
          short_description: place.short_description ?? '',
          long_description: place.long_description ?? '',
          latitude: place.latitude != null ? String(place.latitude) : '',
          longitude: place.longitude != null ? String(place.longitude) : '',
          opening_hours: place.opening_hours ?? '',
          contact_phone: place.contact_phone ?? '',
          website: place.website ?? '',
          google_map_url: place.google_map_url ?? '',
        });
      })
      .catch(() => setError('Failed to load place.'))
      .finally(() => setLoading(false));
  }, [id]);

  const update = useCallback((field: keyof FormState, value: string) => {
    setSaved(false);
    setForm((prev) => prev && { ...prev, [field]: value });
  }, []);

  const handleSave = () => {
    if (!form || !id) return;
    setSaving(true);
    setError('');
    const payload: Record<string, unknown> = {
      name_my: form.name_my,
      name_en: form.name_en || null,
      name_th: form.name_th || null,
      city: form.city || null,
      address: form.address,
      short_description: form.short_description || null,
      long_description: form.long_description || null,
      opening_hours: form.opening_hours || null,
      contact_phone: form.contact_phone || null,
      website: form.website || null,
      google_map_url: form.google_map_url || null,
      latitude: form.latitude ? Number(form.latitude) : null,
      longitude: form.longitude ? Number(form.longitude) : null,
    };
    if (form.category_id) payload.category_id = Number(form.category_id);

    placesApi
      .update(id, payload)
      .then((updated) => {
        setImages(updated.images ?? []);
        setSaved(true);
      })
      .catch(() => setError('Failed to save changes.'))
      .finally(() => setSaving(false));
  };

  const handleUploadImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !id) return;
    e.target.value = '';
    setUploading(true);
    placesApi
      .uploadImages(id, files)
      .then((newImages) => setImages((prev) => [...prev, ...newImages]))
      .catch(() => setError('Failed to upload images.'))
      .finally(() => setUploading(false));
  };

  const handleDeleteImage = (imageId: number) => {
    if (!id) return;
    setDeletingImageId(imageId);
    placesApi
      .deleteImage(id, imageId)
      .then(() => setImages((prev) => prev.filter((img) => img.id !== imageId)))
      .catch(() => setError('Failed to delete image.'))
      .finally(() => setDeletingImageId(null));
  };

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (!form) {
    return (
      <DashboardContent>
        <Alert severity="error">{error || 'Place not found.'}</Alert>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => router.push('/places')}>
          <Iconify icon="eva:arrow-ios-forward-fill" width={20} sx={{ transform: 'rotate(180deg)' }} />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">Edit Place</Typography>
          <Typography variant="body2" color="text.secondary">ID: {id}</Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={saving}
          startIcon={
            saving ? (
              <CircularProgress size={14} color="inherit" />
            ) : (
              <Iconify icon="eva:checkmark-fill" width={14} />
            )
          }
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Changes saved successfully.
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* ── Left column ── */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <Card>
              <CardHeader title="Basic Information" />
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
                    <FormControl fullWidth>
                      <InputLabel shrink={form.category_id ? true : undefined}>Category</InputLabel>
                      <Select
                        label="Category"
                        value={form.category_id}
                        onChange={(e: SelectChangeEvent) => update('category_id', e.target.value)}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
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
                          <Iconify icon="solar:chat-round-dots-bold" width={16} sx={{ mr: 1, color: 'text.disabled' }} />
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
                          <Iconify icon="solar:eye-bold" width={16} sx={{ mr: 1, color: 'text.disabled' }} />
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
              title={`Gallery (${images.length} photos)`}
              action={
                <Button
                  size="small"
                  variant="outlined"
                  disabled={uploading}
                  startIcon={
                    uploading ? (
                      <CircularProgress size={12} />
                    ) : (
                      <Iconify icon="mingcute:add-line" width={14} />
                    )
                  }
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
                onChange={handleUploadImages}
              />
              <Grid container spacing={1}>
                {images.map((img) => (
                  <Grid key={img.id} size={{ xs: 6 }}>
                    <Box
                      sx={{
                        position: 'relative',
                        borderRadius: 1,
                        overflow: 'hidden',
                        '&:hover .del-btn': { opacity: 1 },
                      }}
                    >
                      <Avatar src={img.url} variant="rounded" sx={{ width: '100%', height: 80 }} />
                      <IconButton
                        className="del-btn"
                        size="small"
                        color="error"
                        disabled={deletingImageId === img.id}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: 'rgba(255,255,255,0.9)',
                          opacity: 0,
                          transition: 'opacity 0.2s',
                          '&:hover': { bgcolor: 'white' },
                        }}
                        onClick={() => handleDeleteImage(img.id)}
                      >
                        {deletingImageId === img.id ? (
                          <CircularProgress size={12} />
                        ) : (
                          <Iconify icon="mingcute:close-line" width={14} />
                        )}
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
