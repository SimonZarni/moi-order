import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TBCompanyFormDialog } from './tb-company-form-dialog';
import { TBCompanyDetailDrawer } from './tb-company-detail-drawer';
import { tbStore, addCompany, STATUS_COLORS } from '../../shared/tb-mock-store';

import type { TBClient, StatusLevel } from '../../shared/tb-mock-store';

// ----------------------------------------------------------------------

function StatusDots({ tax, company, visa }: { tax: StatusLevel; company: StatusLevel; visa: StatusLevel }) {
  return (
    <Stack spacing={0.5}>
      <Tooltip title={`Tax: ${tax}`} placement="left">
        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ cursor: 'default' }}>
          <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: STATUS_COLORS[tax], flexShrink: 0 }} />
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>Tax</Typography>
        </Stack>
      </Tooltip>
      <Tooltip title={`Company: ${company}`} placement="left">
        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ cursor: 'default' }}>
          <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: STATUS_COLORS[company], flexShrink: 0 }} />
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>Company</Typography>
        </Stack>
      </Tooltip>
      <Tooltip title={`Director Visa: ${visa}`} placement="left">
        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ cursor: 'default' }}>
          <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: STATUS_COLORS[visa], flexShrink: 0 }} />
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>Visa</Typography>
        </Stack>
      </Tooltip>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type LocalRow = TBClient;

export function TBClientsView() {
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<LocalRow[]>(() => tbStore.clients.map((c) => ({ ...c })));
  const [addOpen, setAddOpen] = useState(false);
  const [detailCompany, setDetailCompany] = useState<TBClient | null>(null);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handleToggleVat = useCallback((id: string) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, vatRegistered: !r.vatRegistered } : r));
  }, []);

  const handleToggleMonthly = useCallback((id: string) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, monthlyAccounting: !r.monthlyAccounting } : r));
  }, []);

  const handleAddCompany = useCallback(
    (data: Omit<TBClient, 'id' | 'history' | 'dbdUrl'>) => {
      const created = addCompany(data);
      setRows([...tbStore.clients]);
      setDetailCompany(created);
      setAddOpen(false);
    },
    []
  );

  const filtered = rows.filter(
    (r) =>
      r.companyName.toLowerCase().includes(search.toLowerCase()) ||
      r.thaiRegNumber.includes(search) ||
      r.clientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardContent maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4">Companies Overview</Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" width={18} />}
          onClick={() => setAddOpen(true)}
        >
          Add Company
        </Button>
      </Stack>

      <TextField
        value={search}
        onChange={handleSearch}
        placeholder="Search by company, registration number, or client name…"
        sx={{ mb: 3, maxWidth: 520 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" width={18} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          },
        }}
      />

      <Scrollbar>
        <TableContainer sx={{ minWidth: 960 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company</TableCell>
                <TableCell>Thai Reg. Number</TableCell>
                <TableCell>Reg. Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">VAT</TableCell>
                <TableCell align="center">Monthly</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.disabled">
                      No companies match your search.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {filtered.map((row) => (
                <TableRow key={row.id} hover>
                  {/* Company + client */}
                  <TableCell sx={{ maxWidth: 240 }}>
                    <Typography variant="body2" fontWeight="fontWeightMedium" noWrap>
                      {row.companyName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                      {row.clientName} · {row.clientPhone}
                    </Typography>
                  </TableCell>

                  {/* Reg number */}
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                      {row.thaiRegNumber}
                    </Typography>
                  </TableCell>

                  {/* Reg date */}
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {fDate(row.registrationDate)}
                    </Typography>
                  </TableCell>

                  {/* Status dots */}
                  <TableCell>
                    <StatusDots tax={row.taxStatus} company={row.companyStatus} visa={row.directorVisaStatus} />
                  </TableCell>

                  {/* VAT toggle */}
                  <TableCell align="center">
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                      <Switch
                        size="small"
                        checked={row.vatRegistered}
                        onChange={() => handleToggleVat(row.id)}
                        color="success"
                      />
                      <Typography variant="caption" color={row.vatRegistered ? 'success.main' : 'text.disabled'}>
                        {row.vatRegistered ? 'Yes' : 'No'}
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* Monthly toggle */}
                  <TableCell align="center">
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                      <Switch
                        size="small"
                        checked={row.monthlyAccounting}
                        onChange={() => handleToggleMonthly(row.id)}
                        color="primary"
                      />
                      <Typography variant="caption" color={row.monthlyAccounting ? 'primary.main' : 'text.disabled'}>
                        {row.monthlyAccounting ? 'On' : 'Off'}
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center" spacing={0.5}>
                      <Tooltip title="View details">
                        <IconButton size="small" onClick={() => setDetailCompany(row)}>
                          <Iconify icon="solar:eye-bold" width={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="DBD Portal">
                        <IconButton
                          size="small"
                          component={Link}
                          href={row.dbdUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Iconify icon="solar:share-bold" width={18} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <TBCompanyFormDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAddCompany}
      />

      <TBCompanyDetailDrawer
        company={detailCompany}
        onClose={() => setDetailCompany(null)}
      />
    </DashboardContent>
  );
}
