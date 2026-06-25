import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colours.divider,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  cardTitle: {
    fontSize: typography.md,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.3,
  },
  cardSub: {
    fontSize: typography.xxs,
    color: colours.textSubtle,
    marginLeft: 2,
  },

  // ── Comparison table ────────────────────────────────────────────────────────
  tableCard: {
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colours.divider,
    marginBottom: spacing.md,
  },
  tableHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
    backgroundColor: colours.surfaceMuted,
  },
  tableTitle: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  tableRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  tableRowHead: {
    backgroundColor: colours.surfaceMuted,
  },
  cell: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnLight,
    fontWeight: '500',
  },
  cellLabel: {
    fontWeight: '700',
    color: colours.textMuted,
  },
  cellRight: {
    textAlign: 'right',
  },
  cellHead: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
