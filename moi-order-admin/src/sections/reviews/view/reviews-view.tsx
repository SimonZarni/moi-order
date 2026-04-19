import type { SelectChangeEvent } from '@mui/material/Select';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type Review = {
  id: string;
  userName: string;
  avatarUrl: string;
  placeName: string;
  rating: number;
  comment: string;
  status: 'published' | 'pending' | 'hidden';
  createdAt: Date;
};

const MOCK_REVIEWS: Review[] = Array.from({ length: 20 }, (_, i) => ({
  id: `review-${i + 1}`,
  userName: ['Aung Ko', 'Thida Win', 'Kaung Satt', 'Mya Hnin', 'Zin Mar'][i % 5],
  avatarUrl: `/assets/images/avatar/avatar-${(i % 25) + 1}.webp`,
  placeName: ['Vientiane City Tour', 'Luang Prabang Day Trip', 'Mekong Sunset Cruise', 'Kuang Si Falls', 'Buddha Park'][i % 5],
  rating: Math.floor(Math.random() * 2) + 4,
  comment: ['Amazing experience! Highly recommend.', 'Great guide, beautiful scenery.', 'Good value for money.', 'The tour was well organized.', 'Wonderful views and friendly staff.'][i % 5],
  status: (['published', 'published', 'pending', 'published', 'hidden'] as const)[i % 5],
  createdAt: new Date(Date.now() - i * 86400000 * 3),
}));

// ----------------------------------------------------------------------

export function ReviewsView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = MOCK_REVIEWS.filter((r) => {
    const matchName = r.userName.toLowerCase().includes(filterName.toLowerCase()) || r.placeName.toLowerCase().includes(filterName.toLowerCase());
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchName && matchStatus;
  });

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>Reviews</Typography>
        <Typography variant="body2" color="text.secondary">{MOCK_REVIEWS.length} total reviews</Typography>
      </Box>

      <Card>
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <OutlinedInput
            value={filterName}
            onChange={(e) => { setFilterName(e.target.value); setPage(0); }}
            placeholder="Search by user or place..."
            startAdornment={<InputAdornment position="start"><Iconify icon="eva:search-fill" /></InputAdornment>}
            sx={{ flexGrow: 1, maxWidth: 320, height: 40 }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select value={filterStatus} label="Status" onChange={(e: SelectChangeEvent) => { setFilterStatus(e.target.value); setPage(0); }}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="hidden">Hidden</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" sx={{ ml: 'auto', color: 'text.secondary' }}>{filtered.length} results</Typography>
        </Box>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Place</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Comment</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar src={row.avatarUrl} alt={row.userName} sx={{ width: 36, height: 36 }} />
                        <Typography variant="body2" fontWeight={500}>{row.userName}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{row.placeName}</TableCell>
                    <TableCell><Rating value={row.rating} readOnly size="small" /></TableCell>
                    <TableCell sx={{ maxWidth: 240 }}>
                      <Typography variant="body2" noWrap>{row.comment}</Typography>
                    </TableCell>
                    <TableCell>{fDate(row.createdAt)}</TableCell>
                    <TableCell>
                      <Label color={row.status === 'published' ? 'success' : row.status === 'pending' ? 'warning' : 'default'}>
                        {row.status}
                      </Label>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="error">
                        <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>No reviews found</TableCell>
                  </TableRow>
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
          rowsPerPageOptions={[5, 10, 25]}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </Card>
    </DashboardContent>
  );
}
