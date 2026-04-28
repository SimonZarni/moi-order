import { StyleSheet } from 'react-native';

import { radius } from '@/shared/theme/radius';

export const styles = StyleSheet.create({
  wrapper: {
    height: 52,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  wrapperDisabled: {
    opacity: 0.6,
  },
  button: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
});
