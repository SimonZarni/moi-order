import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colours.backgroundMid,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardProvisional: {
    borderWidth: 1,
    borderColor: colours.primary + '44',
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
    color: colours.textOnDark,
    lineHeight: 44,
  },
  provLabel: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.primary,
    letterSpacing: 0.8,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusPaid: {
    backgroundColor: colours.primary + '22',
  },
  statusPending: {
    backgroundColor: colours.backgroundDark,
  },
  statusText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  statusTextPaid: {
    color: colours.primary,
  },
  statusTextPending: {
    color: 'rgba(255,255,255,0.5)',
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
    color: colours.textOnDark,
    lineHeight: 44,
  },
  statLabel: {
    fontSize: typography.xxs,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 2,
    lineHeight: 18,
  },
  orderCount: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.55)',
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
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 16,
  },
});
