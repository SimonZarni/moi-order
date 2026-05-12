import type { ServiceCheck, SystemHealthData, ScheduledTask, FailedJob } from 'src/api/systemHealth';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { fToNow } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { useSystemHealthView } from '../hooks/useSystemHealthView';

// ----------------------------------------------------------------------

function StatusDot({ status }: { status: 'ok' | 'error' }) {
  return (
    <Box
      sx={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        flexShrink: 0,
        bgcolor: status === 'ok' ? 'success.main' : 'error.main',
      }}
    />
  );
}

// ----------------------------------------------------------------------

function ServicesCard({ services }: { services: ServiceCheck[] }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="External Services" />
      <CardContent sx={{ pt: 0 }}>
        <Stack spacing={1.5}>
          {services.map((svc) => (
            <Stack key={svc.name} direction="row" alignItems="center" spacing={1.5}>
              <StatusDot status={svc.status} />
              <Typography variant="body2" sx={{ flex: 1 }}>
                {svc.name}
              </Typography>
              {svc.status === 'ok' ? (
                <Typography variant="caption" color="text.disabled">
                  {svc.latency_ms} ms
                </Typography>
              ) : (
                <Tooltip title={svc.message ?? 'Error'}>
                  <Chip label="Error" color="error" size="small" variant="outlined" />
                </Tooltip>
              )}
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

function ResourceBar({ label, used, total, unit }: { label: string; used: number; total: number; unit: string }) {
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  const color = pct >= 90 ? 'error' : pct >= 75 ? 'warning' : 'primary';

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={0.5}>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="caption" color="text.secondary">
          {used} / {total} {unit}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={pct}
        color={color}
        sx={{ height: 6, borderRadius: 1 }}
      />
    </Box>
  );
}

function ServerCard({ server }: { server: SystemHealthData['server'] }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Server Resources" />
      <CardContent sx={{ pt: 0 }}>
        <Stack spacing={2.5}>
          <Box>
            <Stack direction="row" justifyContent="space-between" mb={0.5}>
              <Typography variant="caption" color="text.secondary">CPU Load (1m / 5m / 15m)</Typography>
              <Typography variant="caption" color="text.secondary">
                {server.cpu_count} cores
              </Typography>
            </Stack>
            <Typography variant="body2" fontFamily="monospace">
              {server.load_1} &nbsp;/&nbsp; {server.load_5} &nbsp;/&nbsp; {server.load_15}
            </Typography>
          </Box>

          <ResourceBar
            label="Memory"
            used={server.memory_used_mb}
            total={server.memory_total_mb}
            unit="MB"
          />
          <ResourceBar
            label="Disk"
            used={server.disk_used_gb}
            total={server.disk_total_gb}
            unit="GB"
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

function InfoRow({ label, value }: { label: string; value: string | boolean }) {
  const display = typeof value === 'boolean'
    ? <Label color={value ? 'error' : 'success'}>{value ? 'ON' : 'OFF'}</Label>
    : <Typography variant="body2" fontFamily="monospace" fontSize={12}>{value}</Typography>;

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" py={0.75}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      {display}
    </Stack>
  );
}

function AppInfoCard({ app }: { app: SystemHealthData['app'] }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Application" />
      <CardContent sx={{ pt: 0 }}>
        <Divider />
        <InfoRow label="Laravel" value={app.laravel_version} />
        <Divider />
        <InfoRow label="PHP" value={app.php_version} />
        <Divider />
        <InfoRow label="Environment" value={app.env} />
        <Divider />
        <InfoRow label="Debug Mode" value={app.debug} />
        <Divider />
        <InfoRow label="Cache" value={app.cache_driver} />
        <Divider />
        <InfoRow label="Queue" value={app.queue_connection} />
        <Divider />
        <InfoRow label="Timezone" value={app.timezone} />
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

function QueueCard({ queue }: { queue: SystemHealthData['queue'] }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Queue Health" />
      <CardContent sx={{ pt: 0 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <StatusDot status={queue.worker_alive ? 'ok' : 'error'} />
            <Typography variant="body2">
              Worker{' '}
              <Typography component="span" variant="body2" fontWeight={600}>
                {queue.worker_alive ? 'Alive' : 'Not Responding'}
              </Typography>
            </Typography>
            {queue.heartbeat_age_seconds !== null && (
              <Typography variant="caption" color="text.disabled">
                last beat {queue.heartbeat_age_seconds}s ago
              </Typography>
            )}
          </Stack>

          <Divider />

          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Queue Depths
            </Typography>
            <Stack spacing={0.75} mt={0.5}>
              {queue.depths.map((d) => (
                <Stack key={d.queue} direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">{d.queue}</Typography>
                  <Chip
                    label={d.depth ?? '?'}
                    size="small"
                    color={d.depth ? 'warning' : 'default'}
                    variant="outlined"
                    sx={{ minWidth: 40, height: 20, fontSize: 11 }}
                  />
                </Stack>
              ))}
            </Stack>
          </Box>

          <Divider />

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">Failed Jobs</Typography>
            <Label color={queue.failed_count > 0 ? 'error' : 'success'}>
              {queue.failed_count}
            </Label>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

function FailedJobsCard({ jobs }: { jobs: FailedJob[] }) {
  return (
    <Card>
      <CardHeader title={`Recent Failed Jobs (${jobs.length})`} />
      <Scrollbar>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Queue</TableCell>
                <TableCell>Job Class</TableCell>
                <TableCell align="right">Failed At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="text.secondary" py={2}>
                      No failed jobs
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id} hover>
                    <TableCell>
                      <Typography variant="caption" color="text.disabled">{job.id}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={job.queue} size="small" variant="outlined" sx={{ fontSize: 11, height: 20 }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace" fontSize={12}>
                        {job.job_class}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" color="text.secondary">
                        {fToNow(job.failed_at)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

function ScheduleCard({ tasks }: { tasks: ScheduledTask[] }) {
  return (
    <Card>
      <CardHeader title="Scheduled Tasks" />
      <Scrollbar>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Command</TableCell>
                <TableCell>Expression</TableCell>
                <TableCell>Timezone</TableCell>
                <TableCell align="right">Next Run</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task, i) => (
                <TableRow key={i} hover>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace" fontSize={12}>
                      {task.command}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={task.expression} size="small" variant="outlined" sx={{ fontSize: 11, height: 20 }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">{task.timezone}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="caption" color="text.secondary">
                      {task.next_run_at ? fToNow(task.next_run_at) : '—'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

export function SystemHealthView() {
  const { data, isLoading, refetch } = useSystemHealthView();

  const allOk = data?.services.every((s) => s.status === 'ok') ?? true;

  return (
    <DashboardContent>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4">System Health</Typography>
          {data?.checked_at && (
            <Typography variant="body2" color="text.secondary">
              Last checked {fToNow(data.checked_at)}
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          {!isLoading && (
            <Label color={allOk ? 'success' : 'error'}>
              {allOk ? 'All Systems Operational' : 'Issues Detected'}
            </Label>
          )}
          <Button
            size="small"
            variant="outlined"
            onClick={refetch}
            disabled={isLoading}
            startIcon={
              isLoading
                ? <CircularProgress size={14} />
                : <Iconify icon="solar:restart-bold" width={16} />
            }
          >
            Refresh
          </Button>
        </Stack>
      </Stack>

      {isLoading && !data ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : data ? (
        <Stack spacing={3}>
          {/* Row 1 — Services + Server */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <ServicesCard services={data.services} />
            <ServerCard server={data.server} />
          </Box>

          {/* Row 2 — App Info + Queue */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 3 }}>
            <AppInfoCard app={data.app} />
            <QueueCard queue={data.queue} />
          </Box>

          {/* Row 3 — Failed Jobs */}
          <FailedJobsCard jobs={data.failed_jobs} />

          {/* Row 4 — Scheduled Tasks */}
          <ScheduleCard tasks={data.schedule} />
        </Stack>
      ) : null}
    </DashboardContent>
  );
}
