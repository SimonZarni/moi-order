import { useParams } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { attractionsApi, type AttractionData, type TicketImageData } from 'src/api/attractions';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const genTempId = () => Math.random().toString(36).slice(2, 10);

type LocalVariant = { tempId: string; id?: number; name: string; price: number; description: string };
type PendingImage = { tempId: string; file: File; preview: string };

type InfoForm = {
  name: string;
  highlight_description: string;
  description: string;
  google_maps_link: string;
  address: string;
  city: string;
  province: string;
  is_active: boolean;
};

// ----------------------------------------------------------------------

export function AttractionDetailView() {
  const { id } = useParams();
  const router = useRouter();

  const coverInputRef   = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [attraction, setAttraction]       = useState<AttractionData | null>(null);
  const [infoForm, setInfoForm]           = useState<InfoForm | null>(null);
  const [loading, setLoading]             = useState(true);
  const [variants, setVariants]           = useState<LocalVariant[]>([]);
  const [saving, setSaving]               = useState(false);
  const [saveError, setSaveError]         = useState('');
  const [images, setImages]               = useState<TicketImageData[]>([]);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [deletingId, setDeletingId]       = useState<number | null>(null);
  const [coverFile, setCoverFile]         = useState<File | null>(null);
  const [coverPreview, setCoverPreview]   = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([attractionsApi.get(id), attractionsApi.listVariants(id)])
      .then(([data, variantList]) => {
        setAttraction(data);
        setImages(data.images ?? []);
        setVariants(variantList.map((v) => ({ ...v, tempId: String(v.id) })));
        setInfoForm({
          name: data.name,
          highlight_description: data.highlight_description,
          description: data.description,
          google_maps_link: data.google_maps_link ?? '',
          address: data.address,
          city: data.city,
          province: data.province,
          is_active: data.is_active,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  // Revoke all pending object URLs on unmount
  useEffect(
    () => () => {
      pendingImages.forEach((p) => URL.revokeObjectURL(p.preview));
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    []
  );

  const updateInfo = (field: keyof InfoForm, value: string | boolean) => {
    setInfoForm((prev) => prev && { ...prev, [field]: value });
  };

  // ── Cover image ──────────────────────────────────────────────────────────

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  // ── Gallery images — local preview, uploaded on Save ─────────────────────

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    e.target.value = '';
    setPendingImages((prev) => [
      ...prev,
      ...files.map((file) => ({ tempId: genTempId(), file, preview: URL.createObjectURL(file) })),
    ]);
  };

  const removePendingImage = (tempId: string) => {
    setPendingImages((prev) => {
      const target = prev.find((p) => p.tempId === tempId);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((p) => p.tempId !== tempId);
    });
  };

  const handleDeleteImage = (imageId: number) => {
    if (!id) return;
    setDeletingId(imageId);
    attractionsApi
      .deleteImage(id, imageId)
      .then(() => setImages((prev) => prev.filter((img) => img.id !== imageId)))
      .catch(() => {})
      .finally(() => setDeletingId(null));
  };

  // ── Variants ──────────────────────────────────────────────────────────────

  const addVariant = () => {
    setVariants((prev) => [...prev, { tempId: genTempId(), name: '', price: 0, description: '' }]);
  };

  const updateVariant = (tempId: string, field: keyof LocalVariant, value: string | number) => {
    setVariants((prev) => prev.map((v) => (v.tempId === tempId ? { ...v, [field]: value } : v)));
  };

  const removeVariant = (tempId: string) => {
    const lv = variants.find((v) => v.tempId === tempId);
    if (lv?.id && id) attractionsApi.deleteVariant(Number(id), lv.id).catch(() => {});
    setVariants((prev) => prev.filter((v) => v.tempId !== tempId));
  };

  // ── Save ──────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!id || !attraction || !infoForm) return;
    setSaving(true);
    setSaveError('');
    try {
      // 1. Update basic info
      const updated = await attractionsApi.update(id, {
        name: infoForm.name,
        highlight_description: infoForm.highlight_description,
        description: infoForm.description,
        google_maps_link: infoForm.google_maps_link,
        address: infoForm.address,
        city: infoForm.city,
        province: infoForm.province,
        is_active: infoForm.is_active,
      });
      setAttraction(updated);

      // 2. Replace cover image if a new one was chosen
      if (coverFile) {
        const fd = new FormData();
        fd.append('_method', 'PUT');
        fd.append('cover_image', coverFile);
        const withCover = await attractionsApi.updateCover(Number(id), fd);
        setAttraction(withCover);
        if (coverPreview) URL.revokeObjectURL(coverPreview);
        setCoverFile(null);
        setCoverPreview(null);
      }

      // 3. Upload any pending gallery images
      if (pendingImages.length > 0) {
        const files = pendingImages.map((p) => p.file);
        const uploaded = await attractionsApi.uploadImages(Number(id), files);
        pendingImages.forEach((p) => URL.revokeObjectURL(p.preview));
        setPendingImages([]);
        setImages((prev) => [...prev, ...uploaded]);
      }

      // 4. Sync variants
      const current = attraction.variants ?? [];
      const removedIds = current
        .filter((v) => !variants.find((lv) => lv.id === v.id))
        .map((v) => v.id);
      const ops = [
        ...removedIds.map((vid) => attractionsApi.deleteVariant(Number(id), vid)),
        ...variants.map((lv, i) => {
          const payload = { name: lv.name, price: lv.price, description: lv.description, sort_order: i + 1 };
          return lv.id
            ? attractionsApi.updateVariant(Number(id), lv.id, payload)
            : attractionsApi.createVariant(Number(id), payload);
        }),
      ];
      await Promise.all(ops);
      const [data, variantList] = await Promise.all([
        attractionsApi.get(Number(id)),
        attractionsApi.listVariants(Number(id)),
      ]);
      setAttraction(data);
      setVariants(variantList.map((v) => ({ ...v, tempId: String(v.id) })));
    } catch {
      setSaveError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (!attraction || !infoForm) {
    return (
      <DashboardContent>
        <Alert severity="error">Attraction not found.</Alert>
      </DashboardContent>
    );
  }

  const totalPhotoCount = images.length + pendingImages.length;
  const hasPendingChanges = !!coverFile || pendingImages.length > 0;

  return (
    <DashboardContent>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => router.push('/attractions')}>
          <Iconify icon="eva:arrow-ios-forward-fill" width={20} sx={{ transform: 'rotate(180deg)' }} />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">{attraction.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {attraction.city}{attraction.province ? ` · ${attraction.province}` : ''}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={saving || variants.some((v) => !v.name.trim() || v.price < 1)}
          startIcon={saving ? <CircularProgress size={14} /> : <Iconify icon="eva:checkmark-fill" width={14} />}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </Box>

      {saveError && <Alert severity="error" sx={{ mb: 3 }}>{saveError}</Alert>}

      {hasPendingChanges && !saving && (
        <Alert severity="info" sx={{ mb: 3 }}>
          You have unsaved photo changes — click <strong>Save Changes</strong> to upload them.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* ── Left: photos ── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            {/* Cover image */}
            <Card>
              <CardHeader title="Cover Photo" subheader="Shown in listings and cards" />
              <CardContent>
                <Box
                  sx={{
                    width: '100%', height: 180, borderRadius: 1.5, overflow: 'hidden',
                    mb: 2, border: '1px dashed', borderColor: 'divider',
                    position: 'relative', cursor: 'pointer',
                    '&:hover .cover-overlay': { opacity: 1 },
                  }}
                  onClick={() => coverInputRef.current?.click()}
                >
                  <Avatar
                    src={coverPreview ?? attraction.cover_image_url ?? undefined}
                    variant="square"
                    sx={{ width: '100%', height: '100%', borderRadius: 1.5 }}
                  />
                  <Stack
                    className="cover-overlay"
                    alignItems="center" justifyContent="center" spacing={0.5}
                    sx={{
                      position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.45)',
                      opacity: 0, transition: 'opacity 0.2s', borderRadius: 1.5,
                    }}
                  >
                    <Iconify icon="solar:pen-bold" width={22} sx={{ color: 'common.white' }} />
                    <Typography variant="caption" sx={{ color: 'common.white' }}>Change cover</Typography>
                  </Stack>
                </Box>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  onChange={handleCoverSelect}
                />
                <Button
                  fullWidth variant="outlined"
                  startIcon={<Iconify icon="mingcute:add-line" width={14} />}
                  onClick={() => coverInputRef.current?.click()}
                >
                  {coverFile ? 'Change Cover' : 'Replace Cover'}
                </Button>
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card>
              <CardHeader
                title={`Gallery (${totalPhotoCount} photos)`}
                subheader="First photo shown as gallery cover"
                action={
                  <Button
                    size="small" variant="outlined"
                    startIcon={<Iconify icon="mingcute:add-line" width={14} />}
                    onClick={() => galleryInputRef.current?.click()}
                  >
                    Add Photos
                  </Button>
                }
              />
              <CardContent>
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  hidden
                  onChange={handleGallerySelect}
                />
                <Grid container spacing={1}>
                  {images.map((img, idx) => (
                    <Grid key={img.id} size={{ xs: 6 }}>
                      <Box
                        sx={{
                          position: 'relative', borderRadius: 1, overflow: 'hidden',
                          '&:hover .del-btn': { opacity: 1 },
                        }}
                      >
                        <Avatar src={img.url} variant="rounded" sx={{ width: '100%', height: 80 }} />
                        {idx === 0 && (
                          <Chip
                            label="Cover" size="small" color="primary"
                            sx={{ position: 'absolute', top: 4, left: 4, height: 18, fontSize: 10 }}
                          />
                        )}
                        <IconButton
                          className="del-btn"
                          size="small" color="error"
                          disabled={deletingId === img.id}
                          sx={{
                            position: 'absolute', top: 4, right: 4,
                            bgcolor: 'rgba(255,255,255,0.9)', opacity: 0,
                            transition: 'opacity 0.2s',
                            '&:hover': { bgcolor: 'white' },
                          }}
                          onClick={() => handleDeleteImage(img.id)}
                        >
                          {deletingId === img.id
                            ? <CircularProgress size={12} />
                            : <Iconify icon="mingcute:close-line" width={14} />}
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}

                  {pendingImages.map((p) => (
                    <Grid key={p.tempId} size={{ xs: 6 }}>
                      <Box
                        sx={{
                          position: 'relative', borderRadius: 1, overflow: 'hidden',
                          outline: '2px solid', outlineColor: 'warning.main',
                          '&:hover .del-btn': { opacity: 1 },
                        }}
                      >
                        <Avatar src={p.preview} variant="rounded" sx={{ width: '100%', height: 80 }} />
                        <Chip
                          label="Pending" size="small" color="warning"
                          sx={{ position: 'absolute', top: 4, left: 4, height: 18, fontSize: 10 }}
                        />
                        <IconButton
                          className="del-btn"
                          size="small" color="error"
                          sx={{
                            position: 'absolute', top: 4, right: 4,
                            bgcolor: 'rgba(255,255,255,0.9)', opacity: 0,
                            transition: 'opacity 0.2s',
                            '&:hover': { bgcolor: 'white' },
                          }}
                          onClick={() => removePendingImage(p.tempId)}
                        >
                          <Iconify icon="mingcute:close-line" width={14} />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}

                  <Grid size={{ xs: 6 }}>
                    <Box
                      sx={{
                        height: 80, border: '1px dashed', borderColor: 'divider',
                        borderRadius: 1, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                      onClick={() => galleryInputRef.current?.click()}
                    >
                      <Iconify icon="mingcute:add-line" width={24} sx={{ color: 'text.disabled' }} />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* ── Right: info + variants ── */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Basic Info */}
            <Card>
              <CardHeader title="Basic Information" />
              <CardContent>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth required label="Name"
                      value={infoForm.name}
                      onChange={(e) => updateInfo('name', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth label="Highlight Description"
                      multiline rows={2}
                      inputProps={{ maxLength: 500 }}
                      value={infoForm.highlight_description}
                      onChange={(e) => updateInfo('highlight_description', e.target.value)}
                      helperText={`${infoForm.highlight_description.length}/500`}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth label="Description"
                      multiline rows={4}
                      value={infoForm.description}
                      onChange={(e) => updateInfo('description', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth label="City"
                      value={infoForm.city}
                      onChange={(e) => updateInfo('city', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth label="Province"
                      value={infoForm.province}
                      onChange={(e) => updateInfo('province', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth label="Address"
                      value={infoForm.address}
                      onChange={(e) => updateInfo('address', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth label="Google Maps Link"
                      placeholder="https://maps.google.com/..."
                      value={infoForm.google_maps_link}
                      onChange={(e) => updateInfo('google_maps_link', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={infoForm.is_active}
                          onChange={(e) => updateInfo('is_active', e.target.checked)}
                        />
                      }
                      label="Active (visible to users)"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Variants */}
            <Card>
              <CardHeader
                title={`Pricing Variants (${variants.length})`}
                action={
                  <Button
                    size="small" variant="outlined"
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
                    <Box key={v.tempId} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, sm: 5 }}>
                          <TextField
                            fullWidth size="small" label="Variant Name"
                            value={v.name}
                            onChange={(e) => updateVariant(v.tempId, 'name', e.target.value)}
                          />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <TextField
                            fullWidth size="small" label="Price (THB)" type="number"
                            slotProps={{ htmlInput: { min: 1 } }}
                            value={v.price}
                            error={v.price < 1}
                            helperText={v.price < 1 ? 'Min 1 THB' : ''}
                            onChange={(e) => updateVariant(v.tempId, 'price', Number(e.target.value))}
                          />
                        </Grid>
                        <Grid size={{ xs: 4, sm: 3 }}>
                          <TextField
                            fullWidth size="small" label="Description"
                            value={v.description}
                            onChange={(e) => updateVariant(v.tempId, 'description', e.target.value)}
                          />
                        </Grid>
                        <Grid size={{ xs: 2, sm: 1 }}>
                          <IconButton size="small" color="error" onClick={() => removeVariant(v.tempId)}>
                            <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                  {variants.length === 0 && (
                    <Box
                      sx={{
                        py: 4, textAlign: 'center', color: 'text.disabled',
                        border: '1px dashed', borderColor: 'divider', borderRadius: 1,
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
