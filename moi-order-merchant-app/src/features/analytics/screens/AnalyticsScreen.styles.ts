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
    gap: spacing.md,
  },
  header: {
    marginBottom: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.xxl,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  headerSub: {
    fontSize: typography.sm,
    color: colours.textMuted,
    marginTop: spacing.xs / 2,
  },
  card: {
    backgroundColor: colours.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
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
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.primary,
  },
  barTrack: {
    height: 8,
    backgroundColor: colours.backgroundLight,
    borderRadius: radius.full ?? 100,
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    backgroundColor: colours.primary,
    borderRadius: radius.full ?? 100,
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
    borderColor: colours.warning + '33',
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
  },
});
