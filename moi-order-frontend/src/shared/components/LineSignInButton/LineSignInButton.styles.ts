import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  button: {
    backgroundColor: colours.lineBg,
    borderRadius: radius.lg,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    fontSize: 18,
    fontWeight: '900',
    color: colours.white,
    lineHeight: 18,
  },
  label: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.white,
    letterSpacing: 0.2,
  },
});
