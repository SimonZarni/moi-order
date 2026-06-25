import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colours.primaryBg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colours.primaryLight,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
    gap: 6,
    paddingRight: spacing.lg,
  },
  label: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  amount: {
    fontSize: 48,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -2,
    lineHeight: 56,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  sub: {
    fontSize: typography.sm,
    color: colours.textMuted,
    fontWeight: '500',
  },
  trendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colours.primary + '18',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  trendText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.primary,
  },
  trendTextDown: {
    color: colours.error,
  },

  // ── Bars ────────────────────────────────────────────────────────────────
  barsWrap: {
    alignItems: 'flex-end',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    height: 72,
  },
  barCol: {
    alignItems: 'center',
    gap: 4,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 22,
    borderRadius: radius.sm,
  },
  barToday: {
    backgroundColor: colours.primary,
  },
  barWeek: {
    backgroundColor: colours.primary + '66',
  },
  barMonth: {
    backgroundColor: colours.primary + '33',
  },
  barLabel: {
    fontSize: typography.xxs,
    color: colours.textMuted,
    fontWeight: '500',
  },
});
