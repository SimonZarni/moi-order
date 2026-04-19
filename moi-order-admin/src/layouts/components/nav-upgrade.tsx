import type { StackProps } from '@mui/material/Stack';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function NavUpgrade({ sx, ...other }: StackProps) {
  return (
    <Box
      sx={[
        {
          mb: 3,
          px: 2,
          py: 2,
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          borderRadius: 2,
          bgcolor: (theme) => `${theme.vars.palette.primary.lighter}22`,
          border: (theme) => `1px solid ${theme.vars.palette.primary.light}44`,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
        Moi Order Admin
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontSize: 11 }}>
        Travel app management portal
      </Typography>
    </Box>
  );
}
