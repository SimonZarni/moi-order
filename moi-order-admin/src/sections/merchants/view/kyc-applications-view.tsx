import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { merchantsApi, type KycApplication, type KycApplicationStatus } from 'src/api/merchants';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type StatusColor = 'success' | 'warning' | 'info' | 'error' | 'default';

const STATUS_COLOR: Record<KycApplicationStatus, StatusColor> = {
  submitted:    'warning',
  under_review: 'info',
  approved:     'success',
  rejected:     'error',
  draft:        'default',
};

type TypeTab = 'all' | 'initial' | 'resubmission';
type StatusTab = 'all' | KycApplicationStatus;

type Tab = { label: string; value: StatusTab };
type TypeTabItem = { label: string; value: TypeTab };

const STATUS_TABS: Tab[] = [
  { label: 'All',          value: 'all' },
  { label: 'Submitted',    value: 'submitted' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Approved',     value: 'approved' },
  { label: 'Rejected',     value: 'rejected' },
];

const TYPE_TABS: TypeTabItem[] = [
  { label: 'All Types',     value: 'all' },
  { label: 'Initial KYC',   value: 'initial' },
  { label: 'Resubmission',  value: 'resubmission' },
];

// ----------------------------------------------------------------------

export function KycApplicationsView() {
  const router = useRouter();
  const [rows, setRows] = useState<KycApplication[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeStatus, setActiveStatus] = useState<StatusTab>('all');
  const [activeType, setActiveType] = useState<TypeTab>('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchApplications = useCallback(() => {
    setLoading(true);
    merchantsApi
      .getKycApplications({
        page: page + 1,
        per_page: rowsPerPage,
        status: activeStatus !== 'all' ? activeStatus : undefined,
        type: activeType !== 'all' ? activeType : undefined,
        search: search || undefined,
      })
      .then(({ data, meta }) => {
        setRows(data);
        setTotal(meta.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, rowsPerPage, activeStatus, activeType, search]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    const interval = setInterval(fetchApplications, 30_000);
    return () => clearInterval(interval);
  }, [fetchApplications]);

  const handleStatusTab = useCallback((value: StatusTab) => {
    setActiveStatus(value);
    setPage(0);
  }, []);

  const handleTypeTab = useCallback((value: TypeTab) => {
    setActiveType(value);
    setPage(0);
  }, []);

  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setSearch(searchInput);
      setPage(0);
    }
  }, [searchInput]);

  const handleSearchClear = useCallback(() => {
    setSearchInput('');
    setSearch('');
    setPage(0);
  }, []);

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Merchant Applications
        </Typography>
      </Box>

      <Card>
        {/* Type tabs */}
        <Box sx={{ px: 2.5, pt: 2, pb: 0 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {TYPE_TABS.map((tab) => (
              <Chip
                key={tab.value}
                label={tab.label}
                variant={activeType === tab.value ? 'filled' : 'outlined'}
                color={activeType === tab.value ? 'primary' : 'default'}
                onClick={() => handleTypeTab(tab.value)}
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Box>

        {/* Status tabs */}
        <Box sx={{ px: 2.5, pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {STATUS_TABS.map((tab) => (
              <Chip
                key={tab.value}
                label={tab.label}
                size="small"
                variant={activeStatus === tab.value ? 'filled' : 'outlined'}
                color={activeStatus === tab.value ? 'secondary' : 'default'}
                onClick={() => handleStatusTab(tab.value)}
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Box>

        {/* Search */}
        <Box sx={{ px: 2.5, py: 1.5 }}>
          <TextField
            size="small"
            placeholder="Search by business name or applicant…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            sx={{ width: 360 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" width={18} />
                </InputAdornment>
              ),
              endAdornment: searchInput ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleSearchClear}>
                    <Iconify icon="mingcute:close-line" width={16} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            Press Enter to search
          </Typography>
        </Box>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 960 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Applicant</TableCell>
                  <TableCell>Business Name</TableCell>
                  <TableCell>Shop ID</TableCell>
                  <TableCell>KYC Type</TableCell>
                  <TableCell>Biz Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted</TableCell>
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
                    {rows.map((row) => (
                      <TableRow key={row.id} hover sx={{ cursor: 'pointer' }} onClick={() => router.push(`/merchants/kyc/${row.id}`)}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {row.user_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.user_email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{row.business_name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.business_address}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace" color="text.secondary">
                            {row.shop_id != null ? `#${row.shop_id}` : '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Label color={row.type === 'resubmission' ? 'warning' : 'default'}>
                            {row.type === 'resubmission' ? 'Resubmission' : 'Initial'}
                          </Label>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{row.business_type}</Typography>
                        </TableCell>
                        <TableCell>
                          <Label color={STATUS_COLOR[row.status] ?? 'default'}>
                            {row.status_label}
                          </Label>
                        </TableCell>
                        <TableCell>
                          {row.submitted_at ? fDate(row.submitted_at) : '—'}
                        </TableCell>
                        <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                          <IconButton
                            size="small"
                            onClick={() => router.push(`/merchants/kyc/${row.id}`)}
                          >
                            <Iconify icon="solar:eye-bold" width={16} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {rows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                          No applications found
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
    </DashboardContent>
  );
}
