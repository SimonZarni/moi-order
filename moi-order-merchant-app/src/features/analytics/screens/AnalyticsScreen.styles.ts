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

  // ── Page header row (title + pending chip inline) ──────────────────────────
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
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
    fontSize: typography.xs,
    color: colours.textMuted,
    marginTop: 2,
  },
  // Compact inline chip — replaces the full-width orange block
  pendingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colours.warningBg,
    borderWidth: 1,
    borderColor: colours.warning + '40',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    marginTop: 4,
  },
  pendingChipText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.warning,
  },

  // ── Cards ──────────────────────────────────────────────────────────────────
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
  },
  cardTitle: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textOnLight,
  },

  // ── Revenue rows ───────────────────────────────────────────────────────────
  periodRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    gap: spacing.xs + 2,
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
  // Thicker bar — 8px instead of 6px, clearly readable
  barTrack: {
    height: 8,
    backgroundColor: colours.backgroundLight,
    borderRadius: radius.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colours.divider,
  },
  barFill: {
    height: '100%',
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    minWidth: 4,
  },
  periodMeta: {
    fontSize: typography.xs,
    color: colours.textMuted,
  },

  // ── Orders summary ─────────────────────────────────────────────────────────
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
    fontSize: typography.xxl,
    fontWeight: '700',
    color: colours.textOnLight,
    letterSpacing: -0.5,
  },
  summaryLabel: {
    fontSize: typography.xs,
    color: colours.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.backgroundLight,
    gap: spacing.sm,
  },
});
