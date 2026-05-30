import type { PlaceTag } from 'src/types';
import type { Theme } from '@mui/material/styles';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { PlacePhotoData, GoogleMatchStatus, GooglePlaceResult } from 'src/api/places';

import { useParams, useSearchParams } from 'react-router-dom';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import CardContent from '@mui/material/CardContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { tagsApi } from 'src/api/tags';
import { placesApi } from 'src/api/places';
import { DashboardContent } from 'src/layouts/dashboard';
import { categoriesApi, type CategoryData } from 'src/api/categories';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ── Google Match Status badge ─────────────────────────────────────────────────

function GoogleStatusBadge({ status }: { status: GoogleMatchStatus | null }) {
  if (!status) return <Label color="default">Not Connected</Label>;
  if (status === 'auto_matched') return <Label color="warning">Auto Matched</Label>;
  if (status === 'needs_manual') return <Label color="error">Not Found</Label>;
  return <Label color="success">✅ Verified</Label>;
}

// ----------------------------------------------------------------------

type FormState = {
  name_my: string;
  name_en: string;
  name_th: string;
  category_ids: number[];
  tag_ids: number[];
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
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const overallIdx = searchParams.get('idx') !== null ? Number(searchParams.get('idx')) : -1;
  const navTotal   = searchParams.get('total') !== null ? Number(searchParams.get('total')) : -1;
  const navSearch  = searchParams.get('search') ?? undefined;
  const navStatus  = searchParams.get('status') ?? undefined;

  const hasPrev = overallIdx > 0;
  const hasNext = overallIdx >= 0 && overallIdx < navTotal - 1;

  const [navLoading, setNavLoading] = useState<'prev' | 'next' | null>(null);

  const NAV_PER_PAGE = 100;

  const navigateToAdjacent = useCallback(
    async (direction: 'prev' | 'next') => {
      const targetIdx = direction === 'prev' ? overallIdx - 1 : overallIdx + 1;
      setNavLoading(direction);
      try {
        const targetPage = Math.floor(targetIdx / NAV_PER_PAGE) + 1;
        const posInPage  = targetIdx % NAV_PER_PAGE;
        const { data } = await placesApi.list({
          page: targetPage,
          per_page: NAV_PER_PAGE,
          search: navSearch,
          status: navStatus,
        });
        const target = data[posInPage];
        if (!target) return;
        const params = new URLSearchParams();
        params.set('idx', String(targetIdx));
        params.set('total', String(navTotal));
        if (navSearch) params.set('search', navSearch);
        if (navStatus) params.set('status', navStatus);
        router.push(`/places/${target.id}/edit?${params.toString()}`);
      } finally {
        setNavLoading(null);
      }
    },
    [overallIdx, navTotal, navSearch, navStatus, router]
  );

  const [form, setForm] = useState<FormState | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [tags, setTags] = useState<PlaceTag[]>([]);
  const [images, setImages] = useState<Array<{ id: number; url: string; sort_order: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // ── Google Place ID state ──────────────────────────────────────────────────
  const [googlePlaceId, setGooglePlaceId] = useState('');
  const [googleMatchStatus, setGoogleMatchStatus] = useState<GoogleMatchStatus | null>(null);
  const [googleSearchResults, setGoogleSearchResults] = useState<GooglePlaceResult[]>([]);
  const [isSearchingGoogle, setIsSearchingGoogle] = useState(false);
  const [isSavingGoogleId, setIsSavingGoogleId] = useState(false);
  const [showGoogleDropdown, setShowGoogleDropdown] = useState(false);
  const [googleIdSaved, setGoogleIdSaved] = useState(false);

  // ── Google Photos state ────────────────────────────────────────────────────
  const [googlePhotos, setGooglePhotos] = useState<PlacePhotoData[]>([]);
  const [isFetchingPhotos, setIsFetchingPhotos] = useState(false);
  const [addedToGallery, setAddedToGallery] = useState<Set<number>>(new Set());
  const [addingPhotoId, setAddingPhotoId] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      placesApi.get(id),
      categoriesApi.list({ per_page: 100 }),
      tagsApi.list({ per_page: 200 }),
    ])
      .then(([place, { data: cats }, { data: tagList }]) => {
        setCategories(cats);
        setTags(tagList);
        setImages(place.images ?? []);
        setGooglePlaceId(place.google_place_id ?? '');
        setGoogleMatchStatus(place.google_match_status ?? null);
        setForm({
          name_my: place.name_my ?? '',
          name_en: place.name_en ?? '',
          name_th: place.name_th ?? '',
          category_ids: (place.categories ?? []).map((c) => c.id),
          tag_ids: (place.tags ?? []).map((t) => t.id),
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
        // Load any previously fetched Google photos
        if (place.google_place_id) {
          placesApi.getGooglePhotos(id!).then((photos) => {
            setGooglePhotos(photos);
            setAddedToGallery(new Set(photos.filter((p) => p.is_selected).map((p) => p.id)));
          }).catch(() => {});
        }
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
    payload.category_ids = form.category_ids;
    payload.tag_ids = form.tag_ids;

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

  // ── Google Place ID handlers ───────────────────────────────────────────────

  const handleSearchGoogle = useCallback(() => {
    if (!form || !id) return;
    setIsSearchingGoogle(true);
    setShowGoogleDropdown(false);
    placesApi
      .searchGoogle(form.name_en || form.name_my, form.city)
      .then((results) => {
        setGoogleSearchResults(results);
        setShowGoogleDropdown(true);
      })
      .catch(() => setError('Google search failed. Check API key.'))
      .finally(() => setIsSearchingGoogle(false));
  }, [form, id]);

  const handleSelectGoogleResult = useCallback((result: GooglePlaceResult) => {
    setGooglePlaceId(result.id);
    setShowGoogleDropdown(false);
    setGoogleIdSaved(false);
  }, []);

  const handleSaveGooglePlaceId = useCallback(() => {
    if (!id || !googlePlaceId) return;
    setIsSavingGoogleId(true);
    placesApi
      .saveGooglePlaceId(id, googlePlaceId)
      .then((data) => {
        setGoogleMatchStatus(data.google_match_status);
        setGoogleIdSaved(true);
      })
      .catch(() => setError('Failed to save Google Place ID.'))
      .finally(() => setIsSavingGoogleId(false));
  }, [id, googlePlaceId]);

  // ── Google Photos handlers ─────────────────────────────────────────────────

  const handleFetchGooglePhotos = useCallback(() => {
    if (!id) return;
    setIsFetchingPhotos(true);
    setError('');
    placesApi
      .fetchGooglePhotos(id)
      .then((photos) => {
        setGooglePhotos(photos);
        setAddedToGallery(new Set(photos.filter((p) => p.is_selected).map((p) => p.id)));
      })
      .catch(() => setError('Failed to fetch Google photos. Make sure the Google Place ID is saved.'))
      .finally(() => setIsFetchingPhotos(false));
  }, [id]);

  const handleAddToGallery = useCallback((photo: PlacePhotoData) => {
    if (!id) return;
    setAddingPhotoId(photo.id);
    placesApi
      .addToGallery(id, photo.id)
      .then((newImage) => {
        setImages((prev) => [...prev, newImage]);
        setAddedToGallery((prev) => new Set([...prev, photo.id]));
      })
      .catch(() => setError('Failed to add photo to gallery.'))
      .finally(() => setAddingPhotoId(null));
  }, [id]);

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
        <Tooltip title="Back to list">
          <IconButton onClick={() => router.back()}>
            <Iconify icon="eva:arrow-ios-forward-fill" width={20} sx={{ transform: 'rotate(180deg)' }} />
          </IconButton>
        </Tooltip>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">Edit Place</Typography>
          <Typography variant="body2" color="text.secondary">ID: {id}</Typography>
        </Box>
        {overallIdx >= 0 && navTotal > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
              {overallIdx + 1} / {navTotal}
            </Typography>
            <Tooltip title="Previous place">
              <span>
                <IconButton
                  size="small"
                  disabled={!hasPrev || navLoading !== null}
                  onClick={() => navigateToAdjacent('prev')}
                >
                  {navLoading === 'prev'
                    ? <CircularProgress size={14} />
                    : <Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ transform: 'rotate(180deg)' }} />
                  }
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Next place">
              <span>
                <IconButton
                  size="small"
                  disabled={!hasNext || navLoading !== null}
                  onClick={() => navigateToAdjacent('next')}
                >
                  {navLoading === 'next'
                    ? <CircularProgress size={14} />
                    : <Iconify icon="eva:arrow-ios-forward-fill" width={18} />
                  }
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        )}
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
                      <InputLabel>Categories</InputLabel>
                      <Select
                        multiple
                        label="Categories"
                        value={form.category_ids}
                        input={<OutlinedInput label="Categories" />}
                        onChange={(e: SelectChangeEvent<number[]>) =>
                          setForm((prev) => prev && { ...prev, category_ids: e.target.value as number[] })
                        }
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {(selected as number[]).map((catId) => {
                              const cat = categories.find((c) => c.id === catId);
                              return <Chip key={catId} size="small" label={cat ? (cat.name_my ?? cat.name_en ?? cat.slug) : catId} />;
                            })}
                          </Box>
                        )}
                        MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
                      >
                        {categories.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id} sx={(theme: Theme) => ({
                            fontWeight: form.category_ids.includes(cat.id)
                              ? theme.typography.fontWeightBold
                              : theme.typography.fontWeightRegular,
                          })}>
                            {cat.name_my ?? cat.name_en ?? cat.slug}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Tags</InputLabel>
                      <Select
                        multiple
                        label="Tags"
                        value={form.tag_ids}
                        input={<OutlinedInput label="Tags" />}
                        onChange={(e: SelectChangeEvent<number[]>) =>
                          setForm((prev) => prev && { ...prev, tag_ids: e.target.value as number[] })
                        }
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {(selected as number[]).map((tagId) => {
                              const tag = tags.find((t) => t.id === tagId);
                              return <Chip key={tagId} size="small" label={tag ? (tag.name_my ?? tag.name_en ?? tag.slug) : tagId} />;
                            })}
                          </Box>
                        )}
                        MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
                      >
                        {tags.map((tag) => (
                          <MenuItem key={tag.id} value={tag.id} sx={(theme: Theme) => ({
                            fontWeight: form.tag_ids.includes(tag.id)
                              ? theme.typography.fontWeightBold
                              : theme.typography.fontWeightRegular,
                          })}>
                            {tag.name_my ?? tag.name_en ?? tag.slug}
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
            {/* ── Google Place ID ── */}
            <Card>
              <CardHeader title="Google Place ID" />
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <GoogleStatusBadge status={googleMatchStatus} />
                    {googleIdSaved && <Label color="success">Saved ✓</Label>}
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Google Place ID"
                      placeholder="ChIJ…"
                      value={googlePlaceId}
                      onChange={(e) => { setGooglePlaceId(e.target.value); setGoogleIdSaved(false); }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={isSearchingGoogle || !form}
                      onClick={handleSearchGoogle}
                      sx={{ whiteSpace: 'nowrap', minWidth: 130 }}
                      startIcon={isSearchingGoogle ? <CircularProgress size={12} /> : <Iconify icon="eva:search-fill" width={14} />}
                    >
                      {isSearchingGoogle ? 'Searching…' : 'Search Google'}
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      disabled={!googlePlaceId || isSavingGoogleId}
                      onClick={handleSaveGooglePlaceId}
                      sx={{ whiteSpace: 'nowrap', minWidth: 120 }}
                      startIcon={isSavingGoogleId ? <CircularProgress size={12} color="inherit" /> : <Iconify icon="eva:checkmark-fill" width={14} />}
                    >
                      {isSavingGoogleId ? 'Saving…' : 'Save & Verify'}
                    </Button>
                  </Stack>

                  {/* Search results dropdown */}
                  {showGoogleDropdown && googleSearchResults.length > 0 && (
                    <Paper variant="outlined" sx={{ p: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
                        Select the correct place:
                      </Typography>
                      <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                        {googleSearchResults.map((result) => (
                          <Box
                            key={result.id}
                            sx={{
                              px: 1.5, py: 1,
                              borderRadius: 1,
                              cursor: 'pointer',
                              '&:hover': { bgcolor: 'action.hover' },
                            }}
                            onClick={() => handleSelectGoogleResult(result)}
                          >
                            <Typography variant="body2" fontWeight={600}>{result.displayName}</Typography>
                            <Typography variant="caption" color="text.secondary">{result.formattedAddress}</Typography>
                            <Typography variant="caption" color="text.disabled" display="block" sx={{ fontSize: 10 }}>
                              ID: {result.id}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Paper>
                  )}
                  {showGoogleDropdown && googleSearchResults.length === 0 && (
                    <Alert severity="warning">No Google Places results found. Try adjusting the place name or city.</Alert>
                  )}
                </Stack>
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
          {/* ── Google Photos ── */}
          <Card>
            <CardHeader
              title="Google Photos"
              subheader="Fetch photos from Google, then add your favourites to the gallery above."
              action={
                <Tooltip title={!googlePlaceId ? 'Set a Google Place ID first' : ''}>
                  <span>
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={isFetchingPhotos || !googlePlaceId}
                      onClick={handleFetchGooglePhotos}
                      startIcon={
                        isFetchingPhotos
                          ? <CircularProgress size={12} />
                          : <Iconify icon="solar:restart-bold" width={14} />
                      }
                    >
                      {isFetchingPhotos ? 'Fetching…' : googlePhotos.length > 0 ? 'Refresh' : 'Fetch from Google'}
                    </Button>
                  </span>
                </Tooltip>
              }
            />
            <CardContent>
              {!googlePlaceId && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  Please set a Google Place ID first.
                </Typography>
              )}

              {googlePlaceId && isFetchingPhotos && (
                <Stack alignItems="center" spacing={1} sx={{ py: 3 }}>
                  <CircularProgress size={28} />
                  <Typography variant="body2" color="text.secondary">
                    Fetching photos from Google…
                  </Typography>
                </Stack>
              )}

              {googlePlaceId && !isFetchingPhotos && googlePhotos.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No photos fetched yet. Click &lsquo;Fetch from Google&rsquo; to start.
                </Typography>
              )}

              {googlePhotos.length > 0 && !isFetchingPhotos && (
                <>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={1}>
                    {googlePhotos.map((photo) => {
                      const isAdded = addedToGallery.has(photo.id);
                      const isAdding = addingPhotoId === photo.id;

                      return (
                        <Grid key={photo.id} size={{ xs: 4 }}>
                          <Box
                            sx={{
                              position: 'relative',
                              borderRadius: 1,
                              overflow: 'hidden',
                              border: isAdded ? '2px solid' : '2px solid transparent',
                              borderColor: isAdded ? 'success.main' : 'transparent',
                            }}
                          >
                            <Avatar
                              src={photo.photo_url}
                              variant="rounded"
                              sx={{ width: '100%', height: 80, borderRadius: 0 }}
                            />
                            {photo.author_name && (
                              <Typography
                                variant="caption"
                                sx={{
                                  display: 'block',
                                  px: 0.5,
                                  py: 0.25,
                                  fontSize: 9,
                                  color: 'text.secondary',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  bgcolor: 'background.paper',
                                }}
                              >
                                {photo.author_name}
                              </Typography>
                            )}
                            <Button
                              fullWidth
                              size="small"
                              variant={isAdded ? 'contained' : 'outlined'}
                              color={isAdded ? 'success' : 'primary'}
                              disabled={isAdded || isAdding}
                              onClick={() => handleAddToGallery(photo)}
                              sx={{ borderRadius: 0, fontSize: 10, py: 0.25 }}
                            >
                              {isAdding ? (
                                <CircularProgress size={10} color="inherit" />
                              ) : isAdded ? (
                                'Added ✓'
                              ) : (
                                '+ Gallery'
                              )}
                            </Button>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
