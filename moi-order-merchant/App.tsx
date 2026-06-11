import { Platform, StyleSheet, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { AppNavigator } from './src/navigation/AppNavigator';
import { CACHE_TTL } from './src/shared/constants/config';

// Required for expo-auth-session on web: when the OAuth popup redirects back
// to our app, this detects the auth params and sends them to the parent window.
WebBrowser.maybeCompleteAuthSession();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_TTL.DEFAULT,
      // Don't refetch when user switches tabs/windows — reduces unnecessary
      // network calls and eliminates the "flash of loading" on tab switch.
      refetchOnWindowFocus: false,
      // Don't refetch when the app comes back from background on mobile.
      refetchOnReconnect: false,
      // React Query's default retry (3) means a slow server costs 3× the
      // latency. Keep fail-fast at 1 globally; individual queries can override.
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        {/* On web, flex:1 needs an explicit height anchor at the root */}
        <View style={Platform.OS === 'web' ? styles.webRoot : styles.nativeRoot}>
          <AppNavigator />
        </View>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  nativeRoot: { flex: 1 },
  webRoot: { flex: 1, height: '100%' as unknown as number },
});
