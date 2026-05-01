import { useState, useEffect, useCallback, type ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

import { fetchRestaurant, updateRestaurant } from 'src/api/restaurant';

import type { OpeningHour, Restaurant, RestaurantStatus } from 'src/types';

// ----------------------------------------------------------------------

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const DEFAULT_HOURS: OpeningHour[] = DAY_NAMES.map((_, i) => ({
  day_of_week: i,
  opens_at: '09:00',
  closes_at: '21:00',
  is_closed: false,
}));

// ----------------------------------------------------------------------
// Basic info section
// ----------------------------------------------------------------------

interface BasicInfoSectionProps {
  restaurant: Restaurant;
  onSaved: (updated: Restaurant) => void;
}

function BasicInfoSection({ restaurant, onSaved }: BasicInfoSectionProps) {
  const [form, setForm] = useState({
    name: restaurant.name,
    description: restaurant.description ?? '',
    address: restaurant.address ?? '',
    phone: restaurant.phone ?? '',
    latitude: restaurant.latitude != null ? String(restaurant.latitude) : '',
    longitude: restaurant.longitude != null ? String(restaurant.longitude) : '',
    status: restaurant.status,
    min_order_thb: (restaurant.min_order_cents / 100).toFixed(2),
    delivery_radius_km: restaurant.delivery_radius_km != null ? String(restaurant.delivery_radius_km) : '',
    is_delivery_available: restaurant.is_delivery_available,
    is_pickup_available: restaurant.is_pickup_available,
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const updated = await updateRestaurant({
        name: form.name,
        description: form.description || null,
        address: form.address || null,
        phone: form.phone || null,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        status: form.status,
        min_order_cents: Math.round(parseFloat(form.min_order_thb || '0') * 100),
        delivery_radius_km: form.delivery_radius_km ? parseFloat(form.delivery_radius_km) : null,
        is_delivery_available: form.is_delivery_available,
        is_pickup_available: form.is_pickup_available,
      });
      onSaved(updated);
      setSuccess(true);
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Basic Information
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Saved successfully.</Alert>}

        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Restaurant name"
              fullWidth
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              disabled={saving}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as RestaurantStatus }))}
                disabled={saving}
              >
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
                <MenuItem value="paused">Paused</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            disabled={saving}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Address"
              fullWidth
              value={form.address}
              onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              disabled={saving}
            />
            <TextField
              label="Phone"
              fullWidth
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              disabled={saving}
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Latitude (optional)"
              fullWidth
              type="number"
              value={form.latitude}
              onChange={(e) => setForm((p) => ({ ...p, latitude: e.target.value }))}
              disabled={saving}
            />
            <TextField
              label="Longitude (optional)"
              fullWidth
              type="number"
              value={form.longitude}
              onChange={(e) => setForm((p) => ({ ...p, longitude: e.target.value }))}
              disabled={saving}
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Minimum order (THB)"
              fullWidth
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              value={form.min_order_thb}
              onChange={(e) => setForm((p) => ({ ...p, min_order_thb: e.target.value }))}
              disabled={saving}
            />
            <TextField
              label="Delivery radius (km)"
              fullWidth
              type="number"
              inputProps={{ min: 0, step: 0.1 }}
              value={form.delivery_radius_km}
              onChange={(e) => setForm((p) => ({ ...p, delivery_radius_km: e.target.value }))}
              disabled={saving}
            />
          </Stack>

          <Stack direction="row" spacing={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.is_delivery_available}
                  onChange={(e) => setForm((p) => ({ ...p, is_delivery_available: e.target.checked }))}
                  disabled={saving}
                />
              }
              label="Delivery available"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.is_pickup_available}
                  onChange={(e) => setForm((p) => ({ ...p, is_pickup_available: e.target.checked }))}
                  disabled={saving}
                />
              }
              label="Pickup available"
            />
          </Stack>

          <Box>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving || !form.name.trim()}
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {saving ? 'Saving…' : 'Save Info'}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------
// Photo upload box
// ----------------------------------------------------------------------

interface PhotoUploadBoxProps {
  label: string;
  currentUrl: string | null;
  onFileChange: (file: File) => void;
  inputId: string;
}

