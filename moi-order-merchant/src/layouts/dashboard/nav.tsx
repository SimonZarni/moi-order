import { useLocation, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import InventoryIcon from '@mui/icons-material/Inventory2Outlined';
import MenuBookIcon from '@mui/icons-material/MenuBookOutlined';
import StorefrontIcon from '@mui/icons-material/StorefrontOutlined';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import LocalDiningIcon from '@mui/icons-material/LocalDiningOutlined';

import type { MerchantUser } from 'src/types';

// ----------------------------------------------------------------------

export const NAV_WIDTH = 240;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Orders', path: '/orders', icon: <InventoryIcon /> },
  { label: 'Menu', path: '/menu', icon: <MenuBookIcon /> },
  { label: 'Restaurant', path: '/restaurant', icon: <StorefrontIcon /> },
];

// ----------------------------------------------------------------------

interface NavProps {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
  user: MerchantUser | null;
  onSignOut: () => void;
}

function NavContent({ user, onSignOut }: Pick<NavProps, 'user' | 'onSignOut'>) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: NAV_WIDTH,
      }}
    >
      {/* Logo / Title */}
      <Box
        sx={{
          px: 2.5,
          py: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <LocalDiningIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="subtitle2" fontWeight={700} lineHeight={1.2}>
            Moi Order
          </Typography>
          <Typography variant="caption" color="text.secondary" lineHeight={1.2}>
            Merchant Portal
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Navigation items */}
      <List sx={{ px: 1.5, py: 1, flexGrow: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
          return (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              selected={isActive}
              sx={{
                borderRadius: 1.5,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.dark',
                  '& .MuiListItemIcon-root': { color: 'primary.dark' },
                  '&:hover': { bgcolor: 'primary.light' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ variant: 'body2', fontWeight: isActive ? 700 : 500 }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />

      {/* User info + sign out */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Avatar
            sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14, fontWeight: 700 }}
          >
            {user?.name?.charAt(0).toUpperCase() ?? 'M'}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              fontWeight={600}
              noWrap
              sx={{ maxWidth: 140 }}
            >
              {user?.name ?? 'Merchant'}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ maxWidth: 140, display: 'block' }}
            >
              {user?.email ?? ''}
            </Typography>
          </Box>
        </Box>
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          size="small"
          startIcon={<LogoutIcon />}
          onClick={onSignOut}
          sx={{ color: 'text.secondary', borderColor: 'divider' }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function Nav({ open, onClose, isMobile, user, onSignOut }: NavProps) {
  if (isMobile) {
    return (
      <Drawer
        open={open}
        onClose={onClose}
        PaperProps={{ sx: { width: NAV_WIDTH } }}
      >
        <NavContent user={user} onSignOut={onSignOut} />
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      PaperProps={{
        sx: {
          width: NAV_WIDTH,
          borderRight: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
        },
      }}
    >
      <NavContent user={user} onSignOut={onSignOut} />
    </Drawer>
  );
}
