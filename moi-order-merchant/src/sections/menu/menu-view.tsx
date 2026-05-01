import { useState, useEffect, useCallback, type ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Switch from '@mui/material/Switch';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/ImageOutlined';

import {
  fetchMenu,
  createCategory,
  updateCategory,
  deleteCategory,
  createItem,
  updateItem,
  deleteItem,
} from 'src/api/menu';

import type { MenuCategoryDetail, MenuItemDetail, MenuItemStatus } from 'src/types';

// ----------------------------------------------------------------------

function formatCurrency(cents: number): string {
  return (cents / 100).toFixed(2) + ' THB';
}

// ----------------------------------------------------------------------
// Category form dialog
// ----------------------------------------------------------------------

interface CategoryDialogProps {
  open: boolean;
  initialName: string;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
}

function CategoryDialog({ open, initialName, onClose, onSave }: CategoryDialogProps) {
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(initialName);
      setError(null);
    }
  }, [open, initialName]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }
    setSaving(true);
    try {
      await onSave(name.trim());
      onClose();
    } catch {
      setError('Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{initialName ? 'Edit Category' : 'Add Category'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          label="Category name"
          fullWidth
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={saving}
          autoFocus
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving || !name.trim()}>
          {saving ? <CircularProgress size={18} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------------------------
// Item form dialog
// ----------------------------------------------------------------------

interface ItemFormState {
  name: string;
  description: string;
  priceDisplay: string; // THB decimal string e.g. "12.50"
  status: MenuItemStatus;
  photo: File | null;
  photoPreview: string | null;
}

const EMPTY_ITEM_FORM: ItemFormState = {
  name: '',
  description: '',
  priceDisplay: '',
  status: 'available',
  photo: null,
  photoPreview: null,
};

interface ItemDialogProps {
  open: boolean;
  item: MenuItemDetail | null;
  categoryId: number | null;
  onClose: () => void;
  onSaved: () => void;
}

function ItemDialog({ open, item, categoryId, onClose, onSaved }: ItemDialogProps) {
  const [form, setForm] = useState<ItemFormState>(EMPTY_ITEM_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      if (item) {
        setForm({
          name: item.name,
          description: item.description ?? '',
          priceDisplay: (item.price_cents / 100).toFixed(2),
          status: item.status,
          photo: null,
          photoPreview: item.photo_url,
        });
      } else {
        setForm(EMPTY_ITEM_FORM);
      }
    }
  }, [open, item]);

  const handlePhotoChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, photo: file, photoPreview: preview }));
  }, []);

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError('Name is required.');
      return;
    }
    const priceNum = parseFloat(form.priceDisplay);
    if (isNaN(priceNum) || priceNum < 0) {
      setError('Enter a valid price.');
      return;
    }
    const priceCents = Math.round(priceNum * 100);
    setSaving(true);
    setError(null);
    try {
      if (item) {
        await updateItem(
          item.id,
          { name: form.name.trim(), description: form.description || null, price_cents: priceCents, status: form.status },
          form.photo
        );
      } else if (categoryId != null) {
        await createItem(
          categoryId,
          { name: form.name.trim(), description: form.description || null, price_cents: priceCents, status: form.status },
          form.photo
        );
      }
      onSaved();
      onClose();
    } catch {
      setError('Failed to save item.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{item ? 'Edit Item' : 'Add Item'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Name"
            fullWidth
            required
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            disabled={saving}
          />
          <TextField
            label="Description (optional)"
            fullWidth
            multiline
            rows={2}
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            disabled={saving}
          />
          <TextField
            label="Price (THB)"
            fullWidth
            required
            type="number"
            inputProps={{ min: 0, step: 0.01 }}
            value={form.priceDisplay}
            onChange={(e) => setForm((p) => ({ ...p, priceDisplay: e.target.value }))}
            disabled={saving}
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.status === 'available'}
                onChange={(e) =>
                  setForm((p) => ({ ...p, status: e.target.checked ? 'available' : 'unavailable' }))
                }
                disabled={saving}
              />
            }
            label={form.status === 'available' ? 'Available' : 'Unavailable'}
          />

          {/* Photo upload */}
          <Box>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Photo (optional)
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                component="label"
                htmlFor="item-photo-upload"
                sx={{
                  width: 80,
                  height: 80,
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.50',
                  '&:hover': { borderColor: 'primary.main' },
                }}
              >
                {form.photoPreview ? (
                  <Box
                    component="img"
                    src={form.photoPreview}
                    alt="preview"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <ImageIcon sx={{ color: 'text.disabled', fontSize: 32 }} />
                )}
              </Box>
              <input
                id="item-photo-upload"
                type="file"
                accept="image/*"
                hidden
                onChange={handlePhotoChange}
              />
              {form.photoPreview && (
                <Button
                  size="small"
                  color="error"
                  onClick={() => setForm((p) => ({ ...p, photo: null, photoPreview: null }))}
                >
                  Remove
                </Button>
              )}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? <CircularProgress size={18} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------------------------
