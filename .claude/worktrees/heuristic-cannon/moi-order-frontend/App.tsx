/**
 * Principle: SRP — entry point wires providers only; zero business logic.
 * Provider order (outermost → innermost):
 *   SafeAreaProvider → QueryClientProvider → NavigationContainer
 */
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { CACHE_TTL } from '@/shared/constants/config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: CACHE_TTL.USER_DATA,
    },
  },
});

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        {/* Navigator added when auth is built */}
        <NavigationContainer>{null}</NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
