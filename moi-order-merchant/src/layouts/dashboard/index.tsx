import { useState, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';

import { signOut } from 'src/api/auth';
import { useAuthStore } from 'src/store/authStore';
import { Nav, NAV_WIDTH } from './nav';

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch {
      // Silently ignore — token may already be invalid; clear local state regardless
    }
    clearAuth();
    navigate('/sign-in', { replace: true });
  }, [clearAuth, navigate]);

  const handleOpenNav = useCallback(() => setMobileNavOpen(true), []);
  const handleCloseNav = useCallback(() => setMobileNavOpen(false), []);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile top app-bar (hamburger menu) */}
      {isMobile && (
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            color: 'text.primary',
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <IconButton edge="start" onClick={handleOpenNav} aria-label="Open navigation">
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      <Nav
        open={mobileNavOpen}
        onClose={handleCloseNav}
        isMobile={isMobile}
        user={user}
        onSignOut={handleSignOut}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: 'grey.50',
          minHeight: '100vh',
          ml: isMobile ? 0 : `${NAV_WIDTH}px`,
          mt: isMobile ? '64px' : 0,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
