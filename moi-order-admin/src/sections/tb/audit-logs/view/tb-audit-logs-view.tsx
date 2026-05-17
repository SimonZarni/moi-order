import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { tbStore } from '../../shared/tb-mock-store';

import type { AuditLogEntry } from '../../shared/tb-mock-store';

// ----------------------------------------------------------------------

type CategoryFilter = 'all' | 'kanban' | 'document' | 'config';

const CATEGORY_COLORS: Record<string, string> = {
  kanban: '#10B981',
  document: '#6366F1',
  config: '#F59E0B',
};

const CATEGORY_LABELS: Record<string, string> = {
  kanban: 'Kanban',
  document: 'Document',
  config: 'BOD Config',
};

const CATEGORY_BG: Record<string, string> = {
  kanban: '#D1FAE5',
  document: '#E0E7FF',
  config: '#FEF3C7',
};

const CATEGORY_TEXT: Record<string, string> = {
  kanban: '#065F46',
  document: '#3730A3',
  config: '#92400E',
};

// ----------------------------------------------------------------------

type TimelineEntryProps = { entry: AuditLogEntry };

function TimelineEntry({ entry }: TimelineEntryProps) {
  return (
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            bgcolor: CATEGORY_COLORS[entry.category] ?? '#9CA3AF',
            mt: 0.5,
          }}
        />
        <Box
          sx={{
            width: 2,
            flexGrow: 1,
            bgcolor: 'divider',
            mt: 0.5,
            minHeight: 24,
          }}
        />
      </Box>

      <Paper
        elevation={0}
        sx={{
          flexGrow: 1,
          p: 2,
          mb: 1,
          borderRadius: 1.5,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              {entry.action}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" color="text.disabled">
                {entry.actor}
              </Typography>
              <Typography variant="caption" color="text.disabled">·</Typography>
              <Typography variant="caption" color="text.disabled">
                {fDate(entry.timestamp)}
              </Typography>
            </Stack>
          </Box>
          <Chip
            size="small"
            label={CATEGORY_LABELS[entry.category] ?? entry.category}
            sx={{
              flexShrink: 0,
              height: 20,
              fontSize: 10,
              bgcolor: CATEGORY_BG[entry.category] ?? '#F3F4F6',
              color: CATEGORY_TEXT[entry.category] ?? '#374151',
            }}
          />
        </Stack>
      </Paper>
    </Stack>
  );
}

// ----------------------------------------------------------------------

export function TBStaffAuditLogsView() {
  const [filter, setFilter] = useState<CategoryFilter>('all');

  const handleFilterChange = useCallback((val: CategoryFilter) => {
    setFilter(val);
  }, []);

  const entries = tbStore.auditLog.filter(
    (e) => filter === 'all' || e.category === filter
  );

  return (
    <DashboardContent maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4">Staff Audit Logs</Typography>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filter}
            label="Category"
            onChange={(e) => handleFilterChange(e.target.value as CategoryFilter)}
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="kanban">Kanban</MenuItem>
            <MenuItem value="document">Document</MenuItem>
            <MenuItem value="config">BOD Config</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Real-time log of admin interactions — Kanban card moves and Document approvals are recorded
        automatically.
      </Typography>

      {entries.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" color="text.disabled">
            No audit entries found. Interact with Kanban or Document views to generate logs.
          </Typography>
        </Paper>
      )}

      <Box>
        {entries.map((entry) => (
          <TimelineEntry key={entry.id} entry={entry} />
        ))}
      </Box>
    </DashboardContent>
  );
}
