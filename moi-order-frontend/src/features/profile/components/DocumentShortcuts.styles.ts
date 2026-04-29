import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    ...shadows.light,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnLight,
    lineHeight: 18,
  },
  sublabel: {
    fontSize: typography.xxs,
    color: colours.textMuted,
    textAlign: 'center',
    lineHeight: 14,
    marginTop: 1,
  },
});
