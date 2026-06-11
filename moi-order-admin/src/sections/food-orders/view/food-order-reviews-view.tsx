import type { SelectChangeEvent } from '@mui/material/Select';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { foodOrdersApi, type ReviewListItem } from 'src/api/foodOrders';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

function StarRating({ value }: { value: number }) {
  return (
    <Stack direction="row" spacing={0.25}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Iconify
          key={n}
          icon={n <= value ? 'solar:star-bold' : 'solar:star-outline'}
          width={16}
          sx={{ color: n <= value ? 'warning.main' : 'text.disabled' }}
        />
      ))}
    </Stack>
  );
}

// ----------------------------------------------------------------------

export function FoodOrderReviewsView() {
  const [rows, setRows] = useState<ReviewListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [filterRating, setFilterRating] = useState('all');
  const [filterSearch, setFilterSearch] = useState('');

  const fetchReviews = useCallback(() => {
    setLoading(true);
    foodOrdersApi
      .reviews({
        page: page + 1,
        per_page: rowsPerPage,
        rating: filterRating !== 'all' ? Number(filterRating) : undefined,
        search: filterSearch.trim() || undefined,
      })
      .then(({ data, meta }) => {
        setRows(data);
        setTotal(meta.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, rowsPerPage, filterRating, filterSearch]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Customer Reviews
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {total} total reviews
        </Typography>
      </Box>

      <Card>
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <OutlinedInput
            placeholder="Search user, restaurant…"
            value={filterSearch}
            onChange={(e) => { setFilterSearch(e.target.value); setPage(0); }}
            startAdornment={<InputAdornment position="start"><Iconify icon="eva:search-fill" /></InputAdornment>}
            sx={{ flexGrow: 1, maxWidth: 340, height: 40 }}
          />
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Rating</InputLabel>
            <Select
              value={filterRating}
              label="Rating"
              onChange={(e: SelectChangeEvent) => { setFilterRating(e.target.value); setPage(0); }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="5">★★★★★ (5)</MenuItem>
              <MenuItem value="4">★★★★ (4)</MenuItem>
              <MenuItem value="3">★★★ (3)</MenuItem>
              <MenuItem value="2">★★ (2)</MenuItem>
              <MenuItem value="1">★ (1)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Order #</TableCell>
                  <TableCell>Restaurant</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Review</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography variant="body2" color="text.secondary">No reviews found</Typography>
                    </TableCell>
                  </TableRow>
                ) : rows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {row.order_number ?? '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>{row.restaurant.name}</TableCell>
                    <TableCell>{row.user.name}</TableCell>
                    <TableCell>
                      <StarRating value={row.rating} />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>
                      {row.customer_review ? (
                        <Typography variant="body2" noWrap title={row.customer_review}>
                          {row.customer_review}
                        </Typography>
                      ) : (
                        <Chip label="No comment" size="small" variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {row.completed_at ? fDate(row.completed_at) : '—'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </Card>
    </DashboardContent>
  );
}
