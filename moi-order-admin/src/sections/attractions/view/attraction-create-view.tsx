import { useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { attractionsApi } from 'src/api/attractions';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const genTempId = () => Math.random().toString(36).slice(2, 10);

type FormState = {
  name: string;
  highlight_description: string;
  description: string;
  google_maps_link: string;
  address: string;
  city: string;
  province: string;
};

type LocalVariant = {
  tempId: string;
  name: string;
  price: number;
  description: string;
};

const EMPTY_FORM: FormState = {
  name: '',
  highlight_description: '',
  description: '',
  google_maps_link: '',
  address: '',
  city: '',
  province: '',
};

// ----------------------------------------------------------------------

export function AttractionCreateView() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [variants, setVariants] = useState<LocalVariant[]>([]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, { tempId: genTempId(), name: '', price: 0, description: '' }]);
  };

  const updateVariant = (tempId: string, field: keyof LocalVariant, value: string | number) => {
    setVariants((prev) => prev.map((v) => (v.tempId === tempId ? { ...v, [field]: value } : v)));
  };

  const removeVariant = (tempId: string) => {
    setVariants((prev) => prev.filter((v) => v.tempId !== tempId));
  };

  const handleCreate = async () => {
    if (!coverFile) return;
    setCreating(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('highlight_description', form.highlight_description);
      formData.append('description', form.description);
      formData.append('google_maps_link', form.google_maps_link);
      formData.append('address', form.address);
      formData.append('city', form.city);
      formData.append('province', form.province);
      formData.append('cover_image', coverFile);

      const ticket = await attractionsApi.create(formData);

      if (variants.length > 0) {
        await Promise.all(
          variants.map((v, i) =>
            attractionsApi.createVariant(ticket.id, {
              name: v.name,
              price: v.price,
              description: v.description,
              sort_order: i + 1,
            })
          )
        );
      }

      router.push(`/attractions/${ticket.id}`);
    } catch {
      setError('Failed to create attraction. Please check all required fields and try again.');
    } finally {
      setCreating(false);
    }
  };

  const canSubmit =
    !!form.name.trim() &&
    !!form.highlight_description.trim() &&
    !!form.description.trim() &&
    !!form.google_maps_link.trim() &&
    !!form.address.trim() &&
    !!form.city.trim() &&
    !!form.province.trim() &&
    !!coverFile &&
    variants.every((v) => !!v.name.trim() && v.price >= 1);

  return (
    <DashboardContent>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => router.push('/attractions')}>
          <Iconify icon="eva:arrow-ios-forward-fill" width={20} sx={{ transform: 'rotate(180deg)' }} />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">New Attraction</Typography>
          <Typography variant="body2" color="text.secondary">
            Fill in the details below then click Create Attraction
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
          {creating ? 'Creating…' : 'Create Attraction'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* ── Left column: cover image ── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardHeader title="Cover Image" subheader="Required — JPEG, PNG or WebP, max 5 MB" />
            <CardContent>
              <Box
                sx={{
                  width: '100%',
                  height: 200,
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  mb: 2,
                  border: '1px dashed',
                  borderColor: coverPreview ? 'transparent' : 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: coverPreview ? 'transparent' : 'action.hover',
                  cursor: 'pointer',
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                {coverPreview ? (
                  <Avatar
                    src={coverPreview}
                    variant="square"
                    sx={{ width: '100%', height: '100%', borderRadius: 1.5 }}
                  />
                ) : (
                  <Stack alignItems="center" spacing={1}>
                    <Iconify icon="solar:eye-bold" width={32} sx={{ color: 'text.disabled' }} />
                    <Typography variant="caption" color="text.disabled">
                      Click to select image
                    </Typography>
                  </Stack>
                )}
              </Box>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={handleCoverSelect}
              />
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Iconify icon="mingcute:add-line" width={14} />}
                onClick={() => fileInputRef.current?.click()}
              >
                {coverFile ? 'Change Image' : 'Select Image'}
              </Button>
              {coverFile && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: 'block', textAlign: 'center' }}
                >
                  {coverFile.name}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ── Right column: form + variants ── */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Basic Info */}
            <Card>
              <CardHeader title="Basic Information" subheader="All fields are required" />
              <CardContent>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      required
                      label="Attraction Name"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      required
                      label="Highlight Description"
                      multiline
                      rows={2}
                      inputProps={{ maxLength: 500 }}
                      helperText={`${form.highlight_description.length}/500`}
                      value={form.highlight_description}
                      onChange={(e) => update('highlight_description', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      required
                      label="Full Description"
                      multiline
                      rows={4}
                      value={form.description}
                      onChange={(e) => update('description', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      required
                      label="City"
                      value={form.city}
                      onChange={(e) => update('city', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      required
                      label="Province"
                      value={form.province}
                      onChange={(e) => update('province', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      required
                      label="Address"
                      value={form.address}
                      onChange={(e) => update('address', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      required
                      label="Google Maps Link"
                      placeholder="https://maps.google.com/..."
                      value={form.google_maps_link}
                      onChange={(e) => update('google_maps_link', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Variants */}
            <Card>
              <CardHeader
                title={`Pricing Variants (${variants.length})`}
                subheader="Optional — you can add more after creation"
                action={
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Iconify icon="mingcute:add-line" width={14} />}
                    onClick={addVariant}
                  >
                    Add Variant
                  </Button>
                }
              />
              <Divider />
              <CardContent>
                <Stack spacing={2}>
                  {variants.map((v) => (
                    <Box
                      key={v.tempId}
                      sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, sm: 5 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Variant Name"
                            value={v.name}
                            onChange={(e) => updateVariant(v.tempId, 'name', e.target.value)}
                          />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Price (THB)"
                            type="number"
                            slotProps={{ htmlInput: { min: 1 } }}
                            value={v.price}
                            error={v.price < 1}
                            helperText={v.price < 1 ? 'Min 1 THB' : ''}
                            onChange={(e) =>
                              updateVariant(v.tempId, 'price', Number(e.target.value))
                            }
                          />
                        </Grid>
                        <Grid size={{ xs: 4, sm: 3 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Description"
                            value={v.description}
                            onChange={(e) =>
                              updateVariant(v.tempId, 'description', e.target.value)
                            }
                          />
                        </Grid>
                        <Grid size={{ xs: 2, sm: 1 }}>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeVariant(v.tempId)}
                          >
                            <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                  {variants.length === 0 && (
                    <Box
                      sx={{
                        py: 4,
                        textAlign: 'center',
                        color: 'text.disabled',
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2">
                        No variants yet. Click &quot;Add Variant&quot; to add pricing options.
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
