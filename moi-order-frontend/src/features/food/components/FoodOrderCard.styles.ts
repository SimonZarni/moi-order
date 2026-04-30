import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    ...shadows.light,
  },
  body: {
    padding: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  restaurantName: {
    flex: 1,
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  statusText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  itemsSummary: {
    fontSize: typography.sm,
    color: colours.medium,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colours.divider,
  },
  date: {
    fontSize: typography.xs,
    color: colours.textMuted,
  },
  total: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnLight,
  },
});
