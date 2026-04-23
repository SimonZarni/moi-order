import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  button: {
    backgroundColor: colours.googleBg,
    borderRadius: radius.lg,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colours.divider,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  gLogo: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: '#4285F4',
    lineHeight: 22,
  },
  label: {
    fontSize: typography.md,
    fontWeight: '600',
    color: colours.textOnLight,
    letterSpacing: 0.2,
  },
});
