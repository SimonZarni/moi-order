import type { SelectChangeEvent } from '@mui/material/Select';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { AuditLogRow } from './AuditLogRow';
import { useAuditLogsView } from '../hooks/useAuditLogsView';

// ----------------------------------------------------------------------

const ENTITY_TYPES = ['user', 'payment', 'place', 'restaurant', 'submission'];

const ACTION_OPTIONS = [
  { value: 'all',            label: 'All Actions'    },
  { value: 'created',        label: 'Created'        },
  { value: 'updated',        label: 'Updated'        },
  { value: 'deleted',        label: 'Deleted'        },
  { value: 'restored',       label: 'Restored'       },
  { value: 'login',          label: 'Login'          },
  { value: 'logout',         label: 'Logout'         },
  { value: 'status_changed', label: 'Status Changed' },
  { value: 'exported',       label: 'Exported'       },
];

// ----------------------------------------------------------------------

export function AuditLogsView() {
  const {
    logs,
    total,
    isLoading,
    page,
    rowsPerPage,
    filterAction,
    filterEntityType,
    filterDateFrom,
    filterDateTo,
    filterSearch,
    updateParams,
    handleExport,
  } = useAuditLogsView();

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">Audit Log</Typography>
          <Typography variant="body2" color="text.secondary">
            Track every admin action across the platform
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="solar:share-bold" />}
          onClick={handleExport}
        >
          Export CSV
        </Button>
      </Box>

      <Card>
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search admin or entity…"
            value={filterSearch}
            onChange={(e) => updateParams({ search: e.target.value, page: '0' })}
            sx={{ minWidth: 220 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" width={16} sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Action</InputLabel>
            <Select
              value={filterAction}
              label="Action"
              onChange={(e: SelectChangeEvent) => updateParams({ action: e.target.value, page: '0' })}
            >
              {ACTION_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Entity</InputLabel>
            <Select
              value={filterEntityType}
              label="Entity"
              onChange={(e: SelectChangeEvent) => updateParams({ entity_type: e.target.value, page: '0' })}
            >
              <MenuItem value="all">All Entities</MenuItem>
              {ENTITY_TYPES.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              size="small"
              label="From"
              type="date"
              value={filterDateFrom}
              onChange={(e) => updateParams({ date_from: e.target.value, page: '0' })}
              sx={{ width: 150 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              size="small"
              label="To"
              type="date"
              value={filterDateTo}
              onChange={(e) => updateParams({ date_to: e.target.value, page: '0' })}
              sx={{ width: 150 }}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>

          <Typography variant="body2" sx={{ ml: 'auto', color: 'text.secondary' }}>
            {total} events
          </Typography>
        </Box>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow>
                  <TableCell width={40}>#</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Entity</TableCell>
                  <TableCell>IP</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell width={48} />
                </TableRow>
              </TableHead>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {logs.map((row, index) => (
                      <AuditLogRow
                        key={row.id}
                        row={row}
                        index={page * rowsPerPage + index}
                      />
                    ))}
                    {logs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                          No audit log entries found
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
          rowsPerPageOptions={[10, 20, 50]}
          onPageChange={(_, newPage) => updateParams({ page: String(newPage) })}
          onRowsPerPageChange={(e) => updateParams({ per_page: e.target.value, page: '0' })}
        />
      </Card>
    </DashboardContent>
  );
}
