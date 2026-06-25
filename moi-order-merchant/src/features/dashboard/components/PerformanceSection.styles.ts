import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  title: {
    fontSize: typography.sm,
    fontWeight: '800',
    color: colours.textOnLight,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  periodTabs: {
    flexDirection: 'row',
    gap: 4,
  },
  periodTab: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.divider,
    backgroundColor: colours.surface,
  },
  periodTabActive: {
    borderColor: colours.primary,
    backgroundColor: colours.primaryBg,
  },
  periodTabText: {
    fontSize: typography.xxs,
    fontWeight: '600',
    color: colours.textMuted,
  },
  periodTabTextActive: {
    color: colours.primaryDark,
    fontWeight: '700',
  },

  // ── Type tabs ─────────────────────────────────────────────────────────────
  typeTabs: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  typeTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colours.divider,
    backgroundColor: colours.surface,
  },
  typeTabActive: {
    borderColor: colours.primary,
    backgroundColor: colours.primaryBg,
  },
  typeTabText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.textMuted,
  },
  typeTabTextActive: {
    color: colours.primaryDark,
    fontWeight: '700',
  },

  // ── List card ──────────────────────────────────────────────────────────────
  listCard: {
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colours.divider,
    overflow: 'hidden',
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.sm,
    color: colours.textSubtle,
  },

  // ── Row ────────────────────────────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colours.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rankBadgeGold: {
    backgroundColor: '#F59E0B22',
  },
  rankText: {
    fontSize: 10,
    fontWeight: '800',
    color: colours.textMuted,
  },
  rankTextGold: {
    color: '#D97706',
  },
  rowContent: {
    flex: 1,
    gap: 4,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowName: {
    flex: 1,
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textOnLight,
    paddingRight: spacing.sm,
  },
  rowValue: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.primary,
    flexShrink: 0,
  },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  barTrack: {
    flex: 1,
    height: 3,
    backgroundColor: colours.divider,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: 3,
    borderRadius: radius.full,
  },
  rowSub: {
    fontSize: typography.xxs,
    color: colours.textSubtle,
    fontWeight: '500',
    flexShrink: 0,
  },
});
