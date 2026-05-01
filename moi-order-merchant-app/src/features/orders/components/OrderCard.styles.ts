import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colours.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colours.textOnLight,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  orderNumber: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  statusText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  customer: {
    fontSize: typography.md,
    fontWeight: '600',
    color: colours.textOnLight,
    marginBottom: spacing.xs,
  },
  meta: {
    fontSize: typography.xs,
    color: colours.textMuted,
    marginBottom: spacing.xs,
  },
  items: {
    fontSize: typography.sm,
    color: colours.textMuted,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  total: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  date: {
    fontSize: typography.xxs,
    color: colours.medium,
  },
  actionButton: {
    backgroundColor: colours.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: colours.white,
    fontSize: typography.sm,
    fontWeight: '600',
  },
});
