import { useParams } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Select from '@mui/material/Select';
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

import { DashboardContent } from 'src/layouts/dashboard';
import { placesApi, type PlaceData, type PlaceLocale } from 'src/api/places';

import { Iconify } from 'src/components/iconify';

const localeName = (v: PlaceLocale | null): string => {
  if (!v) return '';
  return v.name_my ?? v.name_en ?? '';
};

// ----------------------------------------------------------------------

export function PlaceEditView() {
  const { id } = useParams();
  const router = useRouter();

  const [place, setPlace] = useState<PlaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    placesApi
      .get(id)
      .then(setPlace)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const update = (field: keyof PlaceData, value: string) => {
    if (!place) return;
    setPlace((prev) => prev && { ...prev, [field]: value });
    setSaved(false);
  };

  const handleSave = () => {
    if (!place || !id) return;
    setSaving(true);
    placesApi
      .update(id, {
        name_my: place.name_my,
        address: place.address,
        status: place.status,
        phone: place.phone,
        email: place.email,
        website: place.website,
      })
      .then((updated) => {
        setPlace(updated);
        setSaved(true);
      })
      .catch(() => {})
      .finally(() => setSaving(false));
  };

  const handleUploadImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !id) return;
    e.target.value = '';
    setUploading(true);
    placesApi
      .uploadImages(id, files)
      .then((newImages) => {
        setPlace((prev) => prev && { ...prev, images: [...prev.images, ...newImages] });
      })
      .catch(() => {})
      .finally(() => setUploading(false));
  };

  const handleDeleteImage = (imageId: number) => {
    if (!id) return;
    setDeletingImageId(imageId);
    placesApi
      .deleteImage(id, imageId)
      .then(() => {
        setPlace((prev) => prev && { ...prev, images: prev.images.filter((img) => img.id !== imageId) });
      })
      .catch(() => {})
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

  if (!place) {
    return (
      <DashboardContent>
        <Alert severity="error">Place not found.</Alert>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => router.push('/places')}>
          <Iconify
            icon="eva:arrow-ios-forward-fill"
            width={20}
            sx={{ transform: 'rotate(180deg)' }}
          />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">Edit Place</Typography>
          <Typography variant="body2" color="text.secondary">
            ID: {id}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="eva:arrow-ios-downward-fill" width={14} />}
          >
            Export Excel
          </Button>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="eva:trending-up-fill" width={14} />}
          >
            Import Excel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={saving}
            startIcon={<Iconify icon="eva:checkmark-fill" width={14} />}
          >
            Save Changes
          </Button>
        </Stack>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Changes saved successfully.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <Card>
              <CardHeader title="Basic Information" />
              <CardContent>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Place Name"
                      value={place.name_my}
                      onChange={(e) => update('name_my', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Category"
                      value={localeName(place.category)}
                      disabled
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="City"
                      value={place.city ?? ''}
                      disabled
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Address"
                      value={place.address}
                      onChange={(e) => update('address', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={place.status ?? 'active'}
                        label="Status"
                        onChange={(e) => update('status', e.target.value)}
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Contact Information" />
              <CardContent>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={place.phone ?? ''}
                      onChange={(e) => update('phone', e.target.value)}
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
                      label="Email"
                      value={place.email ?? ''}
                      onChange={(e) => update('email', e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <Iconify
                            icon="solar:check-circle-bold"
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
                      label="Website"
                      value={place.website ?? ''}
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
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Card>
              <CardHeader title="Cover Photo" subheader="Main display image" />
              <CardContent>
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: 160,
                    borderRadius: 1.5,
                    overflow: 'hidden',
                    mb: 2,
                  }}
                >
                  <Avatar
                    src={place.images[0]?.url ?? place.cover_image ?? undefined}
                    variant="rounded"
                    sx={{ width: '100%', height: '100%' }}
                  />
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Iconify icon="mingcute:add-line" width={14} />}
                >
                  Change Cover
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader
                title={`Gallery (${place.images.length} photos)`}
                action={
                  <Button
                    size="small"
                    startIcon={uploading ? <CircularProgress size={12} /> : <Iconify icon="mingcute:add-line" width={14} />}
                    variant="outlined"
                    disabled={uploading}
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
                  {place.images.map((img) => (
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
                          {deletingImageId === img.id
                            ? <CircularProgress size={12} />
                            : <Iconify icon="mingcute:close-line" width={14} />}
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                  <Grid size={{ xs: 6 }}>
                    <Box
                      component="label"
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

          </Stack>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
