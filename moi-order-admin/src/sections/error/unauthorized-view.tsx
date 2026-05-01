import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function UnauthorizedView() {
  const router = useRouter();

  return (
    <DashboardContent>
      <Box
        sx={{
          py: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            bgcolor: 'error.lighter',
          }}
        >
          <Iconify icon="solar:shield-keyhole-bold-duotone" width={36} sx={{ color: 'error.main' }} />
        </Box>

        <Typography variant="h3" sx={{ mb: 1 }}>
          Access Denied
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 420 }}>
          You don&apos;t have permission to view this page. Contact your administrator if you believe
          this is a mistake.
        </Typography>

        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={16} sx={{ transform: 'rotate(180deg)' }} />}
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </Box>
    </DashboardContent>
  );
}
