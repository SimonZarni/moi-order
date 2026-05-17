import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';

import { tbStore, rejectDocumentBatch, approveDocumentBatch } from '../../shared/tb-mock-store';

import type { DocumentBatch } from '../../shared/tb-mock-store';

// ----------------------------------------------------------------------

type TabValue = 'pending' | 'all';

type BatchCardProps = {
  batch: DocumentBatch;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
};

function BatchCard({ batch, onApprove, onReject }: BatchCardProps) {
  const isPending = batch.status === 'pending';

  const statusColor = {
    pending: 'warning' as const,
    approved: 'success' as const,
    rejected: 'error' as const,
  }[batch.status];

  const uniqueTypes = [...new Set(batch.fileTypes)];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 2,
        border: '1px solid',
        borderColor: isPending ? 'divider' : 'transparent',
        bgcolor: isPending ? 'background.paper' : 'background.neutral',
        opacity: isPending ? 1 : 0.7,
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
            <Typography variant="body2" fontWeight="fontWeightSemiBold" noWrap>
              {batch.batchName}
            </Typography>
            <Label color={statusColor} sx={{ flexShrink: 0 }}>
              {batch.status === 'approved' ? 'Approved by Accountant' : batch.status.toUpperCase()}
            </Label>
          </Stack>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            {batch.clientName}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" color="text.disabled">
              Uploaded {fDate(batch.uploadedAt)}
            </Typography>
            <Typography variant="caption" color="text.disabled">·</Typography>
            <Typography variant="caption" color="text.disabled">
              {batch.fileCount} files
            </Typography>
            {uniqueTypes.map((type) => (
              <Chip
                key={type}
                size="small"
                label={type}
                sx={{ height: 18, fontSize: 10 }}
              />
            ))}
          </Stack>
        </Box>

        {isPending && (
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={() => onApprove(batch.id)}
              sx={{ minWidth: 90 }}
            >
              Approve
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => onReject(batch.id)}
              sx={{ minWidth: 90 }}
            >
              Reject
            </Button>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

// ----------------------------------------------------------------------

export function TBDocumentReviewView() {
  const [tab, setTab] = useState<TabValue>('pending');
  const [batches, setBatches] = useState<DocumentBatch[]>(() =>
    tbStore.documentBatches.map((b) => ({ ...b }))
  );

  const handleApprove = useCallback((id: string) => {
    approveDocumentBatch(id);
    setBatches([...tbStore.documentBatches]);
  }, []);

  const handleReject = useCallback((id: string) => {
    rejectDocumentBatch(id);
    setBatches([...tbStore.documentBatches]);
  }, []);

  const handleTabChange = useCallback((_: React.SyntheticEvent, val: TabValue) => {
    setTab(val);
  }, []);

  const pendingCount = batches.filter((b) => b.status === 'pending').length;
  const displayed = tab === 'pending' ? batches.filter((b) => b.status === 'pending') : batches;

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Document Review Desk
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Review and action incoming document batches submitted by clients. Approved batches are
        cleared from the active queue.
      </Typography>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Tab
          value="pending"
          label={
            <Stack direction="row" spacing={0.75} alignItems="center">
              <span>Pending Review</span>
              {pendingCount > 0 && (
                <Chip
                  size="small"
                  label={pendingCount}
                  color="warning"
                  sx={{ height: 18, fontSize: 10 }}
                />
              )}
            </Stack>
          }
        />
        <Tab value="all" label="All Batches" />
      </Tabs>

      <Stack spacing={2}>
        {displayed.length === 0 && (
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
              {tab === 'pending' ? 'No batches pending review.' : 'No document batches found.'}
            </Typography>
          </Paper>
        )}
        {displayed.map((batch) => (
          <BatchCard
            key={batch.id}
            batch={batch}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))}
      </Stack>
    </DashboardContent>
  );
}
