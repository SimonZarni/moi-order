import type { SelectChangeEvent } from '@mui/material/Select';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
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
import TextField from '@mui/material/TextField';
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

import { DashboardContent } from 'src/layouts/dashboard';
import { placesApi, type PlaceData, type PlaceLocale } from 'src/api/places';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

const localeName = (v: PlaceLocale | null): string => {
  if (!v) return '—';
  return v.name_my ?? v.name_en ?? '—';
};


// ----------------------------------------------------------------------

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmColor?: 'error' | 'primary' | 'warning';
  onClose: () => void;
  onConfirm: () => void;
};

function PasswordConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  confirmColor = 'error',
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  const handleConfirm = () => {
    if (!password.trim()) return;
    onConfirm();
    setPassword('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          {description}
        </Typography>
        <TextField
          fullWidth
          label="Enter your password to confirm"
          type={show ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleConfirm();
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShow((v) => !v)} edge="end" size="small">
                  <Iconify icon={show ? 'solar:eye-bold' : 'solar:eye-closed-bold'} width={18} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
            setPassword('');
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color={confirmColor}
          onClick={handleConfirm}
          disabled={!password.trim()}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

export function PlacesView() {
  const router = useRouter();
  const [places, setPlaces] = useState<PlaceData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState<number[]>([]);

  const [editConfirm, setEditConfirm] = useState<PlaceData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

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
      .then(() => {
        setDeleteConfirm(null);
        fetchPlaces();
      })
      .catch(() => setDeleteConfirm(null));
  };

  const handleBulkDelete = () => {
    Promise.all(selected.map((id) => placesApi.remove(id))).then(() => {
      setSelected([]);
      setBulkDeleteConfirm(false);
      fetchPlaces();
    });
  };

  const handleEditConfirmed = (place: PlaceData) => {
    setEditConfirm(null);
    router.push(`/places/${place.id}/edit`);
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
        >
          Export Excel
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          size="small"
          startIcon={<Iconify icon="eva:trending-up-fill" width={16} />}
        >
          Import Excel
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => router.push('/places/new')}
        >
          Add Place
        </Button>
      </Box>

      <Card>
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <OutlinedInput
            value={filterName}
            onChange={(e) => {
              setFilterName(e.target.value);
              setPage(0);
            }}
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
              onChange={(e: SelectChangeEvent) => {
                setFilterStatus(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          {selected.length > 0 && (
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
                onClick={() => setBulkDeleteConfirm(true)}
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
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < places.length}
                      checked={places.length > 0 && selected.length === places.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </TableCell>
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
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {places.map((row) => (
                      <TableRow key={row.id} hover selected={selected.includes(row.id)}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selected.includes(row.id)}
                            onChange={() => handleSelect(row.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{
                              cursor: 'pointer',
                              '&:hover': { color: 'primary.main', textDecoration: 'underline' },
                            }}
                            onClick={() => setEditConfirm(row)}
                          >
                            {row.name_my}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.address}
                          </Typography>
                        </TableCell>
                        <TableCell>{localeName(row.category)}</TableCell>
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
                          <IconButton size="small" onClick={() => setEditConfirm(row)}>
                            <Iconify icon="solar:pen-bold" width={16} />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteConfirm(row.id)}
                          >
                            <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {places.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={8}
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
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Card>

      <PasswordConfirmDialog
        open={!!editConfirm}
        title="Confirm to Edit Place"
        description={`Enter your password to edit "${editConfirm?.name_my}".`}
        confirmLabel="Continue to Edit"
        confirmColor="primary"
        onClose={() => setEditConfirm(null)}
        onConfirm={() => editConfirm && handleEditConfirmed(editConfirm)}
      />

      <PasswordConfirmDialog
        open={!!deleteConfirm}
        title="Confirm Delete"
        description="Enter your password to permanently delete this place."
        confirmLabel="Delete"
        confirmColor="error"
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm !== null && handleDelete(deleteConfirm)}
      />

      <PasswordConfirmDialog
        open={bulkDeleteConfirm}
        title={`Delete ${selected.length} Places?`}
        description="This action cannot be undone. Enter your password to confirm bulk delete."
        confirmLabel={`Delete ${selected.length} Places`}
        confirmColor="error"
        onClose={() => setBulkDeleteConfirm(false)}
        onConfirm={handleBulkDelete}
      />
    </DashboardContent>
  );
}
