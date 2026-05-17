import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { tbStore } from '../../shared/tb-mock-store';

// ----------------------------------------------------------------------

type StatCardProps = {
  label: string;
  value: number | string;
  color?: string;
};

function StatCard({ label, value, color = '#10B981' }: StatCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
      }}
    >
      <Typography variant="h3" sx={{ color, fontWeight: 'fontWeightBold', mb: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Paper>
  );
}

// ----------------------------------------------------------------------

const CATEGORY_COLORS: Record<string, string> = {
  kanban: '#10B981',
  document: '#6366F1',
  config: '#F59E0B',
};

const CATEGORY_LABELS: Record<string, string> = {
  kanban: 'Kanban',
  document: 'Document',
  config: 'Config',
};

// ----------------------------------------------------------------------

export function TBOverviewView() {
  const totalClients = tbStore.clients.length;
  const activeCards = tbStore.kanbanCards.filter(
    (c) => c.column !== 'completed'
  ).length;
  const pendingDocs = tbStore.documentBatches.filter(
    (b) => b.status === 'pending'
  ).length;
  const recentLog = tbStore.auditLog.slice(0, 8);

  const pipelineStats = [
    {
      label: 'Backlog',
      cr: tbStore.kanbanCards.filter((c) => c.pipeline === 'company_registration' && c.column === 'backlog').length,
      vw: tbStore.kanbanCards.filter((c) => c.pipeline === 'visa_work_permit' && c.column === 'backlog').length,
    },
    {
      label: 'Processing',
      cr: tbStore.kanbanCards.filter((c) => c.pipeline === 'company_registration' && c.column === 'processing').length,
      vw: tbStore.kanbanCards.filter((c) => c.pipeline === 'visa_work_permit' && c.column === 'processing').length,
    },
    {
      label: 'Doc Review',
      cr: tbStore.kanbanCards.filter((c) => c.pipeline === 'company_registration' && c.column === 'document_review').length,
      vw: tbStore.kanbanCards.filter((c) => c.pipeline === 'visa_work_permit' && c.column === 'document_review').length,
    },
    {
      label: 'Completed',
      cr: tbStore.kanbanCards.filter((c) => c.pipeline === 'company_registration' && c.column === 'completed').length,
      vw: tbStore.kanbanCards.filter((c) => c.pipeline === 'visa_work_permit' && c.column === 'completed').length,
    },
  ];

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Trusted Brothers — Operations Overview
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Total Clients" value={totalClients} color="#10B981" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Kanban Cards Active" value={activeCards} color="#6366F1" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Docs Pending Review" value={pendingDocs} color="#F59E0B" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Audit Events Today" value={tbStore.auditLog.length} color="#EC4899" />
        </Grid>

        {/* Pipeline breakdown */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}
          >
            <Typography variant="subtitle1" fontWeight="fontWeightSemiBold" sx={{ mb: 3 }}>
              Pipeline Breakdown
            </Typography>
            <Stack spacing={2}>
              {pipelineStats.map((stat) => (
                <Box key={stat.label}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        size="small"
                        label={`Corp Reg: ${stat.cr}`}
                        sx={{ bgcolor: '#D1FAE5', color: '#065F46', fontSize: 11 }}
                      />
                      <Chip
                        size="small"
                        label={`Visa/WP: ${stat.vw}`}
                        sx={{ bgcolor: '#E0E7FF', color: '#3730A3', fontSize: 11 }}
                      />
                    </Stack>
                  </Stack>
                  <Box
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      bgcolor: 'background.neutral',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        width: `${((stat.cr + stat.vw) / tbStore.kanbanCards.length) * 100}%`,
                        bgcolor: '#10B981',
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Recent audit log */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}
          >
            <Typography variant="subtitle1" fontWeight="fontWeightSemiBold" sx={{ mb: 3 }}>
              Recent Activity
            </Typography>
            <Stack spacing={2}>
              {recentLog.length === 0 && (
                <Typography variant="body2" color="text.disabled">
                  No activity recorded yet.
                </Typography>
              )}
              {recentLog.map((entry) => (
                <Stack key={entry.id} direction="row" spacing={1.5} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: CATEGORY_COLORS[entry.category] ?? '#9CA3AF',
                      flexShrink: 0,
                      mt: 0.5,
                    }}
                  />
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="body2" noWrap>
                      {entry.action}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="caption" color="text.disabled">
                        {entry.actor}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        ·
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {fDate(entry.timestamp)}
                      </Typography>
                      <Chip
                        size="small"
                        label={CATEGORY_LABELS[entry.category]}
                        sx={{
                          height: 16,
                          fontSize: 10,
                          bgcolor: CATEGORY_COLORS[entry.category],
                          color: '#fff',
                          ml: 0.5,
                        }}
                      />
                    </Stack>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
