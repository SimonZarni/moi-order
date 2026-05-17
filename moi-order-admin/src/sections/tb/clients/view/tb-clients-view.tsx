import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import Switch from '@mui/material/Switch';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { tbStore } from '../../shared/tb-mock-store';

import type { TBClient } from '../../shared/tb-mock-store';

// ----------------------------------------------------------------------

type ClientRow = TBClient & {
  vatRegistered: boolean;
  monthlyAccounting: boolean;
};

// ----------------------------------------------------------------------

export function TBClientsView() {
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<ClientRow[]>(() =>
    tbStore.clients.map((c) => ({ ...c }))
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handleToggleVat = useCallback((id: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, vatRegistered: !r.vatRegistered } : r))
    );
  }, []);

  const handleToggleMonthly = useCallback((id: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, monthlyAccounting: !r.monthlyAccounting } : r))
    );
  }, []);

  const filtered = rows.filter(
    (r) =>
      r.companyName.toLowerCase().includes(search.toLowerCase()) ||
      r.thaiRegNumber.includes(search)
  );

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Clients Overview
      </Typography>

      <TextField
        value={search}
        onChange={handleSearch}
        placeholder="Search by company name or registration number..."
        sx={{ mb: 3, maxWidth: 480 }}
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
        <TableContainer sx={{ minWidth: 900 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company Name</TableCell>
                <TableCell>Thai Reg. Number</TableCell>
                <TableCell>Registration Date</TableCell>
                <TableCell align="center">VAT Status</TableCell>
                <TableCell align="center">Monthly Accounting</TableCell>
                <TableCell align="center">DBD Portal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.disabled">
                      No clients match your search.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="fontWeightMedium">
                      {row.companyName}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                      {row.thaiRegNumber}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {fDate(row.registrationDate)}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <Switch
                        size="small"
                        checked={row.vatRegistered}
                        onChange={() => handleToggleVat(row.id)}
                        color="success"
                      />
                      <Typography variant="caption" color={row.vatRegistered ? 'success.main' : 'text.disabled'}>
                        {row.vatRegistered ? 'Yes' : 'No'}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <Switch
                        size="small"
                        checked={row.monthlyAccounting}
                        onChange={() => handleToggleMonthly(row.id)}
                        color="primary"
                      />
                      <Typography variant="caption" color={row.monthlyAccounting ? 'primary.main' : 'text.disabled'}>
                        {row.monthlyAccounting ? 'On' : 'Off'}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Link
                      href={row.dbdUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="none"
                    >
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.5,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          fontSize: 12,
                          fontWeight: 500,
                          '&:hover': { bgcolor: 'primary.lighter' },
                        }}
                      >
                        <Iconify icon="solar:share-bold" width={14} />
                        DBD
                      </Box>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </DashboardContent>
  );
}
