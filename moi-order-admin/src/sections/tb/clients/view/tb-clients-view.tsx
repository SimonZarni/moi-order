import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
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

import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TBCompanyFormDialog } from './tb-company-form-dialog';
import { tbStore, addCompany, STATUS_COLORS } from '../../shared/tb-mock-store';

import type { TBClient, StatusLevel } from '../../shared/tb-mock-store';

// ----------------------------------------------------------------------

function StatusDots({ tax, company, visa }: { tax: StatusLevel; company: StatusLevel; visa: StatusLevel }) {
  return (
    <Stack spacing={0.5}>
      {([['Tax', tax], ['Company', company], ['Visa', visa]] as [string, StatusLevel][]).map(([label, level]) => (
        <Tooltip key={label} title={`${label}: ${level}`} placement="left">
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ cursor: 'default' }}>
            <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: STATUS_COLORS[level], flexShrink: 0 }} />
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>{label}</Typography>
          </Stack>
        </Tooltip>
      ))}
    </Stack>
  );
}

// ----------------------------------------------------------------------

export function TBClientsView() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<TBClient[]>(() => tbStore.clients.map((c) => ({ ...c })));
  const [addOpen, setAddOpen] = useState(false);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handleRowClick = useCallback((id: string) => {
    router.push(`/tb/clients/${id}`);
  }, [router]);

  const handleAddCompany = useCallback(
    (data: Omit<TBClient, 'id' | 'history' | 'clientPasswordSet'> & { clientPasswordSet?: boolean }) => {
      const created = addCompany(data);
      setRows([...tbStore.clients]);
      setAddOpen(false);
      router.push(`/tb/clients/${created.id}`);
    },
    [router]
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
                <TableCell align="center">DBD</TableCell>
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
                <TableRow
                  key={row.id}
                  hover
                  onClick={() => handleRowClick(row.id)}
                  sx={{ cursor: 'pointer' }}
                >
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

                  {/* VAT — read-only, edit via company detail */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ color: row.vatRegistered ? '#10B981' : 'text.disabled', fontWeight: row.vatRegistered ? 600 : 400 }}>
                      {row.vatRegistered ? 'Yes' : 'No'}
                    </Typography>
                  </TableCell>

                  {/* Monthly Accounting — read-only */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ color: row.monthlyAccounting ? '#10B981' : 'text.disabled', fontWeight: row.monthlyAccounting ? 600 : 400 }}>
                      {row.monthlyAccounting ? 'Yes' : 'No'}
                    </Typography>
                  </TableCell>

                  {/* DBD link */}
                  <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="DBD Portal">
                      <IconButton
                        size="small"
                        component={Link}
                        href={row.dbdUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      >
                        <Iconify icon="solar:share-bold" width={18} />
                      </IconButton>
                    </Tooltip>
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
    </DashboardContent>
  );
}
