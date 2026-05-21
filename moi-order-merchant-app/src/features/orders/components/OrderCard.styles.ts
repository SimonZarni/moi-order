import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colours.surface,
  },
  cardContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  orderNumber: {
    fontSize: typography.md,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.3,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  statusText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  customer: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  meta: {
    fontSize: typography.xs,
    color: colours.textMuted,
  },
  items: {
    fontSize: typography.xs,
    color: colours.textMuted,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colours.divider,
  },
  total: {
    fontSize: typography.md,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.3,
  },
  date: {
    fontSize: typography.xxs,
    color: colours.textMuted,
  },

  // ── Action button ──────────────────────────────────────────────────────────
  actionRow: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.xs,
  },
  actionRowDesktop: {
    alignItems: 'flex-end',
  },
  actionButton: {
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    minHeight: 40,
    justifyContent: 'center',
  },
  actionButtonDesktop: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xs + 2,
    minHeight: 36,
  },
  actionButtonText: {
    color: colours.white,
    fontSize: typography.sm,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
