import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colours.surface,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  // Tappable info section — separate from the action button to avoid nested <button> on web
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
  },
  orderNumber: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  statusText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  customer: {
    fontSize: typography.sm,
    fontWeight: '600',
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
    marginTop: spacing.xs / 2,
  },
  total: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  date: {
    fontSize: typography.xxs,
    color: colours.medium,
  },

  // ── Action button ──────────────────────────────────────────────────────────
  // Mobile: full-width strip
  actionRow: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  // Desktop: right-aligned
  actionRowDesktop: {
    alignItems: 'flex-end',
  },
  actionButton: {
    backgroundColor: colours.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    minHeight: 40,
    justifyContent: 'center',
  },
  // Compact on desktop — shrinks to content width
  actionButtonDesktop: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xs + 2,
    minHeight: 34,
  },
  actionButtonText: {
    color: colours.white,
    fontSize: typography.sm,
    fontWeight: '600',
  },
});
