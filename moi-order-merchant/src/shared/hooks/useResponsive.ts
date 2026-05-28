import { Platform, useWindowDimensions } from 'react-native';

export interface ResponsiveInfo {
  isWeb: boolean;
  isMobile: boolean;
  isDesktop: boolean;
}

export function useResponsive(): ResponsiveInfo {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  return {
    isWeb,
    isMobile: !isWeb,
    isDesktop: isWeb && width >= 960,
  };
}
