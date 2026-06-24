import type { IconifyName } from 'src/components/iconify';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import type { SafetyCategory } from 'src/api/safety';

// ----------------------------------------------------------------------

type CategoryRow = {
  category:    SafetyCategory;
  label:       string;
  description: string;
  icon:        IconifyName;
  color:       string;
};

const ROWS: CategoryRow[] = [
  {
    category:    'hospital',
    label:       'Hospitals',
    description: 'Medical facilities and emergency healthcare',
    icon:        'solar:hospital-bold',
    color:       '#ef5350',
  },
  {
    category:    'police_station',
    label:       'Police Stations',
    description: 'Law enforcement and public safety offices',
    icon:        'solar:shield-bold',
    color:       '#1565c0',
  },
  {
    category:    'rescue',
    label:       'Rescue',
    description: 'Emergency rescue and disaster response services',
    icon:        'solar:danger-bold',
    color:       '#f57c00',
  },
];

// ----------------------------------------------------------------------

export function SafetyView() {
  const router = useRouter();

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4">Safety</Typography>
        <Typography variant="body2" color="text.secondary">
          Manage hospitals, police stations, and rescue services shown to customers.
        </Typography>
      </Box>

      <Card>
        <List disablePadding>
          {ROWS.map((row, i) => (
            <Box key={row.category}>
              {i > 0 && <Divider />}
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label={`Edit ${row.label}`}
                    onClick={() => router.push(`/safety/${row.category}`)}
                  >
                    <Iconify icon="solar:pen-bold" width={20} />
                  </IconButton>
                }
                sx={{ py: 2.5, px: 3 }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: row.color + '22', color: row.color, width: 48, height: 48 }}>
                    <Iconify icon={row.icon} width={24} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="subtitle1" fontWeight={600}>{row.label}</Typography>}
                  secondary={row.description}
                  sx={{ ml: 1 }}
                />
              </ListItem>
            </Box>
          ))}
        </List>
      </Card>
    </DashboardContent>
  );
}
