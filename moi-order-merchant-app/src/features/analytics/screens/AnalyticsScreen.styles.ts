import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

const card = {
  backgroundColor: colours.surface,
  borderRadius: radius.xl,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
  elevation: 3,
};

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colours.backgroundDark,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },

  // ── Dark hero header — breaks out of scrollContent padding ─────────────────
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl + spacing.md,
    backgroundColor: colours.backgroundDark,
    marginTop: -spacing.md,
    marginHorizontal: -spacing.md,
  },
  headerTitle: {
    fontSize: typography.display,
    fontWeight: '800',
    color: colours.textOnDark,
    letterSpacing: -0.8,
  },
  headerSub: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 4,
  },
  pendingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colours.warning + '22',
    borderWidth: 1,
    borderColor: colours.warning + '55',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    marginTop: 4,
  },
  pendingChipText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.warning,
  },

  // ── Cards ───────────────────────────────────────────────────────────────────
  card: {
    ...card,
    overflow: 'hidden',
  },
  cardHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  cardTitle: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnLight,
    letterSpacing: -0.2,
  },

  // ── Revenue rows ────────────────────────────────────────────────────────────
  periodRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
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
    color: colours.textMuted,
  },
  periodRevenue: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: colours.primary,
    letterSpacing: -0.4,
  },
  barTrack: {
    height: 6,
    backgroundColor: colours.divider,
    borderRadius: radius.full,
    overflow: 'hidden',
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

  // ── Orders summary ──────────────────────────────────────────────────────────
  summaryGrid: {
    flexDirection: 'row',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.xs / 2,
    borderRightWidth: 1,
    borderRightColor: colours.divider,
  },
  summaryItemLast: {
    borderRightWidth: 0,
  },
  summaryValue: {
    fontSize: typography.xxl,
    fontWeight: '800',
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
