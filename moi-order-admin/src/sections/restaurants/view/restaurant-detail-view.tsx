import { useParams } from 'react-router-dom';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import DialogTitle from '@mui/material/DialogTitle';
import CardContent from '@mui/material/CardContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { fCurrency } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  restaurantsApi,
  type OpeningHour,
  type MenuItemDetail,
  type RestaurantDetail,
  type RestaurantStatus,
  type MenuCategoryDetail,
} from 'src/api/restaurants';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const STATUS_COLOR: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  open: 'success',
  paused: 'warning',
  closed: 'error',
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ── Types ─────────────────────────────────────────────────────────────────────

type ItemDialogState = {
  open: boolean;
  categoryId: number | null;
  item: MenuItemDetail | null;
};

type EditInfoState = {
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
};

// ----------------------------------------------------------------------

export function RestaurantDetailView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Status
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Edit info dialog
  const [editInfoOpen, setEditInfoOpen] = useState(false);
  const [editInfo, setEditInfo] = useState<EditInfoState | null>(null);
  const [editInfoSaving, setEditInfoSaving] = useState(false);
  const [editInfoError, setEditInfoError] = useState('');
  const [editCoverPhoto, setEditCoverPhoto] = useState<File | null>(null);
  const [editLogoPhoto, setEditLogoPhoto] = useState<File | null>(null);
  const editCoverRef = useRef<HTMLInputElement>(null);
  const editLogoRef = useRef<HTMLInputElement>(null);

  // Opening hours inline edit
  const [editingHours, setEditingHours] = useState(false);
  const [hoursForm, setHoursForm] = useState<OpeningHour[]>([]);
  const [hoursSaving, setHoursSaving] = useState(false);

  // Category inline add/edit
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryAdding, setCategoryAdding] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  // Item dialog
  const [itemDialog, setItemDialog] = useState<ItemDialogState>({ open: false, categoryId: null, item: null });
  const [itemForm, setItemForm] = useState({ name: '', description: '', price_display: '', status: 'available' as 'available' | 'unavailable' });
  const [itemSaving, setItemSaving] = useState(false);
  const [itemError, setItemError] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Inline status toggling
  const [togglingItemId, setTogglingItemId] = useState<number | null>(null);

  // Delete confirmations
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [deleteRestaurantOpen, setDeleteRestaurantOpen] = useState(false);

  // ── Load ────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    restaurantsApi
      .get(id)
      .then(setRestaurant)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  // ── Status ──────────────────────────────────────────────────────────────────

  const handleStatusChange = useCallback((status: RestaurantStatus) => {
    if (!id || !restaurant) return;
    setStatusUpdating(true);
    restaurantsApi
      .updateStatus(id, status)
      .then(({ status: s }) => setRestaurant((prev) => prev ? { ...prev, status: s } : prev))
      .catch(() => {})
      .finally(() => setStatusUpdating(false));
  }, [id, restaurant]);

  // ── Edit info ───────────────────────────────────────────────────────────────

  const openEditInfo = useCallback(() => {
    if (!restaurant) return;
    setEditInfo({
      name:                   restaurant.name,
      description:            restaurant.description ?? '',
      phone:                  restaurant.phone ?? '',
      address:                restaurant.address ?? '',
      latitude:               restaurant.latitude != null ? String(restaurant.latitude) : '',
      longitude:              restaurant.longitude != null ? String(restaurant.longitude) : '',
      is_delivery_available:  restaurant.is_delivery_available,
      is_pickup_available:    restaurant.is_pickup_available,
      min_order_display:      restaurant.min_order_cents > 0 ? String(restaurant.min_order_cents / 100) : '',
      delivery_radius_km:     restaurant.delivery_radius_km != null ? String(restaurant.delivery_radius_km) : '',
    });
    setEditInfoOpen(true);
    setEditInfoError('');
    setEditCoverPhoto(null);
    setEditLogoPhoto(null);
  }, [restaurant]);

  const handleSaveInfo = useCallback(() => {
    if (!id || !editInfo) return;
    setEditInfoSaving(true);
    setEditInfoError('');
    restaurantsApi
      .update(id, {
        name:                   editInfo.name.trim(),
        description:            editInfo.description.trim() || undefined,
        phone:                  editInfo.phone.trim() || undefined,
        address:                editInfo.address.trim() || undefined,
        latitude:               editInfo.latitude ? parseFloat(editInfo.latitude) : null,
        longitude:              editInfo.longitude ? parseFloat(editInfo.longitude) : null,
        is_delivery_available:  editInfo.is_delivery_available,
        is_pickup_available:    editInfo.is_pickup_available,
        min_order_cents:        editInfo.min_order_display ? Math.round(parseFloat(editInfo.min_order_display) * 100) : 0,
        delivery_radius_km:     editInfo.delivery_radius_km ? parseFloat(editInfo.delivery_radius_km) : null,
      }, editCoverPhoto, editLogoPhoto)
      .then((updated) => {
        setRestaurant((prev) => prev ? { ...updated, menu: prev.menu, opening_hours: prev.opening_hours } : prev);
        setEditInfoOpen(false);
      })
      .catch((err) => setEditInfoError(err?.response?.data?.message ?? 'Failed to save.'))
      .finally(() => setEditInfoSaving(false));
  }, [id, editInfo, editCoverPhoto, editLogoPhoto]);

  // ── Opening hours ────────────────────────────────────────────────────────────

  const startEditHours = useCallback(() => {
    if (!restaurant) return;
    setHoursForm(restaurant.opening_hours.map((h) => ({ ...h })));
    setEditingHours(true);
  }, [restaurant]);

  const setHourField = useCallback((day: number, field: keyof OpeningHour, value: string | boolean) => {
    setHoursForm((prev) => prev.map((h) => h.day_of_week === day ? { ...h, [field]: value } : h));
  }, []);

  const handleSaveHours = useCallback(() => {
    if (!id) return;
    setHoursSaving(true);
    restaurantsApi
      .update(id, { opening_hours: hoursForm })
      .then((updated) => {
        setRestaurant((prev) => prev ? { ...prev, opening_hours: updated.opening_hours } : prev);
        setEditingHours(false);
      })
      .catch(() => {})
      .finally(() => setHoursSaving(false));
  }, [id, hoursForm]);

  // ── Categories ───────────────────────────────────────────────────────────────

  const handleAddCategory = useCallback(() => {
    if (!id || !newCategoryName.trim()) return;
    setCategoryAdding(true);
    restaurantsApi
      .addCategory(id, { name: newCategoryName.trim(), sort_order: (restaurant?.menu.length ?? 0) + 1 })
      .then((cat) => {
        setRestaurant((prev) => prev ? { ...prev, menu: [...prev.menu, { ...cat, items: [] }] } : prev);
        setNewCategoryName('');
        setAddingCategory(false);
      })
      .catch(() => {})
      .finally(() => setCategoryAdding(false));
  }, [id, newCategoryName, restaurant]);

  const handleSaveCategoryName = useCallback((cat: MenuCategoryDetail) => {
    if (!id || !editingCategoryName.trim()) return;
    restaurantsApi
      .updateCategory(id, cat.id, { name: editingCategoryName.trim(), sort_order: cat.sort_order })
      .then((updated) => {
        setRestaurant((prev) => prev ? {
          ...prev,
          menu: prev.menu.map((c) => c.id === cat.id ? { ...c, name: updated.name } : c),
        } : prev);
        setEditingCategoryId(null);
      })
      .catch(() => {});
  }, [id, editingCategoryName]);

  const handleDeleteCategory = useCallback((catId: number) => {
    if (!id) return;
    setDeletingCategoryId(catId);
    restaurantsApi
      .deleteCategory(id, catId)
      .then(() => setRestaurant((prev) => prev ? { ...prev, menu: prev.menu.filter((c) => c.id !== catId) } : prev))
      .catch(() => {})
      .finally(() => setDeletingCategoryId(null));
  }, [id]);

  // ── Items ────────────────────────────────────────────────────────────────────

  const openAddItem = useCallback((categoryId: number) => {
    setItemForm({ name: '', description: '', price_display: '', status: 'available' });
    setItemDialog({ open: true, categoryId, item: null });
    setItemError('');
    setPhotoFile(null);
  }, []);

  const openEditItem = useCallback((item: MenuItemDetail, categoryId: number) => {
    setItemForm({
      name:          item.name,
      description:   item.description ?? '',
      price_display: String(item.price_cents / 100),
      status:        item.status,
    });
    setItemDialog({ open: true, categoryId, item });
    setItemError('');
    setPhotoFile(null);
  }, []);

  const handleSaveItem = useCallback(() => {
    if (!id || !itemDialog.categoryId) return;
    if (!itemForm.name.trim()) { setItemError('Item name is required.'); return; }
    if (!itemForm.price_display) { setItemError('Price is required.'); return; }

    const priceCents = Math.round(parseFloat(itemForm.price_display) * 100);
    if (Number.isNaN(priceCents) || priceCents < 0) { setItemError('Enter a valid price.'); return; }

    setItemSaving(true);
    setItemError('');

    const payload = {
      menu_category_id: itemDialog.categoryId,
      name:             itemForm.name.trim(),
      description:      itemForm.description.trim() || undefined,
      price_cents:      priceCents,
      status:           itemForm.status,
    };

    const request = itemDialog.item
      ? restaurantsApi.updateItem(id, itemDialog.item.id, payload, photoFile)
      : restaurantsApi.addItem(id, payload, photoFile);

    request
      .then((saved) => {
        setRestaurant((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            menu: prev.menu.map((cat) => {
              if (itemDialog.item) {
                const withoutOld = cat.items.filter((i) => i.id !== itemDialog.item!.id);
                const withNew = cat.id === payload.menu_category_id ? [...withoutOld, saved] : withoutOld;
                return { ...cat, items: withNew };
              }
              if (cat.id === payload.menu_category_id) {
                return { ...cat, items: [...cat.items, saved] };
              }
              return cat;
            }),
          };
        });
        setItemDialog({ open: false, categoryId: null, item: null });
        setPhotoFile(null);
      })
      .catch((err) => setItemError(err?.response?.data?.message ?? 'Failed to save item.'))
      .finally(() => setItemSaving(false));
  }, [id, itemDialog, itemForm, photoFile]);

  const handleDeleteItem = useCallback((itemId: number) => {
    if (!id) return;
    setDeletingItemId(itemId);
    restaurantsApi
      .deleteItem(id, itemId)
      .then(() =>
        setRestaurant((prev) => prev ? {
          ...prev,
          menu: prev.menu.map((c) => ({ ...c, items: c.items.filter((i) => i.id !== itemId) })),
        } : prev)
      )
      .catch(() => {})
      .finally(() => setDeletingItemId(null));
  }, [id]);

  // ── Inline item status toggle ────────────────────────────────────────────────

  const handleToggleItemStatus = useCallback((item: MenuItemDetail, categoryId: number) => {
    if (!id) return;
    const newStatus = item.status === 'available' ? 'unavailable' : 'available';
    setTogglingItemId(item.id);
    restaurantsApi
      .updateItem(id, item.id, { status: newStatus })
      .then((saved) => {
        setRestaurant((prev) => prev ? {
          ...prev,
          menu: prev.menu.map((c) =>
            c.id === categoryId
              ? { ...c, items: c.items.map((i) => (i.id === item.id ? saved : i)) }
              : c
          ),
        } : prev);
      })
      .catch(() => {})
      .finally(() => setTogglingItemId(null));
  }, [id]);

  // ── Delete restaurant ────────────────────────────────────────────────────────

  const handleDeleteRestaurant = useCallback(() => {
    if (!id) return;
    restaurantsApi.remove(id).then(() => router.push('/restaurants')).catch(() => {});
  }, [id, router]);

  // ── Render ───────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (!restaurant) {
    return (
      <DashboardContent>
        <Typography color="error">Restaurant not found.</Typography>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      {/* ── Header ── */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button
          size="small"
          startIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={20} sx={{ transform: 'rotate(180deg)' }} />}
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>{restaurant.name}</Typography>
        <Label color={STATUS_COLOR[restaurant.status] ?? 'default'}>{restaurant.status}</Label>
        <Select
          size="small"
          value={restaurant.status}
          disabled={statusUpdating}
          onChange={(e) => handleStatusChange(e.target.value as RestaurantStatus)}
          sx={{ minWidth: 130 }}
        >
          <MenuItem value="open">Set Open</MenuItem>
          <MenuItem value="paused">Set Paused</MenuItem>
          <MenuItem value="closed">Set Closed</MenuItem>
        </Select>
        <Button size="small" variant="outlined" startIcon={<Iconify icon="solar:pen-bold" width={14} />} onClick={openEditInfo}>
          Edit Info
        </Button>
        <Button size="small" color="error" variant="outlined" startIcon={<Iconify icon="solar:trash-bin-trash-bold" width={14} />} onClick={() => setDeleteRestaurantOpen(true)}>
          Delete
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* ── Info card ── */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Restaurant Info" />
            <CardContent>
              <Stack spacing={1.5}>
                <InfoRow label="Merchant" value={`${restaurant.merchant.name} (${restaurant.merchant.email})`} />
                <InfoRow label="Address" value={restaurant.address ?? '—'} />
                <InfoRow label="Phone" value={restaurant.phone ?? '—'} />
                <InfoRow label="Description" value={restaurant.description ?? '—'} />
                <InfoRow label="Min Order" value={fCurrency(restaurant.min_order_cents / 100)} />
                <InfoRow label="Delivery Radius" value={restaurant.delivery_radius_km ? `${restaurant.delivery_radius_km} km` : 'No limit'} />
                <InfoRow label="GPS" value={restaurant.latitude ? `${restaurant.latitude}, ${restaurant.longitude}` : '—'} />
                <Divider />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {restaurant.is_delivery_available && <Chip size="small" label="Delivery" color="info" variant="outlined" />}
                  {restaurant.is_pickup_available && <Chip size="small" label="Pickup" color="default" variant="outlined" />}
                </Box>
                <Divider />
                <InfoRow label="Total Orders" value={String(restaurant.food_orders_count)} />
                <InfoRow label="Menu Items" value={String(restaurant.menu_items_count)} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Opening hours ── */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="Opening Hours"
              action={
                editingHours ? (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" onClick={() => setEditingHours(false)}>Cancel</Button>
                    <Button size="small" variant="contained" disabled={hoursSaving} onClick={handleSaveHours}>
                      {hoursSaving ? <CircularProgress size={14} /> : 'Save'}
                    </Button>
                  </Box>
                ) : (
                  <Button size="small" startIcon={<Iconify icon="solar:pen-bold" width={14} />} onClick={startEditHours}>
                    Edit
                  </Button>
                )
              }
            />
            <CardContent sx={{ pt: 0 }}>
              {editingHours ? (
                <Stack spacing={1}>
                  {hoursForm.map((h) => (
                    <Box key={h.day_of_week}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ width: 36, flexShrink: 0 }}>{DAY_NAMES[h.day_of_week]}</Typography>
                        <TextField type="time" size="small" value={h.opens_at ?? ''} onChange={(e) => setHourField(h.day_of_week, 'opens_at', e.target.value)} disabled={h.is_closed} sx={{ width: 120 }} inputProps={{ step: 60 }} />
                        <Typography variant="caption" color="text.secondary">–</Typography>
                        <TextField type="time" size="small" value={h.closes_at ?? ''} onChange={(e) => setHourField(h.day_of_week, 'closes_at', e.target.value)} disabled={h.is_closed} sx={{ width: 120 }} inputProps={{ step: 60 }} />
                        <FormControlLabel
                          control={<Checkbox size="small" checked={h.is_closed} onChange={(e) => setHourField(h.day_of_week, 'is_closed', e.target.checked)} />}
                          label={<Typography variant="caption">Closed</Typography>}
                          sx={{ ml: 'auto', mr: 0 }}
                        />
                      </Box>
                      <Divider sx={{ mt: 0.5 }} />
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Day</TableCell>
                      <TableCell>Opens</TableCell>
                      <TableCell>Closes</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {restaurant.opening_hours.map((h) => (
                      <TableRow key={h.day_of_week}>
                        <TableCell>{DAY_NAMES[h.day_of_week]}</TableCell>
                        <TableCell>{h.is_closed ? '—' : (h.opens_at ?? '—')}</TableCell>
                        <TableCell>{h.is_closed ? '—' : (h.closes_at ?? '—')}</TableCell>
                        <TableCell><Label color={h.is_closed ? 'error' : 'success'}>{h.is_closed ? 'Closed' : 'Open'}</Label></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ── Menu management ── */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader
              title="Menu"
              action={
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  onClick={() => { setAddingCategory(true); setNewCategoryName(''); }}
                >
                  Add Category
                </Button>
              }
            />
            <CardContent sx={{ pt: 1 }}>
              {/* Add category inline form */}
              {addingCategory && (
                <Box sx={{ display: 'flex', gap: 1, mb: 3, p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                  <TextField
                    autoFocus
                    size="small"
                    placeholder="Category name (e.g. Starters)"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddCategory(); if (e.key === 'Escape') setAddingCategory(false); }}
                    sx={{ flexGrow: 1 }}
                  />
                  <Button size="small" variant="contained" onClick={handleAddCategory} disabled={categoryAdding || !newCategoryName.trim()}>
                    {categoryAdding ? <CircularProgress size={14} /> : 'Add'}
                  </Button>
                  <Button size="small" onClick={() => setAddingCategory(false)}>Cancel</Button>
                </Box>
              )}

              {restaurant.menu.length === 0 && !addingCategory && (
                <Typography color="text.secondary" sx={{ py: 2 }}>No menu categories yet. Click &ldquo;Add Category&rdquo; to get started.</Typography>
              )}

              {restaurant.menu.map((category) => (
                <Box key={category.id} sx={{ mb: 4 }}>
                  {/* Category header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {editingCategoryId === category.id ? (
                      <>
                        <TextField
                          autoFocus
                          size="small"
                          value={editingCategoryName}
                          onChange={(e) => setEditingCategoryName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSaveCategoryName(category); if (e.key === 'Escape') setEditingCategoryId(null); }}
                          sx={{ width: 220 }}
                        />
                        <Button size="small" variant="contained" onClick={() => handleSaveCategoryName(category)}>Save</Button>
                        <Button size="small" onClick={() => setEditingCategoryId(null)}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <Typography variant="subtitle1" fontWeight={700}>{category.name}</Typography>
                        <Typography variant="caption" color="text.secondary">({category.items.length} items)</Typography>
                        <Tooltip title="Rename category">
                          <IconButton size="small" onClick={() => { setEditingCategoryId(category.id); setEditingCategoryName(category.name); }}>
                            <Iconify icon="solar:pen-bold" width={14} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete category">
                          <IconButton
                            size="small"
                            color="error"
                            disabled={deletingCategoryId === category.id}
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            {deletingCategoryId === category.id ? <CircularProgress size={14} /> : <Iconify icon="solar:trash-bin-trash-bold" width={14} />}
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    <Button size="small" sx={{ ml: 'auto' }} startIcon={<Iconify icon="mingcute:add-line" />} onClick={() => openAddItem(category.id)}>
                      Add Item
                    </Button>
                  </Box>

                  {/* Items table */}
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: 52 }} />
                        <TableCell>Item</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell>In Stock</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {category.items.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} sx={{ color: 'text.secondary', py: 2 }}>No items yet.</TableCell>
                        </TableRow>
                      )}
                      {category.items.map((item) => (
                        <TableRow key={item.id} hover>
                          <TableCell sx={{ p: 0.5 }}>
                            <Box
                              sx={{
                                width: 44,
                                height: 44,
                                borderRadius: 1,
                                overflow: 'hidden',
                                bgcolor: 'grey.100',
                                flexShrink: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {item.photo_url ? (
                                <Box component="img" src={item.photo_url} alt={item.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <Iconify icon="solar:cart-3-bold" width={20} sx={{ color: 'grey.400' }} />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>{item.name}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 240, display: 'block' }}>
                              {item.description ?? '—'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={600}>{fCurrency(item.price_cents / 100)}</Typography>
                          </TableCell>
                          <TableCell>
                            <Tooltip title={item.status === 'available' ? 'Mark out of stock' : 'Mark available'}>
                              <Switch
                                size="small"
                                checked={item.status === 'available'}
                                disabled={togglingItemId === item.id}
                                onChange={() => handleToggleItemStatus(item, category.id)}
                              />
                            </Tooltip>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Edit item">
                              <IconButton size="small" onClick={() => openEditItem(item, category.id)}>
                                <Iconify icon="solar:pen-bold" width={14} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete item">
                              <IconButton
                                size="small"
                                color="error"
                                disabled={deletingItemId === item.id}
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                {deletingItemId === item.id ? <CircularProgress size={12} /> : <Iconify icon="solar:trash-bin-trash-bold" width={14} />}
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── Edit Info Dialog ── */}
      <Dialog open={editInfoOpen} onClose={() => setEditInfoOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Restaurant Info</DialogTitle>
        <DialogContent dividers>
          {editInfoError && <Alert severity="error" sx={{ mb: 2 }}>{editInfoError}</Alert>}
          {editInfo && (
            <Stack spacing={2.5}>
              {/* Cover photo + logo */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Cover Photo</Typography>
                  <Box
                    onClick={() => editCoverRef.current?.click()}
                    sx={{ height: 100, border: '1.5px dashed', borderColor: 'grey.300', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', '&:hover': { borderColor: 'primary.main' } }}
                  >
                    {editCoverPhoto ? (
                      <Box component="img" src={URL.createObjectURL(editCoverPhoto)} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : restaurant?.cover_photo_url ? (
                      <Box component="img" src={restaurant.cover_photo_url} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Typography variant="caption" color="text.secondary">Click to upload</Typography>
                    )}
                  </Box>
                  <input ref={editCoverRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={(e) => setEditCoverPhoto(e.target.files?.[0] ?? null)} />
                </Box>
                <Box sx={{ width: 100 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Logo</Typography>
                  <Box
                    onClick={() => editLogoRef.current?.click()}
                    sx={{ height: 100, border: '1.5px dashed', borderColor: 'grey.300', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', '&:hover': { borderColor: 'primary.main' } }}
                  >
                    {editLogoPhoto ? (
                      <Box component="img" src={URL.createObjectURL(editLogoPhoto)} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : restaurant?.logo_url ? (
                      <Box component="img" src={restaurant.logo_url} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Typography variant="caption" color="text.secondary">Click to upload</Typography>
                    )}
                  </Box>
                  <input ref={editLogoRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={(e) => setEditLogoPhoto(e.target.files?.[0] ?? null)} />
                </Box>
              </Box>

              <TextField label="Restaurant Name" required value={editInfo.name} onChange={(e) => setEditInfo({ ...editInfo, name: e.target.value })} fullWidth />
              <TextField label="Description" value={editInfo.description} onChange={(e) => setEditInfo({ ...editInfo, description: e.target.value })} multiline rows={3} fullWidth />
              <TextField label="Phone" value={editInfo.phone} onChange={(e) => setEditInfo({ ...editInfo, phone: e.target.value })} fullWidth />
              <TextField label="Address" value={editInfo.address} onChange={(e) => setEditInfo({ ...editInfo, address: e.target.value })} multiline rows={2} fullWidth />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField label="Latitude" type="number" value={editInfo.latitude} onChange={(e) => setEditInfo({ ...editInfo, latitude: e.target.value })} fullWidth />
                <TextField label="Longitude" type="number" value={editInfo.longitude} onChange={(e) => setEditInfo({ ...editInfo, longitude: e.target.value })} fullWidth />
              </Box>
              <TextField label="Min Order" type="number" value={editInfo.min_order_display} onChange={(e) => setEditInfo({ ...editInfo, min_order_display: e.target.value })} InputProps={{ startAdornment: <InputAdornment position="start">฿</InputAdornment> }} fullWidth />
              <TextField label="Delivery Radius" type="number" value={editInfo.delivery_radius_km} onChange={(e) => setEditInfo({ ...editInfo, delivery_radius_km: e.target.value })} InputProps={{ endAdornment: <InputAdornment position="end">km</InputAdornment> }} fullWidth />
              <Box sx={{ display: 'flex', gap: 3 }}>
                <FormControlLabel control={<Switch checked={editInfo.is_delivery_available} onChange={(e) => setEditInfo({ ...editInfo, is_delivery_available: e.target.checked })} />} label="Delivery available" />
                <FormControlLabel control={<Switch checked={editInfo.is_pickup_available} onChange={(e) => setEditInfo({ ...editInfo, is_pickup_available: e.target.checked })} />} label="Pickup available" />
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditInfoOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveInfo} disabled={editInfoSaving}>
            {editInfoSaving ? <CircularProgress size={16} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Add / Edit Item Dialog ── */}
      <Dialog open={itemDialog.open} onClose={() => setItemDialog({ open: false, categoryId: null, item: null })} maxWidth="sm" fullWidth>
        <DialogTitle>{itemDialog.item ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
        <DialogContent dividers>
          {itemError && <Alert severity="error" sx={{ mb: 2 }}>{itemError}</Alert>}
          <Stack spacing={2.5}>
            {/* Photo upload */}
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Photo</Typography>
              <Box
                onClick={() => photoInputRef.current?.click()}
                sx={{
                  width: '100%',
                  height: 160,
                  border: '1.5px dashed',
                  borderColor: 'grey.300',
                  borderRadius: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.lighter' },
                }}
              >
                {(photoFile ?? itemDialog.item?.photo_url) ? (
                  <Box
                    component="img"
                    src={photoFile ? URL.createObjectURL(photoFile) : itemDialog.item!.photo_url!}
                    alt="preview"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <>
                    <Iconify icon="solar:restart-bold" width={28} sx={{ color: 'grey.400', mb: 0.5 }} />
                    <Typography variant="caption" color="text.secondary">Click to upload photo</Typography>
                  </>
                )}
              </Box>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
              />
              {(photoFile ?? itemDialog.item?.photo_url) && (
                <Button size="small" color="error" sx={{ mt: 0.5 }} onClick={() => setPhotoFile(null)}>
                  Remove photo
                </Button>
              )}
            </Box>

            <TextField label="Item Name" required value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} fullWidth />
            <TextField label="Description" value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} multiline rows={2} fullWidth />
            <TextField
              label="Price"
              required
              type="number"
              value={itemForm.price_display}
              onChange={(e) => setItemForm({ ...itemForm, price_display: e.target.value })}
              InputProps={{ startAdornment: <InputAdornment position="start">฿</InputAdornment> }}
              fullWidth
            />
            <TextField
              select
              label="Status"
              value={itemForm.status}
              onChange={(e) => setItemForm({ ...itemForm, status: e.target.value as 'available' | 'unavailable' })}
              fullWidth
            >
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="unavailable">Unavailable (out of stock)</MenuItem>
            </TextField>
            {itemDialog.item && restaurant.menu.length > 1 && (
              <TextField
                select
                label="Move to category"
                value={itemDialog.categoryId ?? ''}
                onChange={(e) => setItemDialog({ ...itemDialog, categoryId: Number(e.target.value) })}
                fullWidth
              >
                {restaurant.menu.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </TextField>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setItemDialog({ open: false, categoryId: null, item: null })}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveItem} disabled={itemSaving}>
            {itemSaving ? <CircularProgress size={16} /> : (itemDialog.item ? 'Save Changes' : 'Add Item')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Restaurant Confirm ── */}
      <Dialog open={deleteRestaurantOpen} onClose={() => setDeleteRestaurantOpen(false)}>
        <DialogTitle>Delete Restaurant?</DialogTitle>
        <DialogContent>
          <Typography>This will soft-delete &ldquo;{restaurant.name}&rdquo; and all its menu data. This action can be reversed from the database.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteRestaurantOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteRestaurant}>Delete</Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 130 }}>{label}</Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
  );
}
