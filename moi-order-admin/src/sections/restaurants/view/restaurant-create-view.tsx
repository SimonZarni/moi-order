import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { usersApi, type UserData } from 'src/api/users';
import { DashboardContent } from 'src/layouts/dashboard';
import { restaurantsApi, type OpeningHour, type OpeningHourSession } from 'src/api/restaurants';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const DEFAULT_HOURS: OpeningHour[] = DAY_NAMES.map((_, i) => ({
  day_of_week: i,
  is_closed: false,
  sessions: [{ opens_at: '10:00', closes_at: '22:00', sort_order: 0 }],
}));

type FormState = {
  name: string;
  description: string;
  phone: string;
  address: string;
  latitude: string;
  longitude: string;
  is_delivery_available: boolean;
  is_pickup_available: boolean;
  min_order_display: string;
  delivery_radius_km: string;
  status: 'open' | 'closed' | 'paused';
};

const EMPTY_FORM: FormState = {
  name: '',
  description: '',
  phone: '',
  address: '',
  latitude: '',
  longitude: '',
  is_delivery_available: true,
  is_pickup_available: true,
  min_order_display: '',
  delivery_radius_km: '',
  status: 'open',
};

// ----------------------------------------------------------------------

export function RestaurantCreateView() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [hours, setHours] = useState<OpeningHour[]>(DEFAULT_HOURS);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userOptions, setUserOptions] = useState<UserData[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userLoading, setUserLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [logoPhoto, setLogoPhoto] = useState<File | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Debounced user search
  useEffect(() => {
    if (userSearch.length < 2) { setUserOptions([]); return undefined; }
    setUserLoading(true);
    const t = setTimeout(() => {
      usersApi
        .list({ search: userSearch, per_page: 20 })
        .then(({ data }) => setUserOptions(data))
        .catch(() => {})
        .finally(() => setUserLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [userSearch]);

  const set = useCallback((field: keyof FormState, value: string | boolean) => {
    setFieldErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setHourClosed = useCallback((dayIndex: number, closed: boolean) => {
    setHours((prev) =>
      prev.map((h) => h.day_of_week === dayIndex ? { ...h, is_closed: closed } : h)
    );
  }, []);

  const setSessionField = useCallback(
    (dayIndex: number, field: keyof Omit<OpeningHourSession, 'sort_order'>, value: string) => {
      setHours((prev) =>
        prev.map((h) => {
          if (h.day_of_week !== dayIndex) return h;
          const sessions = h.sessions.map((s, i) => i === 0 ? { ...s, [field]: value } : s);
          return { ...h, sessions };
        })
      );
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    if (!form.name.trim()) { setFieldErrors({ name: 'Restaurant name is required.' }); return; }
    if (!selectedUser) { setError('Please select a user to assign this restaurant to.'); return; }

    setSaving(true);
    setError('');

    const minOrderCents = form.min_order_display ? Math.round(parseFloat(form.min_order_display) * 100) : 0;

    restaurantsApi
      .create({
        user_id:                selectedUser.id,
        name:                   form.name.trim(),
        description:            form.description.trim() || undefined,
        phone:                  form.phone.trim() || undefined,
        address:                form.address.trim() || undefined,
        latitude:               form.latitude ? parseFloat(form.latitude) : null,
        longitude:              form.longitude ? parseFloat(form.longitude) : null,
        is_delivery_available:  form.is_delivery_available,
        is_pickup_available:    form.is_pickup_available,
        min_order_cents:        minOrderCents,
        delivery_radius_km:     form.delivery_radius_km ? parseFloat(form.delivery_radius_km) : null,
        status:                 form.status,
        opening_hours:          hours,
      }, coverPhoto, logoPhoto)
      .then((restaurant) => router.push(`/restaurants/${restaurant.id}`))
      .catch((err) => {
        if (err?.response?.status === 422) {
          const errs = err.response.data?.errors ?? {};
          const flat: Record<string, string> = {};
          Object.entries(errs).forEach(([k, v]) => { flat[k] = Array.isArray(v) ? v[0] : String(v); });
          setFieldErrors(flat);
        } else {
          setError(err?.response?.data?.message ?? 'Failed to create restaurant.');
        }
      })
      .finally(() => setSaving(false));
  }, [form, hours, selectedUser, router, coverPhoto, logoPhoto]);

  return (
    <DashboardContent>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          size="small"
          startIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={20} sx={{ transform: 'rotate(180deg)' }} />}
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          New Restaurant
        </Typography>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={14} /> : <Iconify icon="mingcute:add-line" />}
        >
          Create Restaurant
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* ── Left: Basic info + Opening Hours ── */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={3}>
            {/* Basic Info */}
            <Card>
              <CardHeader title="Basic Information" />
              <CardContent>
                <Stack spacing={2.5}>
                  {/* Cover photo + logo uploads */}
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Cover Photo</Typography>
                      <Box
                        onClick={() => coverInputRef.current?.click()}
                        sx={{ height: 110, border: '1.5px dashed', borderColor: 'grey.300', borderRadius: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', '&:hover': { borderColor: 'primary.main' } }}
                      >
                        {coverPhoto ? (
                          <Box component="img" src={URL.createObjectURL(coverPhoto)} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', px: 1 }}>Click to upload</Typography>
                        )}
                      </Box>
                      <input ref={coverInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={(e) => setCoverPhoto(e.target.files?.[0] ?? null)} />
                    </Box>
                    <Box sx={{ width: 110 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Logo</Typography>
                      <Box
                        onClick={() => logoInputRef.current?.click()}
                        sx={{ height: 110, border: '1.5px dashed', borderColor: 'grey.300', borderRadius: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', '&:hover': { borderColor: 'primary.main' } }}
                      >
                        {logoPhoto ? (
                          <Box component="img" src={URL.createObjectURL(logoPhoto)} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', px: 1 }}>Click to upload</Typography>
                        )}
                      </Box>
                      <input ref={logoInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={(e) => setLogoPhoto(e.target.files?.[0] ?? null)} />
                    </Box>
                  </Box>

                  <TextField
                    label="Restaurant Name"
                    required
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    error={!!fieldErrors.name}
                    helperText={fieldErrors.name}
                    fullWidth
                  />
                  <TextField
                    label="Description"
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                  />
                  <TextField
                    label="Phone"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    error={!!fieldErrors.phone}
                    helperText={fieldErrors.phone}
                    fullWidth
                  />
                  <TextField
                    label="Address"
                    value={form.address}
                    onChange={(e) => set('address', e.target.value)}
                    multiline
                    rows={2}
                    fullWidth
                  />
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        label="Latitude"
                        type="number"
                        value={form.latitude}
                        onChange={(e) => set('latitude', e.target.value)}
                        error={!!fieldErrors.latitude}
                        helperText={fieldErrors.latitude ?? 'e.g. 13.7418'}
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        label="Longitude"
                        type="number"
                        value={form.longitude}
                        onChange={(e) => set('longitude', e.target.value)}
                        error={!!fieldErrors.longitude}
                        helperText={fieldErrors.longitude ?? 'e.g. 100.5592'}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>

            {/* Opening Hours */}
            <Card>
              <CardHeader title="Opening Hours" subheader="Set operating hours for each day of the week." />
              <CardContent sx={{ pt: 1 }}>
                <Stack spacing={1}>
                  {hours.map((h) => (
                    <Box key={h.day_of_week}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ width: 90, flexShrink: 0 }}>
                          {DAY_NAMES[h.day_of_week]}
                        </Typography>
                        <TextField
                          type="time"
                          size="small"
                          value={h.sessions[0]?.opens_at ?? ''}
                          onChange={(e) => setSessionField(h.day_of_week, 'opens_at', e.target.value)}
                          disabled={h.is_closed}
                          sx={{ width: 130 }}
                          inputProps={{ step: 60 }}
                        />
                        <Typography variant="body2" color="text.secondary">to</Typography>
                        <TextField
                          type="time"
                          size="small"
                          value={h.sessions[0]?.closes_at ?? ''}
                          onChange={(e) => setSessionField(h.day_of_week, 'closes_at', e.target.value)}
                          disabled={h.is_closed}
                          sx={{ width: 130 }}
                          inputProps={{ step: 60 }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              checked={h.is_closed}
                              onChange={(e) => setHourClosed(h.day_of_week, e.target.checked)}
                            />
                          }
                          label={<Typography variant="body2" color="text.secondary">Closed</Typography>}
                          sx={{ ml: 'auto', mr: 0 }}
                        />
                      </Box>
                      <Divider sx={{ mt: 1 }} />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* ── Right: Assign user + Delivery settings ── */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={3}>
            {/* Assign to user */}
            <Card>
              <CardHeader
                title="Assign to User"
                subheader="The user will be promoted to merchant automatically."
              />
              <CardContent>
                <Autocomplete
                  options={userOptions}
                  value={selectedUser}
                  loading={userLoading}
                  getOptionLabel={(u) => `${u.name} — ${u.email}`}
                  isOptionEqualToValue={(a, b) => a.id === b.id}
                  onInputChange={(_, v, reason) => { if (reason === 'input') setUserSearch(v); }}
                  onChange={(_, v) => { setSelectedUser(v); setError(''); }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search users by name or email"
                      placeholder="Type at least 2 characters…"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {userLoading && <CircularProgress size={14} />}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, u) => (
                    <MenuItem {...props} key={u.id}>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{u.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                      </Box>
                    </MenuItem>
                  )}
                  noOptionsText={userSearch.length < 2 ? 'Type at least 2 characters' : 'No users found'}
                />
              </CardContent>
            </Card>

            {/* Delivery Settings */}
            <Card>
              <CardHeader title="Delivery & Order Settings" />
              <CardContent>
                <Stack spacing={2}>
                  <TextField
                    select
                    label="Initial Status"
                    value={form.status}
                    onChange={(e) => set('status', e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="open">Open — visible to customers immediately</MenuItem>
                    <MenuItem value="closed">Closed — hidden from customers</MenuItem>
                    <MenuItem value="paused">Paused — temporarily unavailable</MenuItem>
                  </TextField>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Delivery available</Typography>
                    <Switch
                      checked={form.is_delivery_available}
                      onChange={(e) => set('is_delivery_available', e.target.checked)}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Pickup available</Typography>
                    <Switch
                      checked={form.is_pickup_available}
                      onChange={(e) => set('is_pickup_available', e.target.checked)}
                    />
                  </Box>
                  <TextField
                    label="Minimum Order Amount"
                    type="number"
                    value={form.min_order_display}
                    onChange={(e) => set('min_order_display', e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                    }}
                    helperText="Leave blank for no minimum"
                    fullWidth
                  />
                  <TextField
                    label="Delivery Radius"
                    type="number"
                    value={form.delivery_radius_km}
                    onChange={(e) => set('delivery_radius_km', e.target.value)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">km</InputAdornment>,
                    }}
                    helperText="Leave blank for no radius limit"
                    fullWidth
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Save button (also at top) */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleSubmit}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={16} /> : <Iconify icon="mingcute:add-line" />}
            >
              {saving ? 'Creating…' : 'Create Restaurant'}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
