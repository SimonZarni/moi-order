import { StyleSheet } from 'react-native';

import { radius } from '@/shared/theme/radius';

export const styles = StyleSheet.create({
  btn: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