// Delete confirm dialog
// ----------------------------------------------------------------------

interface DeleteDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

function DeleteDialog({ open, title, onClose, onConfirm }: DeleteDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) setError(null);
  }, [open]);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      setError('Failed to delete. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogTitle>Delete {title}?</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <Typography>This action cannot be undone.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={deleting}>Cancel</Button>
        <Button variant="contained" color="error" onClick={handleConfirm} disabled={deleting}>
          {deleting ? <CircularProgress size={18} /> : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------------------------
// Main menu view
// ----------------------------------------------------------------------

export function MenuView() {
  const [categories, setCategories] = useState<MenuCategoryDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Category dialog state
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategoryDetail | null>(null);

  // Delete category dialog
  const [deleteCatId, setDeleteCatId] = useState<number | null>(null);

  // Item dialog state
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemDetail | null>(null);

  // Delete item dialog
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const loadMenu = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchMenu();
      setCategories(data);
      if (data.length > 0 && selectedCategoryId === null) {
        setSelectedCategoryId(data[0].id);
      }
      setError(null);
    } catch {
      setError('Failed to load menu.');
    } finally {
      setLoading(false);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    loadMenu();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) ?? null;

  // Category handlers
  const handleOpenAddCategory = useCallback(() => {
    setEditingCategory(null);
    setCatDialogOpen(true);
  }, []);

  const handleOpenEditCategory = useCallback((cat: MenuCategoryDetail) => {
    setEditingCategory(cat);
    setCatDialogOpen(true);
  }, []);

  const handleSaveCategory = useCallback(
    async (name: string) => {
      if (editingCategory) {
        await updateCategory(editingCategory.id, name, editingCategory.sort_order);
      } else {
        await createCategory(name);
      }
      await loadMenu();
    },
    [editingCategory, loadMenu]
  );

  const handleConfirmDeleteCategory = useCallback(async () => {
    if (deleteCatId == null) return;
    await deleteCategory(deleteCatId);
    setDeleteCatId(null);
    if (selectedCategoryId === deleteCatId) setSelectedCategoryId(null);
    await loadMenu();
  }, [deleteCatId, selectedCategoryId, loadMenu]);

  // Item handlers
  const handleOpenAddItem = useCallback(() => {
    setEditingItem(null);
    setItemDialogOpen(true);
  }, []);

  const handleOpenEditItem = useCallback((item: MenuItemDetail) => {
    setEditingItem(item);
    setItemDialogOpen(true);
  }, []);

  const handleItemSaved = useCallback(() => loadMenu(), [loadMenu]);

  const handleToggleItemStatus = useCallback(
    async (item: MenuItemDetail) => {
      const nextStatus: MenuItemStatus = item.status === 'available' ? 'unavailable' : 'available';
      await updateItem(item.id, { status: nextStatus });
      await loadMenu();
    },
    [loadMenu]
  );

  const handleConfirmDeleteItem = useCallback(async () => {
    if (deleteItemId == null) return;
    await deleteItem(deleteItemId);
    setDeleteItemId(null);
    await loadMenu();
  }, [deleteItemId, loadMenu]);

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Menu
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-start">
        {/* Left panel: categories */}
        <Card sx={{ width: { xs: '100%', md: 260 }, flexShrink: 0 }}>
          <CardContent sx={{ pb: '8px !important' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography variant="subtitle2" fontWeight={700}>
                Categories
              </Typography>
              <IconButton size="small" onClick={handleOpenAddCategory} aria-label="Add category">
                <AddIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Divider sx={{ mb: 1 }} />
            {categories.length === 0 ? (
              <Typography variant="body2" color="text.secondary" py={2} textAlign="center">
                No categories yet.
              </Typography>
            ) : (
              categories.map((cat) => (
                <Stack
                  key={cat.id}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  onClick={() => setSelectedCategoryId(cat.id)}
                  sx={{
                    px: 1,
                    py: 0.75,
                    borderRadius: 1,
                    cursor: 'pointer',
                    bgcolor: selectedCategoryId === cat.id ? 'primary.light' : 'transparent',
                    '&:hover': { bgcolor: selectedCategoryId === cat.id ? 'primary.light' : 'grey.100' },
                    mb: 0.25,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      fontWeight={selectedCategoryId === cat.id ? 700 : 400}
                      noWrap
                    >
                      {cat.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {cat.items.length} items
                    </Typography>
                  </Box>
                  <Stack direction="row">
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); handleOpenEditCategory(cat); }}
                      aria-label={`Edit ${cat.name}`}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => { e.stopPropagation(); setDeleteCatId(cat.id); }}
                      aria-label={`Delete ${cat.name}`}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
              ))
            )}
          </CardContent>
        </Card>

        {/* Right panel: items in selected category */}
        <Box sx={{ flexGrow: 1, width: '100%' }}>
          {selectedCategory ? (
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {selectedCategory.name}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddItem}
                  >
                    Add Item
                  </Button>
                </Stack>

                {selectedCategory.items.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <Typography color="text.secondary">No items in this category yet.</Typography>
                  </Box>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Item</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedCategory.items.map((item) => (
                          <TableRow key={item.id} hover>
                            <TableCell>
                              <Stack direction="row" alignItems="center" spacing={1.5}>
                                <Avatar
                                  src={item.photo_url ?? undefined}
                                  variant="rounded"
                                  sx={{ width: 40, height: 40, bgcolor: 'grey.100' }}
                                >
                                  <ImageIcon sx={{ color: 'text.disabled' }} />
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" fontWeight={600}>
                                    {item.name}
                                  </Typography>
                                  {item.description && (
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{ display: 'block', maxWidth: 200 }}
                                      noWrap
                                    >
                                      {item.description}
                                    </Typography>
                                  )}
                                </Box>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                {formatCurrency(item.price_cents)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Switch
                                  size="small"
                                  checked={item.status === 'available'}
                                  onChange={() => handleToggleItemStatus(item)}
                                />
                                <Chip
                                  label={item.status === 'available' ? 'Available' : 'Unavailable'}
                                  size="small"
                                  color={item.status === 'available' ? 'success' : 'default'}
                                />
                              </Stack>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenEditItem(item)}
                                aria-label={`Edit ${item.name}`}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => setDeleteItemId(item.id)}
                                aria-label={`Delete ${item.name}`}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          ) : (
            <Box textAlign="center" py={8}>
              <Typography color="text.secondary">Select a category to view items.</Typography>
            </Box>
          )}
        </Box>
      </Stack>

      {/* Dialogs */}
      <CategoryDialog
        open={catDialogOpen}
        initialName={editingCategory?.name ?? ''}
        onClose={() => setCatDialogOpen(false)}
        onSave={handleSaveCategory}
      />

      <DeleteDialog
        open={deleteCatId != null}
        title="category"
        onClose={() => setDeleteCatId(null)}
        onConfirm={handleConfirmDeleteCategory}
      />

      <ItemDialog
        open={itemDialogOpen}
        item={editingItem}
        categoryId={selectedCategoryId}
        onClose={() => setItemDialogOpen(false)}
        onSaved={handleItemSaved}
      />

      <DeleteDialog
        open={deleteItemId != null}
        title="item"
        onClose={() => setDeleteItemId(null)}
        onConfirm={handleConfirmDeleteItem}
      />
    </Box>
  );
}
