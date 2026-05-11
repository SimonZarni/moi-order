import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

interface AuditLogDiffProps {
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
}

// ----------------------------------------------------------------------

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

// ----------------------------------------------------------------------

export function AuditLogDiff({ oldValues, newValues }: AuditLogDiffProps) {
  if (!oldValues && !newValues) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1.5 }}>
        No field changes recorded for this action.
      </Typography>
    );
  }

  if (!oldValues && newValues) {
    return (
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          Created with:
        </Typography>
        <Stack spacing={0.5}>
          {Object.entries(newValues).map(([key, value]) => (
            <Stack key={key} direction="row" spacing={1} alignItems="baseline">
              <Typography
                variant="body2"
                sx={{ minWidth: 140, fontFamily: 'monospace', fontSize: 12, color: 'text.secondary' }}
              >
                {key}
              </Typography>
              <Typography
                variant="body2"
                sx={{ px: 1, py: 0.25, borderRadius: 0.5, bgcolor: 'success.lighter', fontSize: 12 }}
              >
                {formatValue(value)}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    );
  }

  if (oldValues && !newValues) {
    return (
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          State at deletion:
        </Typography>
        <Stack spacing={0.5}>
          {Object.entries(oldValues).map(([key, value]) => (
            <Stack key={key} direction="row" spacing={1} alignItems="baseline">
              <Typography
                variant="body2"
                sx={{ minWidth: 140, fontFamily: 'monospace', fontSize: 12, color: 'text.secondary' }}
              >
                {key}
              </Typography>
              <Typography
                variant="body2"
                sx={{ px: 1, py: 0.25, borderRadius: 0.5, bgcolor: 'error.lighter', fontSize: 12 }}
              >
                {formatValue(value)}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    );
  }

  const allKeys = Array.from(new Set([...Object.keys(oldValues!), ...Object.keys(newValues!)]));

  return (
    <Box sx={{ px: 2, py: 1.5 }}>
      <Stack direction="row" sx={{ mb: 1 }} spacing={0}>
        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 140 }} />
        <Typography variant="caption" color="error.main" sx={{ minWidth: 180, fontWeight: 600 }}>
          Before
        </Typography>
        <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
          After
        </Typography>
      </Stack>

      <Stack spacing={0.5}>
        {allKeys.map((key) => {
          const before = formatValue(oldValues![key]);
          const after  = formatValue(newValues![key]);
          const changed = before !== after;

          return (
            <Stack key={key} direction="row" spacing={0} alignItems="baseline">
              <Typography
                variant="body2"
                sx={{ minWidth: 140, fontFamily: 'monospace', fontSize: 12, color: 'text.secondary' }}
              >
                {key}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  minWidth: 180,
                  px: 1,
                  py: 0.25,
                  borderRadius: 0.5,
                  fontSize: 12,
                  bgcolor: changed ? 'error.lighter' : 'transparent',
                  color: changed ? 'error.dark' : 'text.primary',
                }}
              >
                {before}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: 0.5,
                  fontSize: 12,
                  bgcolor: changed ? 'success.lighter' : 'transparent',
                  color: changed ? 'success.dark' : 'text.primary',
                }}
              >
                {after}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}
