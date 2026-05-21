import type { ChangeEvent } from 'react';
import type { SelectChangeEvent } from '@mui/material/Select';

import { useSearchParams } from 'react-router-dom';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { useAuth } from 'src/context/auth-context';
import { DashboardContent } from 'src/layouts/dashboard';
import { placesApi, type PlaceData, type PlaceLocale, type ImportBatchData } from 'src/api/places';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

const localeName = (v: PlaceLocale | null): string => {
  if (!v) return '—';
  return v.name_my ?? v.name_en ?? '—';
};

const categoryNames = (cats: PlaceLocale[]): string => {
  if (!cats || cats.length === 0) return '—';
  return cats.map((c) => c.name_my ?? c.name_en ?? '—').join(', ');
};

// ----------------------------------------------------------------------

type ImportDialogProps = {
  open: boolean;
  uploading: boolean;
  batch: ImportBatchData | null;
  error: string | null;
  onClose: () => void;
};

function ImportDialog({ open, uploading, batch, error, onClose }: ImportDialogProps) {
  const isInProgress =
    uploading || batch?.status === 'pending' || batch?.status === 'processing';
  const isTerminal = batch?.status === 'completed' || batch?.status === 'failed';

  return (
    <Dialog open={open} onClose={isInProgress ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Import Places</DialogTitle>
      <DialogContent>
        {isInProgress && (
          <Stack alignItems="center" spacing={2} sx={{ py: 3 }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              {uploading ? 'Uploading file…' : 'Processing rows…'}
            </Typography>
          </Stack>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}

        {batch?.status === 'completed' && (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Alert severity={batch.failed === 0 ? 'success' : 'warning'}>
              {batch.imported} of {batch.total} place{batch.total !== 1 ? 's' : ''} imported
              successfully.
              {batch.failed > 0 &&
                ` ${batch.failed} row${batch.failed !== 1 ? 's' : ''} failed.`}
            </Alert>

            {batch.errors.length > 0 && (
              <Box
                sx={{
                  maxHeight: 200,
                  overflowY: 'auto',
                  p: 1.5,
                  bgcolor: 'background.neutral',
                  borderRadius: 1,
                }}
              >
                {batch.errors.map((e, i) => (
                  <Typography key={i} variant="caption" display="block" color="error.main">
                    Row {e.row}: {e.message}
                  </Typography>
                ))}
              </Box>
            )}
          </Stack>
        )}

        {batch?.status === 'failed' && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {batch.errors[0]?.message ?? 'Import job failed unexpectedly.'}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={!!isInProgress}>
          {isTerminal ? 'Done' : 'Cancel'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

export function PlacesView() {
  const router = useRouter();
  const { hasPermission } = useAuth();
  const canCreate = hasPermission('places.create');
  const canUpdate = hasPermission('places.update');
  const canDelete = hasPermission('places.delete');
  const [searchParams, setSearchParams] = useSearchParams();
  const [places, setPlaces] = useState<PlaceData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const page         = Number(searchParams.get('page')     ?? '0');
  const rowsPerPage  = Number(searchParams.get('per_page') ?? '10');
  const filterName   = searchParams.get('search') ?? '';
  const filterStatus = searchParams.get('status') ?? 'all';

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      setSearchParams(
        (prev) => { Object.entries(updates).forEach(([k, v]) => prev.set(k, v)); return prev; },
        { replace: true }
      );
    },
    [setSearchParams]
  );
  const [selected, setSelected] = useState<number[]>([]);


  // ── Import state ────────────────────────────────────────────────────────────
  const importInputRef = useRef<HTMLInputElement>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importUploading, setImportUploading] = useState(false);
  const [importBatch, setImportBatch] = useState<ImportBatchData | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const fetchPlaces = useCallback(() => {
    setLoading(true);
    placesApi
      .list({
        page: page + 1,
        per_page: rowsPerPage,
        search: filterName || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
      })
      .then(({ data, meta }) => {
        setPlaces(data);
        setTotal(meta.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, rowsPerPage, filterName, filterStatus]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  // Poll for import status until terminal
  useEffect(() => {
    if (!importBatch || importBatch.status === 'completed' || importBatch.status === 'failed') {
      return undefined;
    }
    const interval = setInterval(() => {
      placesApi
        .getImportStatus(importBatch.id)
        .then((updated) => {
          setImportBatch(updated);
          if (updated.status === 'completed' || updated.status === 'failed') {
            clearInterval(interval);
            if (updated.status === 'completed') fetchPlaces();
          }
        })
        .catch(() => clearInterval(interval));
    }, 2000);
    return () => clearInterval(interval);
  }, [importBatch, fetchPlaces]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelected(checked ? places.map((p) => p.id) : []);
    },
    [places]
  );

  const handleSelect = useCallback((id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const handleDelete = (id: number) => {
    placesApi
      .remove(id)
      .then(() => fetchPlaces())
      .catch(() => {});
  };

  const handleBulkDelete = () => {
    Promise.all(selected.map((id) => placesApi.remove(id))).then(() => {
      setSelected([]);
      fetchPlaces();
    });
  };

  // ── Import handlers ─────────────────────────────────────────────────────────
  const handleExportClick = useCallback(() => {
    placesApi.exportExcel({ search: filterName.trim() || undefined }).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `places-${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }, [filterName]);

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    setImportDialogOpen(true);
    setImportUploading(true);
    setImportBatch(null);
    setImportError(null);

    placesApi
      .importExcel(file)
      .then((batch) => {
        setImportBatch(batch);
        setImportUploading(false);
        if (batch.status === 'completed') fetchPlaces();
      })
      .catch((err: unknown) => {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Upload failed. Please try again.';
        setImportUploading(false);
        setImportError(message);
      });
  };

  const handleImportClose = () => {
    const isInProgress =
      importUploading ||
      importBatch?.status === 'pending' ||
      importBatch?.status === 'processing';
    if (isInProgress) return;
    setImportDialogOpen(false);
    setImportBatch(null);
    setImportError(null);
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Places
        </Typography>
        <Button
          variant="outlined"
          color="inherit"
          size="small"
          startIcon={<Iconify icon="eva:arrow-ios-downward-fill" width={16} />}
          onClick={handleExportClick}
        >
          Export Excel
        </Button>
        {canCreate && (
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            startIcon={<Iconify icon="eva:trending-up-fill" width={16} />}
            onClick={handleImportClick}
          >
            Import Excel
          </Button>
        )}
        {canCreate && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => router.push('/places/new')}
          >
            Add Place
          </Button>
        )}
      </Box>

      {canCreate && (
        <input
          ref={importInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          style={{ display: 'none' }}
          onChange={handleImportFileChange}
        />
      )}

      <Card>
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <OutlinedInput
            value={filterName}
            onChange={(e) => updateParams({ search: e.target.value, page: '0' })}
            placeholder="Search places or city..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" />
              </InputAdornment>
            }
            sx={{ flexGrow: 1, maxWidth: 320, height: 40 }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e: SelectChangeEvent) => updateParams({ status: e.target.value, page: '0' })}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          {canDelete && selected.length > 0 && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={`${selected.length} selected`}
                color="primary"
                variant="outlined"
                onDelete={() => setSelected([])}
              />
              <Button
                size="small"
                color="error"
                variant="outlined"
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" width={14} />}
                onClick={handleBulkDelete}
              >
                Delete Selected
              </Button>
            </Stack>
          )}
          <Typography variant="body2" sx={{ ml: 'auto', color: 'text.secondary' }}>
            {total} results
          </Typography>
        </Box>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  {canDelete && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selected.length > 0 && selected.length < places.length}
                        checked={places.length > 0 && selected.length === places.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </TableCell>
                  )}
                  <TableCell>Place</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell align="center">Rating</TableCell>
                  <TableCell align="center">Reviews</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={canDelete ? 8 : 7} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {places.map((row) => (
                      <TableRow key={row.id} hover selected={selected.includes(row.id)}>
                        {canDelete && (
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selected.includes(row.id)}
                              onChange={() => handleSelect(row.id)}
                            />
                          </TableCell>
                        )}
                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={canUpdate ? {
                              cursor: 'pointer',
                              '&:hover': { color: 'primary.main', textDecoration: 'underline' },
                            } : undefined}
                            onClick={canUpdate ? () => router.push(`/places/${row.id}/edit`) : undefined}
                          >
                            {row.name_my}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.address}
                          </Typography>
                        </TableCell>
                        <TableCell>{categoryNames(row.categories ?? [])}</TableCell>
                        <TableCell>{row.city ?? '—'}</TableCell>
                        <TableCell align="center">
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                            spacing={0.5}
                          >
                            <Iconify
                              icon="eva:checkmark-fill"
                              width={14}
                              sx={{ color: 'warning.main' }}
                            />
                            <Typography variant="body2">{row.rating ?? '—'}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">{row.review_count ?? '—'}</TableCell>
                        <TableCell>
                          <Label color={row.deleted_at ? 'error' : 'success'}>
                            {row.deleted_at ? 'deleted' : 'active'}
                          </Label>
                        </TableCell>
                        <TableCell align="right">
                          {canUpdate && (
                            <IconButton size="small" onClick={() => router.push(`/places/${row.id}/edit`)}>
                              <Iconify icon="solar:pen-bold" width={16} />
                            </IconButton>
                          )}
                          {canDelete && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(row.id)}
                            >
                              <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {places.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={canDelete ? 8 : 7}
                          align="center"
                          sx={{ py: 6, color: 'text.secondary' }}
                        >
                          No places found
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          onPageChange={(_, newPage) => updateParams({ page: String(newPage) })}
          onRowsPerPageChange={(e) => updateParams({ per_page: e.target.value, page: '0' })}
        />
      </Card>

      <ImportDialog
        open={importDialogOpen}
        uploading={importUploading}
        batch={importBatch}
        error={importError}
        onClose={handleImportClose}
      />
    </DashboardContent>
  );
}
