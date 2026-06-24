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
  const importRef = useRef<HTMLInputElement>(null);

  const cat = (category as SafetyCategory) ?? 'hospital';
  const catLabel = SAFETY_CATEGORY_LABELS[cat] ?? cat;

  const [rows, setRows]           = useState<SafetyLocationData[]>([]);
  const [loading, setLoading]     = useState(false);
  const [page, setPage]           = useState(0);
  const [total, setTotal]         = useState(0);
  const [perPage]                 = useState(20);
  const [search, setSearch]       = useState('');
  const [editItem, setEditItem]   = useState<SafetyLocationData | null>(null);
  const [formOpen, setFormOpen]   = useState(false);
  const [form, setForm]           = useState<SafetyLocationPayload>({ ...EMPTY_FORM, category: cat });
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deleteId, setDeleteId]   = useState<number | null>(null);
  const [importMsg, setImportMsg] = useState('');
  const [importing, setImporting] = useState(false);

  const fetchRows = useCallback(() => {
    setLoading(true);
    safetyApi
      .list({ category: cat, search: search || undefined, page: page + 1, per_page: perPage })
      .then(({ data, meta }) => { setRows(data); setTotal(meta.total); })
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
      phone:        form.phone       || null,
      location:     form.location    || null,
      fb_page_link: form.fb_page_link || null,
      gmap_link:    form.gmap_link   || null,
      description:  form.description || null,
    };
    try {
      if (editItem) {
        await safetyApi.update(editItem.id, payload);
      } else {
        await safetyApi.create(payload);
      }
      setFormOpen(false);
      fetchRows();
    } catch {
      setSaveError('Failed to save. Please check your input.');
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
          sx={{ bgcolor: CATEGORY_COLOURS[cat] + '22', color: CATEGORY_COLOURS[cat], fontWeight: 700, fontSize: 14 }}
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
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={openCreate}
        >
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
                        <Typography variant="subtitle2">{row.name}</Typography>
                        {row.description && (
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 220, display: 'block' }}>
                            {row.description}
                          </Typography>
                        )}
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
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {saveError && <Alert severity="error">{saveError}</Alert>}
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
            <TextField
              label="Description"
              value={form.description ?? ''}
              onChange={field('description')}
              fullWidth
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving || !form.name}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
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
