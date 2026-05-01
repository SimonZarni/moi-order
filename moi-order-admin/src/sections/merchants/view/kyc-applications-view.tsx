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
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { type KycApplication, type KycApplicationStatus, merchantsApi } from 'src/api/merchants';

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

type TabValue = 'all' | KycApplicationStatus;

type Tab = { label: string; value: TabValue };

const TABS: Tab[] = [
  { label: 'All',          value: 'all' },
  { label: 'Submitted',    value: 'submitted' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Approved',     value: 'approved' },
  { label: 'Rejected',     value: 'rejected' },
];

// ----------------------------------------------------------------------

export function KycApplicationsView() {
  const router = useRouter();
  const [rows, setRows] = useState<KycApplication[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState<TabValue>('all');

  const fetchApplications = useCallback(() => {
    setLoading(true);
    merchantsApi
      .getKycApplications({
        page: page + 1,
        per_page: rowsPerPage,
        status: activeTab !== 'all' ? activeTab : undefined,
      })
      .then(({ data, meta }) => {
        setRows(data);
        setTotal(meta.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, rowsPerPage, activeTab]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Poll every 30 seconds for new applications
  useEffect(() => {
    const interval = setInterval(fetchApplications, 30_000);
    return () => clearInterval(interval);
  }, [fetchApplications]);

  const handleTabChange = useCallback((value: TabValue) => {
    setActiveTab(value);
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
        {/* Tab filters */}
        <Box sx={{ px: 2.5, pt: 2, pb: 1 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {TABS.map((tab) => (
              <Chip
                key={tab.value}
                label={tab.label}
                variant={activeTab === tab.value ? 'filled' : 'outlined'}
                color={activeTab === tab.value ? 'primary' : 'default'}
                onClick={() => handleTabChange(tab.value)}
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Box>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Applicant</TableCell>
                  <TableCell>Business Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {rows.map((row) => (
                      <TableRow key={row.id} hover>
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
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{row.business_type}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {row.user_phone ?? '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Label color={STATUS_COLOR[row.status] ?? 'default'}>
                            {row.status_label}
                          </Label>
                        </TableCell>
                        <TableCell>
                          {row.submitted_at ? fDate(row.submitted_at) : '—'}
                        </TableCell>
                        <TableCell align="right">
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
                        <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
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
