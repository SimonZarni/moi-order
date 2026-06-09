import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import { radius } from '@/shared/theme/radius';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  spinner: {
    color: colours.primary,
  },
  title: {
    color: colours.textOnLight,
    fontSize: typography.xl,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  subtitle: {
    color: colours.textMuted,
    fontSize: typography.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  bold: {
    color: colours.textOnLight,
    fontWeight: '600',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colours.infoBg,
    borderRadius: radius.full,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colours.tertiary,
  },
  pillText: {
    color: colours.tertiary,
    fontSize: typography.sm,
  },
});
