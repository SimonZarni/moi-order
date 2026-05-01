import { Platform, StyleSheet, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { CACHE_TTL } from './src/shared/constants/config';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: CACHE_TTL.DEFAULT } },
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
