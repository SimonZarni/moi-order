import { Platform } from 'react-native';

export interface ResponsiveInfo {
  isWeb: boolean;
  isMobile: boolean;
}

export function useResponsive(): ResponsiveInfo {
  return {
    isWeb: Platform.OS === 'web',
    isMobile: Platform.OS !== 'web',
  };
}
