import type { PlaceTag } from 'src/types';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { fDate } from 'src/utils/format-time';

import { tagsApi } from 'src/api/tags';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

const toSlug = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

// ----------------------------------------------------------------------

type FormState = { name_my: string; name_en: string; name_th: string; slug: string };
type FormErrors = Partial<Record<keyof FormState, string>>;
type ApiError = { response?: { data?: { errors?: Record<string, string[]>; message?: string } } };

const EMPTY_FORM: FormState = { name_my: '', name_en: '', name_th: '', slug: '' };

// ----------------------------------------------------------------------

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  confirmColor?: 'error' | 'warning' | 'primary';
  submitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  confirmColor = 'error',
  submitting,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {body}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color={confirmColor}
          disabled={submitting}
          onClick={onConfirm}
        >
          {submitting ? <CircularProgress size={18} /> : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

export function TagsView() {
  const [rows, setRows] = useState<PlaceTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PlaceTag | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [slugTouched, setSlugTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<PlaceTag | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<PlaceTag | null>(null);
  const [actionSubmitting, setActionSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setPageError('');
    try {
      const res = await tagsApi.list({ per_page: 200 });
      setRows(res.data);
    } catch {
      setPageError('Failed to load tags. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = rows.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.name_my.toLowerCase().includes(q) ||
      r.name_en.toLowerCase().includes(q) ||
      r.slug.toLowerCase().includes(q)
    );
  });

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setSlugTouched(false);
    setFormError('');
    setDialogOpen(true);
  };

  const openEdit = (tag: PlaceTag) => {
    setEditTarget(tag);
    setForm({ name_my: tag.name_my, name_en: tag.name_en, name_th: tag.name_th ?? '', slug: tag.slug });
    setFormErrors({});
    setSlugTouched(true);
    setFormError('');
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (submitting) return;
    setDialogOpen(false);
  };

  const handleNameEnChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      name_en: value,
      slug: slugTouched ? prev.slug : toSlug(value),
    }));
    setFormErrors((prev) => ({ ...prev, name_en: undefined }));
  };

  const handleSlugChange = (value: string) => {
    setSlugTouched(true);
    setForm((prev) => ({ ...prev, slug: value }));
    setFormErrors((prev) => ({ ...prev, slug: undefined }));
  };

  const handleSubmit = async () => {
    setFormError('');
    const errors: FormErrors = {};
    if (!form.name_my.trim()) errors.name_my = 'Burmese name is required.';
    if (!form.name_en.trim()) errors.name_en = 'English name is required.';
    if (!form.slug.trim()) errors.slug = 'Slug is required.';
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name_my: form.name_my.trim(),
        name_en: form.name_en.trim(),
        name_th: form.name_th.trim() || null,
        slug: form.slug.trim(),
      };
      if (editTarget) {
        await tagsApi.update(editTarget.id, payload);
      } else {
        await tagsApi.create(payload);
      }
      setDialogOpen(false);
      await load();
    } catch (err: unknown) {
      const res = (err as ApiError).response?.data;
      if (res?.errors) {
        setFormErrors({
          name_my: res.errors.name_my?.[0],
          name_en: res.errors.name_en?.[0],
          name_th: res.errors.name_th?.[0],
          slug: res.errors.slug?.[0],
        });
      } else {
        setFormError(res?.message ?? 'Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionSubmitting(true);
    try {
      await tagsApi.destroy(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch {
      setDeleteTarget(null);
    } finally {
      setActionSubmitting(false);
    }
  };

  const handleRestore = async () => {
    if (!restoreTarget) return;
    setActionSubmitting(true);
    try {
      await tagsApi.restore(restoreTarget.id);
      setRestoreTarget(null);
      await load();
    } catch {
      setRestoreTarget(null);
    } finally {
      setActionSubmitting(false);
    }
  };

  const displayName = (tag: PlaceTag) => tag.name_en || tag.name_my;

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Tags
        </Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={openAdd}
        >
          Add Tag
        </Button>
      </Box>

      {pageError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {pageError}
        </Alert>
      )}

      <Card>
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
          <OutlinedInput
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Search by name or slug..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" />
              </InputAdornment>
            }
            sx={{ flexGrow: 1, maxWidth: 320, height: 40 }}
          />
          <Typography variant="body2" sx={{ ml: 'auto', color: 'text.secondary' }}>
            {filtered.length} {filtered.length === 1 ? 'tag' : 'tags'}
          </Typography>
        </Box>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 760 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name (MY)</TableCell>
                  <TableCell>Name (EN)</TableCell>
                  <TableCell>Name (TH)</TableCell>
                  <TableCell>Slug</TableCell>
                  <TableCell>Places</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={32} />
                    </TableCell>
                  </TableRow>
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      align="center"
                      sx={{ py: 6, color: 'text.secondary' }}
                    >
                      No tags found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((row) => {
                    const isDeleted = !!row.deleted_at;
                    return (
                      <TableRow key={row.id} hover sx={{ opacity: isDeleted ? 0.55 : 1 }}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {row.name_my}
                          </Typography>
                        </TableCell>
                        <TableCell>{row.name_en || '—'}</TableCell>
                        <TableCell>{row.name_th || '—'}</TableCell>
                        <TableCell>
                          <Typography
                            variant="caption"
                            sx={{
                              px: 0.75,
                              py: 0.25,
                              borderRadius: 0.5,
                              bgcolor: 'grey.100',
                              fontFamily: 'monospace',
                            }}
                          >
                            {row.slug}
                          </Typography>
                        </TableCell>
                        <TableCell>{row.places_count ?? 0}</TableCell>
                        <TableCell>{fDate(row.created_at)}</TableCell>
                        <TableCell>
                          <Label color={isDeleted ? 'error' : 'success'}>
                            {isDeleted ? 'Deleted' : 'Active'}
                          </Label>
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                            {isDeleted ? (
                              <Tooltip title="Restore">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() => setRestoreTarget(row)}
                                >
                                  <Iconify icon="solar:restart-bold" width={16} />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <>
                                <Tooltip title="Edit">
                                  <IconButton size="small" onClick={() => openEdit(row)}>
                                    <Iconify icon="solar:pen-bold" width={16} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => setDeleteTarget(row)}
                                  >
                                    <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 20, 50]}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editTarget ? 'Edit Tag' : 'Add Tag'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {formError && <Alert severity="error">{formError}</Alert>}

            <TextField
              label="Name (Burmese) *"
              fullWidth
              value={form.name_my}
              onChange={(e) => {
                setForm((p) => ({ ...p, name_my: e.target.value }));
                setFormErrors((p) => ({ ...p, name_my: undefined }));
              }}
              error={!!formErrors.name_my}
              helperText={formErrors.name_my}
            />

            <TextField
              label="Name (English) *"
              fullWidth
              value={form.name_en}
              onChange={(e) => handleNameEnChange(e.target.value)}
              error={!!formErrors.name_en}
              helperText={formErrors.name_en}
            />

            <TextField
              label="Name (Thai)"
              fullWidth
              value={form.name_th}
              onChange={(e) => {
                setForm((p) => ({ ...p, name_th: e.target.value }));
                setFormErrors((p) => ({ ...p, name_th: undefined }));
              }}
              error={!!formErrors.name_th}
              helperText={formErrors.name_th}
            />

            <TextField
              label="Slug *"
              fullWidth
              value={form.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              error={!!formErrors.slug}
              helperText={formErrors.slug ?? 'Auto-generated from English name. Must be unique.'}
              InputProps={{ sx: { fontFamily: 'monospace' } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="contained" disabled={submitting} onClick={handleSubmit}>
            {submitting ? <CircularProgress size={18} /> : editTarget ? 'Save Changes' : 'Add Tag'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Tag"
        body={deleteTarget ? `Delete "${displayName(deleteTarget)}"? Places using this tag will not be affected.` : ''}
        confirmLabel="Delete"
        confirmColor="error"
        submitting={actionSubmitting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <ConfirmDialog
        open={!!restoreTarget}
        title="Restore Tag"
        body={restoreTarget ? `Restore "${displayName(restoreTarget)}"?` : ''}
        confirmLabel="Restore"
        confirmColor="primary"
        submitting={actionSubmitting}
        onClose={() => setRestoreTarget(null)}
        onConfirm={handleRestore}
      />
    </DashboardContent>
  );
}
