import 'src/global.css';

import { useEffect, useState } from 'react';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { usePathname } from 'src/routes/hooks';

import { AuthProvider } from 'src/context/auth-context';
import { ThemeProvider } from 'src/theme/theme-provider';
import { NotificationsProvider } from 'src/context/notifications-context';

// ----------------------------------------------------------------------

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  useScrollToTop();

  return (
    <AuthProvider>
      <NotificationsProvider>
        <ThemeProvider>
          {children}
          <ForbiddenSnackbar />
        </ThemeProvider>
      </NotificationsProvider>
    </AuthProvider>
  );
}

// ----------------------------------------------------------------------

function ForbiddenSnackbar() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ message: string }>).detail;
      setMessage(detail.message);
      setOpen(true);
    };
    window.addEventListener('api:forbidden', handler);
    return () => window.removeEventListener('api:forbidden', handler);
  }, []);

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={() => setOpen(false)}
        severity="error"
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