function PhotoUploadBox({ label, currentUrl, onFileChange, inputId }: PhotoUploadBoxProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileChange(file);
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={1}>
        {label}
      </Typography>
      <Box
        component="label"
        htmlFor={inputId}
        sx={{
          display: 'block',
          width: '100%',
          height: 160,
          borderRadius: 2,
          border: '2px dashed',
          borderColor: 'divider',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'grey.50',
          backgroundImage: currentUrl ? `url(${currentUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&:hover': { borderColor: 'primary.main', opacity: 0.9 },
        }}
      >
        {!currentUrl && (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={1}
            sx={{ height: '100%' }}
          >
            <AddPhotoAlternateIcon sx={{ color: 'text.disabled', fontSize: 36 }} />
            <Typography variant="caption" color="text.secondary">
              Click to upload
            </Typography>
          </Stack>
        )}
      </Box>
      <input id={inputId} type="file" accept="image/*" hidden onChange={handleChange} />
    </Box>
  );
}

// ----------------------------------------------------------------------
// Photos section
// ----------------------------------------------------------------------

interface PhotosSectionProps {
  restaurant: Restaurant;
  onSaved: (updated: Restaurant) => void;
}

function PhotosSection({ restaurant, onSaved }: PhotosSectionProps) {
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(restaurant.cover_photo_url);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(restaurant.logo_url);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCoverChange = useCallback((file: File) => {
    setCoverPhoto(file);
    setCoverPreview(URL.createObjectURL(file));
  }, []);

  const handleLogoChange = useCallback((file: File) => {
    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  }, []);

  const handleSave = async () => {
    if (!coverPhoto && !logo) {
      setError('Please select at least one photo to upload.');
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const updated = await updateRestaurant({}, coverPhoto, logo);
      onSaved(updated);
      setCoverPhoto(null);
      setLogo(null);
      setSuccess(true);
    } catch {
      setError('Failed to upload photos.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Photos
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Photos updated.</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} mb={2}>
          <Box sx={{ flex: 2 }}>
            <PhotoUploadBox
              label="Cover Photo"
              currentUrl={coverPreview}
              onFileChange={handleCoverChange}
              inputId="cover-photo-upload"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <PhotoUploadBox
              label="Logo"
              currentUrl={logoPreview}
              onFileChange={handleLogoChange}
              inputId="logo-upload"
            />
          </Box>
        </Stack>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || (!coverPhoto && !logo)}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {saving ? 'Uploading…' : 'Upload Photos'}
        </Button>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------
// Opening hours section
// ----------------------------------------------------------------------

interface HoursSectionProps {
  restaurant: Restaurant;
  onSaved: (updated: Restaurant) => void;
}

function HoursSection({ restaurant, onSaved }: HoursSectionProps) {
  const [hours, setHours] = useState<OpeningHour[]>(() => {
    if (restaurant.opening_hours.length === 7) return restaurant.opening_hours;
    // Fill missing days
    return DEFAULT_HOURS.map((def) => {
      const existing = restaurant.opening_hours.find((h) => h.day_of_week === def.day_of_week);
      return existing ?? def;
    });
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleHourChange = useCallback(
    (dayIndex: number, field: keyof OpeningHour, value: string | boolean) => {
      setHours((prev) =>
        prev.map((h) => (h.day_of_week === dayIndex ? { ...h, [field]: value } : h))
      );
    },
    []
  );

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const updated = await updateRestaurant({ opening_hours: hours });
      onSaved(updated);
      setSuccess(true);
    } catch {
      setError('Failed to save opening hours.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Opening Hours
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Hours saved.</Alert>}

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Day</TableCell>
                <TableCell>Opens at</TableCell>
                <TableCell>Closes at</TableCell>
                <TableCell>Closed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hours.map((h) => (
                <TableRow key={h.day_of_week}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {DAY_NAMES[h.day_of_week]}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="time"
                      size="small"
                      value={h.opens_at ?? ''}
                      onChange={(e) => handleHourChange(h.day_of_week, 'opens_at', e.target.value)}
                      disabled={h.is_closed || saving}
                      sx={{ width: 130 }}
                      inputProps={{ step: 60 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="time"
                      size="small"
                      value={h.closes_at ?? ''}
                      onChange={(e) => handleHourChange(h.day_of_week, 'closes_at', e.target.value)}
                      disabled={h.is_closed || saving}
                      sx={{ width: 130 }}
                      inputProps={{ step: 60 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      size="small"
                      checked={h.is_closed}
                      onChange={(e) => handleHourChange(h.day_of_week, 'is_closed', e.target.checked)}
                      disabled={saving}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={2}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {saving ? 'Saving…' : 'Save Hours'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------
// Main restaurant view
// ----------------------------------------------------------------------

export function RestaurantView() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRestaurant = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchRestaurant();
      setRestaurant(data);
      setError(null);
    } catch {
      setError('Failed to load restaurant data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRestaurant();
  }, [loadRestaurant]);

  const handleSaved = useCallback((updated: Restaurant) => {
    setRestaurant(updated);
  }, []);

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" action={<Button onClick={loadRestaurant}>Retry</Button>}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!restaurant) {
    return (
      <Box textAlign="center" py={8}>
        <Typography color="text.secondary">No restaurant profile found.</Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Contact support to create your restaurant.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Restaurant
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <BasicInfoSection restaurant={restaurant} onSaved={handleSaved} />
      <PhotosSection restaurant={restaurant} onSaved={handleSaved} />
      <HoursSection restaurant={restaurant} onSaved={handleSaved} />
    </Box>
  );
}
