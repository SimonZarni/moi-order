import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colours.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colours.divider,
  },
  cardProvisional: {
    borderColor: colours.primary + '55',
    backgroundColor: colours.primaryBg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  date: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textOnLight,
    lineHeight: 22,
  },
  provLabel: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.primary,
    letterSpacing: 0.8,
    lineHeight: 16,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusPaid: {
    backgroundColor: colours.primaryBg,
  },
  statusPending: {
    backgroundColor: colours.surfaceMuted,
  },
  statusText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  statusTextPaid: {
    color: colours.primaryDark,
  },
  statusTextPending: {
    color: colours.textSubtle,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  stat: {
    flex: 1,
  },
  statValue: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
    lineHeight: 24,
  },
  statLabel: {
    fontSize: typography.xxs,
    color: colours.textSubtle,
    marginTop: 2,
    lineHeight: 16,
  },
  orderCount: {
    fontSize: typography.xs,
    color: colours.textSubtle,
    marginTop: spacing.xs,
  },
  liveDot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colours.primary,
  },
  liveText: {
    fontSize: typography.xxs,
    color: colours.textSubtle,
    lineHeight: 16,
  },
});
