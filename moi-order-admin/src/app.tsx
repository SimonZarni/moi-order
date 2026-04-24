import 'src/global.css';

import { useEffect } from 'react';

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
        <ThemeProvider>{children}</ThemeProvider>
      </NotificationsProvider>
    </AuthProvider>
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
