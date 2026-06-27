import type { IconifyName } from 'src/components/iconify';

import { useParams } from 'react-router-dom';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { safetyApi, type SafetyCategory, SAFETY_CATEGORY_LABELS, type SafetyLocationData, type SafetyLocationPayload } from 'src/api/safety';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const CATEGORY_ICONS: Record<SafetyCategory, IconifyName> = {
  hospital:       'solar:hospital-bold',
  police_station: 'solar:shield-bold',
  rescue:         'solar:danger-bold',
};

const CATEGORY_COLOURS: Record<SafetyCategory, string> = {
  hospital:       '#ef5350',
  police_station: '#1565c0',
  rescue:         '#f57c00',
};

const EMPTY_FORM: SafetyLocationPayload = {
  name: '', category: 'hospital', phone: '', location: '', fb_page_link: '', gmap_link: '', description: '', latitude: null, longitude: null,
};

// ----------------------------------------------------------------------

export function SafetyDetailView() {
  const { category } = useParams<{ category: SafetyCategory }>();
  const router = useRouter();
  const importRef  = useRef<HTMLInputElement>(null);
  const coverRef   = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const cat      = (category as SafetyCategory) ?? 'hospital';
  const catLabel = SAFETY_CATEGORY_LABELS[cat] ?? cat;

  const [rows, setRows]             = useState<SafetyLocationData[]>([]);
  const [loading, setLoading]       = useState(false);
  const [page, setPage]             = useState(0);
  const [total, setTotal]           = useState(0);
  const [perPage]                   = useState(20);
  const [search, setSearch]         = useState('');
  const [editItem, setEditItem]     = useState<SafetyLocationData | null>(null);
  const [formOpen, setFormOpen]     = useState(false);
  const [form, setForm]             = useState<SafetyLocationPayload>({ ...EMPTY_FORM, category: cat });
  const [saving, setSaving]         = useState(false);
  const [saveError, setSaveError]   = useState('');
  const [deleteId, setDeleteId]     = useState<number | null>(null);
  const [importMsg, setImportMsg]   = useState('');
  const [importing, setImporting]   = useState(false);
  const [photoItem, setPhotoItem]   = useState<SafetyLocationData | null>(null);
  const [photoWorking, setPhotoWorking] = useState(false);

  const fetchRows = useCallback(() => {
    setLoading(true);
    safetyApi
      .list({ category: cat, search: search || undefined, page: page + 1, per_page: perPage })
      .then(({ data, meta }) => { setRows(data); setTotal(meta?.total ?? 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [cat, search, page, perPage]);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ ...EMPTY_FORM, category: cat });
    setSaveError('');
    setFormOpen(true);
  };

  const openEdit = (item: SafetyLocationData) => {
    setEditItem(item);
    setForm({
      name: item.name, category: item.category,
      phone: item.phone ?? '', location: item.location ?? '',
      fb_page_link: item.fb_page_link ?? '', gmap_link: item.gmap_link ?? '',
      description: item.description ?? '',
      latitude: item.latitude, longitude: item.longitude,
    });
    setSaveError('');
    setFormOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    const payload: SafetyLocationPayload = {
      ...form,
      phone:        form.phone        || null,
      location:     form.location     || null,
      fb_page_link: form.fb_page_link || null,
      gmap_link:    form.gmap_link    || null,
      description:  form.description  || null,
    };
    try {
      if (editItem) {
        await safetyApi.update(editItem.id, payload);
      } else {
        await safetyApi.create(payload);
      }
      setFormOpen(false);
      fetchRows();
    } catch (err) {
      const e = err as { message?: string; errors?: Record<string, string[]> };
      const firstFieldError = e?.errors ? Object.values(e.errors)[0]?.[0] : undefined;
      setSaveError(firstFieldError ?? e?.message ?? 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    await safetyApi.remove(deleteId).catch(() => {});
    setDeleteId(null);
    fetchRows();
  };

  const handleExport = () => {
    const url = safetyApi.exportUrl(cat);
    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    a.click();
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportMsg('');
    try {
      const res = await safetyApi.import(file, cat);
      setImportMsg(`${res.count} records imported.`);
      fetchRows();
    } catch {
      setImportMsg('Import failed. Check your file format.');
    } finally {
      setImporting(false);
      if (importRef.current) importRef.current.value = '';
    }
  };

  const patchPhotoItem = (updated: SafetyLocationData) => {
    setPhotoItem(updated);
    setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !photoItem) return;
    setPhotoWorking(true);
    try { patchPhotoItem(await safetyApi.setCover(photoItem.id, file)); } catch { /* ignore */ }
    finally { setPhotoWorking(false); if (coverRef.current) coverRef.current.value = ''; }
  };

  const handleRemoveCover = async () => {
    if (!photoItem) return;
    setPhotoWorking(true);
    try { patchPhotoItem(await safetyApi.removeCover(photoItem.id)); } catch { /* ignore */ }
    finally { setPhotoWorking(false); }
  };

  const handleAddGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !photoItem) return;
    setPhotoWorking(true);
    try { patchPhotoItem(await safetyApi.addPhoto(photoItem.id, file)); } catch { /* ignore */ }
    finally { setPhotoWorking(false); if (galleryRef.current) galleryRef.current.value = ''; }
  };

  const handleRemoveGallery = async (index: number) => {
    if (!photoItem) return;
    setPhotoWorking(true);
    try { patchPhotoItem(await safetyApi.removePhoto(photoItem.id, index)); } catch { /* ignore */ }
    finally { setPhotoWorking(false); }
  };

  const field = (key: keyof SafetyLocationPayload) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <DashboardContent>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <IconButton onClick={() => router.push('/safety')} size="small">
          <Iconify icon="eva:arrow-back-fill" />
        </IconButton>
        <Chip
          icon={<Iconify icon={CATEGORY_ICONS[cat]} width={16} />}
          label={catLabel}
          sx={{ bgcolor: `${CATEGORY_COLOURS[cat]}22`, color: CATEGORY_COLOURS[cat], fontWeight: 700, fontSize: 14 }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5">{catLabel}</Typography>
        </Box>

        <OutlinedInput
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          placeholder="Search..."
          startAdornment={<InputAdornment position="start"><Iconify icon="eva:search-fill" /></InputAdornment>}
          sx={{ width: 220, height: 38 }}
        />

        <input ref={importRef} type="file" accept=".xlsx,.xls,.csv" hidden onChange={handleImportFile} />
        <Tooltip title="Import from Excel / CSV">
          <Button
            variant="outlined"
            size="small"
            startIcon={importing ? <CircularProgress size={14} /> : <Iconify icon="solar:upload-bold" width={16} />}
            onClick={() => importRef.current?.click()}
            disabled={importing}
          >
            Import
          </Button>
        </Tooltip>
        <Tooltip title="Export to Excel">
          <Button
            variant="outlined"
            size="small"
            startIcon={<Iconify icon="solar:download-bold" width={16} />}
            onClick={handleExport}
          >
            Export
          </Button>
        </Tooltip>
        <Button variant="contained" startIcon={<Iconify icon="mingcute:add-line" />} onClick={openCreate}>
          Add
        </Button>
      </Box>

      {importMsg && (
        <Alert severity={importMsg.includes('failed') ? 'error' : 'success'} sx={{ mb: 2 }} onClose={() => setImportMsg('')}>
          {importMsg}
        </Alert>
      )}

      {/* Table */}
      <Card>
        {loading ? (
          <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Links</TableCell>
                    <TableCell>Coords</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                        No {catLabel} records yet.
                      </TableCell>
                    </TableRow>
                  ) : rows.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          {row.cover_photo_url ? (
                            <Box
                              component="img"
                              src={row.cover_photo_url}
                              alt={row.name}
                              sx={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 1, flexShrink: 0 }}
                            />
                          ) : (
                            <Box sx={{ width: 44, height: 44, bgcolor: 'action.hover', borderRadius: 1, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Iconify icon={CATEGORY_ICONS[cat]} width={20} sx={{ color: 'text.disabled' }} />
                            </Box>
                          )}
                          <Box>
                            <Typography variant="subtitle2">{row.name}</Typography>
                            {row.description && (
                              <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 180, display: 'block' }}>
                                {row.description}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{row.phone ?? '—'}</TableCell>
                      <TableCell sx={{ maxWidth: 160 }}>
                        <Typography variant="body2" noWrap>{row.location ?? '—'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          {row.fb_page_link && (
                            <Tooltip title="Facebook Page">
                              <IconButton size="small" href={row.fb_page_link} target="_blank" rel="noopener">
                                <Iconify icon="socials:facebook" width={16} />
                              </IconButton>
                            </Tooltip>
                          )}
                          {row.gmap_link && (
                            <Tooltip title="Google Maps">
                              <IconButton size="small" href={row.gmap_link} target="_blank" rel="noopener">
                                <Iconify icon="solar:map-point-bold" width={16} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {row.latitude !== null && row.longitude !== null
                          ? `${row.latitude.toFixed(4)}, ${row.longitude.toFixed(4)}`
                          : '—'}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Manage photos">
                          <IconButton size="small" onClick={() => setPhotoItem(row)}>
                            <Iconify icon="solar:gallery-bold" width={16} />
                          </IconButton>
                        </Tooltip>
                        <IconButton size="small" onClick={() => openEdit(row)}>
                          <Iconify icon="solar:pen-bold" width={16} />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => setDeleteId(row.id)}>
                          <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={total}
              page={page}
              rowsPerPage={perPage}
              rowsPerPageOptions={[20]}
              onPageChange={(_, p) => setPage(p)}
            />
          </>
        )}
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editItem ? `Edit — ${editItem.name}` : `Add ${catLabel}`}</DialogTitle>
        {saveError && (
          <Alert severity="error" sx={{ mx: 3, mt: 1 }}>{saveError}</Alert>
        )}
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="Name *" value={form.name} onChange={field('name')} fullWidth />
            <TextField label="Phone" value={form.phone ?? ''} onChange={field('phone')} fullWidth />
            <TextField label="Location" value={form.location ?? ''} onChange={field('location')} fullWidth placeholder="e.g. No.15, Main Rd, Pattaya" />
            <TextField label="Facebook Page URL" value={form.fb_page_link ?? ''} onChange={field('fb_page_link')} fullWidth />
            <TextField label="Google Maps URL" value={form.gmap_link ?? ''} onChange={field('gmap_link')} fullWidth />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Latitude"
                value={form.latitude ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, latitude: e.target.value === '' ? null : parseFloat(e.target.value) }))}
                type="number"
                fullWidth
              />
              <TextField
                label="Longitude"
                value={form.longitude ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, longitude: e.target.value === '' ? null : parseFloat(e.target.value) }))}
                type="number"
                fullWidth
              />
            </Stack>
            <TextField label="Description" value={form.description ?? ''} onChange={field('description')} fullWidth multiline rows={3} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving || !form.name}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Photos Management Dialog */}
      <Dialog open={photoItem !== null} onClose={() => setPhotoItem(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Photos — {photoItem?.name}
            {photoWorking && <CircularProgress size={18} />}
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* Cover Photo */}
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Cover Photo</Typography>
          {photoItem?.cover_photo_url ? (
            <Box sx={{ mb: 1.5 }}>
              <Box
                component="img"
                src={photoItem.cover_photo_url}
                alt="Cover"
                sx={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 1, display: 'block', mb: 1 }}
              />
              <Button size="small" color="error" onClick={handleRemoveCover} disabled={photoWorking}>
                Remove Cover
              </Button>
            </Box>
          ) : (
            <Box sx={{ mb: 1.5, p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">No cover photo</Typography>
            </Box>
          )}
          <input ref={coverRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={handleUploadCover} />
          <Button
            size="small"
            variant="outlined"
            startIcon={<Iconify icon="solar:gallery-bold" width={16} />}
            onClick={() => coverRef.current?.click()}
            disabled={photoWorking}
            sx={{ mb: 3 }}
          >
            {photoItem?.cover_photo_url ? 'Replace Cover' : 'Upload Cover'}
          </Button>

          <Divider sx={{ mb: 3 }} />

          {/* Gallery */}
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Gallery ({photoItem?.photo_urls.length ?? 0} photos)
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {photoItem?.photo_urls.map((url, i) => (
              <Box key={i} sx={{ position: 'relative', width: 96, height: 96 }}>
                <Box
                  component="img"
                  src={url}
                  alt={`Gallery ${i + 1}`}
                  sx={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 1, display: 'block' }}
                />
                <IconButton
                  size="small"
                  color="error"
                  sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'background.paper', p: '2px', '&:hover': { bgcolor: 'error.lighter' } }}
                  onClick={() => handleRemoveGallery(i)}
                  disabled={photoWorking}
                  aria-label={`Remove gallery photo ${i + 1}`}
                >
                  <Iconify icon="mingcute:close-line" width={14} />
                </IconButton>
              </Box>
            ))}
          </Box>
          <input ref={galleryRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={handleAddGallery} />
          <Button
            size="small"
            variant="outlined"
            startIcon={<Iconify icon="mingcute:add-line" width={16} />}
            onClick={() => galleryRef.current?.click()}
            disabled={photoWorking}
          >
            Add Photo
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPhotoItem(null)}>Done</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete this record?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
