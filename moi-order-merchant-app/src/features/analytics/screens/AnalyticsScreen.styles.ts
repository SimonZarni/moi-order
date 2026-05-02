import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  header: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.xxl,
    fontWeight: '700',
    color: colours.textOnLight,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: typography.sm,
    color: colours.textMuted,
    marginTop: 2,
  },
  card: {
    backgroundColor: colours.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colours.divider,
    overflow: 'hidden',
  },
  cardHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
    backgroundColor: colours.surfaceMuted,
  },
  cardTitle: {
    fontSize: typography.md,
    fontWeight: '600',
    color: colours.textOnLight,
  },
  periodRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  periodLastRow: {
    borderBottomWidth: 0,
  },
  periodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  periodLabel: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textOnLight,
  },
  periodRevenue: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.primary,
  },
  barTrack: {
    height: 6,
    backgroundColor: colours.divider,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: 6,
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    minWidth: 4,
  },
  periodMeta: {
    fontSize: typography.xs,
    color: colours.textMuted,
  },
  summaryGrid: {
    flexDirection: 'row',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.xs / 2,
    borderRightWidth: 1,
    borderRightColor: colours.divider,
  },
  summaryItemLast: {
    borderRightWidth: 0,
  },
  summaryValue: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colours.textOnLight,
    letterSpacing: -0.5,
  },
  summaryLabel: {
    fontSize: typography.xs,
    color: colours.textMuted,
    textAlign: 'center',
  },
  pendingCard: {
    backgroundColor: colours.warningBg,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colours.warning + '44',
  },
  pendingTextCol: {
    flex: 1,
  },
  pendingCount: {
    fontSize: typography.xxl,
    fontWeight: '700',
    color: colours.warning,
  },
  pendingLabel: {
    fontSize: typography.sm,
    color: colours.warning,
    fontWeight: '500',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.backgroundLight,
    gap: spacing.sm,
  },
});
