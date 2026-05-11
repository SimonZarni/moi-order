import type { AuditLogData } from 'src/api/auditLogs';
import type { LabelColor } from 'src/components/label';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { fToNow } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { AuditLogDiff } from './AuditLogDiff';

// ----------------------------------------------------------------------

const ACTION_COLORS: Record<string, LabelColor> = {
  created:        'success',
  updated:        'info',
  deleted:        'error',
  restored:       'warning',
  login:          'default',
  logout:         'default',
  status_changed: 'warning',
  exported:       'default',
};

function adminInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// ----------------------------------------------------------------------

interface AuditLogRowProps {
  row: AuditLogData;
  index: number;
}

// ----------------------------------------------------------------------

export function AuditLogRow({ row, index }: AuditLogRowProps) {
  const [expanded, setExpanded] = useState(false);

  const hasDiff = row.old_values !== null || row.new_values !== null;

  return (
    <>
      <TableRow
        hover
        sx={{ cursor: hasDiff ? 'pointer' : 'default' }}
        onClick={() => hasDiff && setExpanded((prev) => !prev)}
      >
        <TableCell>
          <Typography variant="caption" color="text.disabled">
            {index + 1}.
          </Typography>
        </TableCell>

        <TableCell>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ width: 32, height: 32, fontSize: 12, bgcolor: 'primary.main' }}>
              {adminInitials(row.admin.name)}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                {row.admin.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {row.admin.email}
              </Typography>
            </Box>
          </Stack>
        </TableCell>

        <TableCell>
          <Label color={ACTION_COLORS[row.action] ?? 'default'}>
            {row.action_label}
          </Label>
        </TableCell>

        <TableCell>
          {row.entity_type ? (
            <Stack spacing={0.25}>
              <Chip
                label={row.entity_type}
                size="small"
                variant="outlined"
                sx={{ fontSize: 11, height: 20, width: 'fit-content' }}
              />
              <Typography variant="caption" color="text.secondary">
                {row.entity_label ?? '—'}
              </Typography>
            </Stack>
          ) : (
            <Typography variant="body2" color="text.disabled">—</Typography>
          )}
        </TableCell>

        <TableCell>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: 11, color: 'text.secondary' }}>
            {row.ip_address ?? '—'}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" color="text.secondary">
            {fToNow(row.created_at)}
          </Typography>
        </TableCell>

        <TableCell align="right" width={48}>
          {hasDiff && (
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); setExpanded((prev) => !prev); }}>
              <Iconify
                icon={expanded ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                width={16}
              />
            </IconButton>
          )}
        </TableCell>
      </TableRow>

      {hasDiff && (
        <TableRow>
          <TableCell colSpan={7} sx={{ py: 0, border: 0 }}>
            <Collapse in={expanded} unmountOnExit>
              <Box sx={{ bgcolor: 'background.neutral', borderRadius: 1, my: 0.5 }}>
                <AuditLogDiff oldValues={row.old_values} newValues={row.new_values} />
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
