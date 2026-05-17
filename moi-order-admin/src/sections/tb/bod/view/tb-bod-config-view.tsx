import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { DashboardContent } from 'src/layouts/dashboard';

import { addBodAuditEntry } from '../../shared/tb-mock-store';

// ----------------------------------------------------------------------

type BodSwitch = {
  id: string;
  label: string;
  description: string;
  group: string;
  enabled: boolean;
};

const INITIAL_SWITCHES: BodSwitch[] = [
  {
    id: 'revenue_metrics',
    label: 'Monthly Revenue Metrics',
    description: 'Expose total revenue, collected fees, and outstanding balances to BOD view.',
    group: 'Financial Analytics',
    enabled: true,
  },
  {
    id: 'bottleneck_charts',
    label: 'Pipeline Bottleneck Charts',
    description: 'Show where Kanban cards are stalling across both pipelines.',
    group: 'Operational Analytics',
    enabled: true,
  },
  {
    id: 'client_count',
    label: 'Client Count Data',
    description: 'Expose total active clients and growth trends to the BOD dashboard.',
    group: 'Client Analytics',
    enabled: true,
  },
  {
    id: 'pipeline_status',
    label: 'Live Pipeline Status',
    description: 'Stream real-time Kanban column counts and card positions.',
    group: 'Operational Analytics',
    enabled: false,
  },
  {
    id: 'doc_review_stats',
    label: 'Document Review Statistics',
    description: 'Show batch approval rates and average review turnaround time.',
    group: 'Operational Analytics',
    enabled: true,
  },
  {
    id: 'visa_expiry_alerts',
    label: 'Visa Expiry Alert Feed',
    description: 'Surface upcoming visa and work permit expirations to the BOD view.',
    group: 'Compliance',
    enabled: false,
  },
  {
    id: 'staff_audit_feed',
    label: 'Staff Activity Feed',
    description: 'Allow BOD to view the staff audit log in read-only mode.',
    group: 'Governance',
    enabled: false,
  },
  {
    id: 'cost_per_client',
    label: 'Cost-per-Client Breakdown',
    description: 'Expose internal cost analytics and margin data per client account.',
    group: 'Financial Analytics',
    enabled: false,
  },
];

// ----------------------------------------------------------------------

function BodSwitchRow({
  item,
  onChange,
}: {
  item: BodSwitch;
  onChange: (id: string, val: boolean) => void;
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{ py: 1.5 }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body2" fontWeight="fontWeightMedium">
          {item.label}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {item.description}
        </Typography>
      </Box>
      <FormControlLabel
        control={
          <Switch
            checked={item.enabled}
            onChange={(e) => onChange(item.id, e.target.checked)}
            color="primary"
          />
        }
        label={
          <Typography variant="caption" color={item.enabled ? 'primary.main' : 'text.disabled'}>
            {item.enabled ? 'Exposed' : 'Hidden'}
          </Typography>
        }
        labelPlacement="start"
        sx={{ m: 0, gap: 1 }}
      />
    </Stack>
  );
}

// ----------------------------------------------------------------------

function SwitchGroup({ group, items, onChange }: { group: string; items: BodSwitch[]; onChange: (id: string, val: boolean) => void }) {
  const exposedCount = items.filter((i) => i.enabled).length;

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
        <Typography variant="subtitle2">{group}</Typography>
        <Chip
          size="small"
          label={`${exposedCount}/${items.length} exposed`}
          color={exposedCount > 0 ? 'primary' : 'default'}
          sx={{ height: 20, fontSize: 10 }}
        />
      </Stack>
      {items.map((item, idx) => (
        <Box key={item.id}>
          <BodSwitchRow item={item} onChange={onChange} />
          {idx < items.length - 1 && <Divider />}
        </Box>
      ))}
    </Paper>
  );
}

// ----------------------------------------------------------------------

export function TBBODConfigView() {
  const [switches, setSwitches] = useState<BodSwitch[]>(INITIAL_SWITCHES);

  const handleChange = useCallback((id: string, val: boolean) => {
    setSwitches((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: val } : s))
    );
    const label = INITIAL_SWITCHES.find((s) => s.id === id)?.label ?? id;
    addBodAuditEntry(`${val ? 'Exposed' : 'Hidden'} "${label}" in BOD configuration`);
  }, []);

  const groups = [...new Set(switches.map((s) => s.group))];
  const totalExposed = switches.filter((s) => s.enabled).length;

  return (
    <DashboardContent maxWidth="md">
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="h4">BOD Configuration Panel</Typography>
        <Chip
          label={`${totalExposed} / ${switches.length} metrics exposed`}
          color={totalExposed > 0 ? 'primary' : 'default'}
          variant="outlined"
        />
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Control which analytical data pipelines are exposed to the Board of Directors view. Changes
        take effect immediately and are recorded in the Staff Audit Log.
      </Typography>

      <Stack spacing={3}>
        {groups.map((group) => (
          <SwitchGroup
            key={group}
            group={group}
            items={switches.filter((s) => s.group === group)}
            onChange={handleChange}
          />
        ))}
      </Stack>
    </DashboardContent>
  );
}
