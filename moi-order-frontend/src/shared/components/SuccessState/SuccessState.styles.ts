import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    backgroundColor: colours.backgroundLight,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(45,213,91,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  icon: {
    fontSize: 40,
    color: colours.success,
  },
  title: {
    fontSize: typography.xxl,
    fontWeight: '900',
    color: colours.textOnLight,
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.md,
    color: colours.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    marginTop: spacing.xxl,
    backgroundColor: colours.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    minWidth: 180,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.white,
  },
});
