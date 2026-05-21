import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.backgroundDark },

  // ── Dark header ──────────────────────────────────────────────────────────────
  darkHeader: {
    backgroundColor: colours.backgroundDark,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  darkHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  darkHeaderTitle: {
    fontSize: typography.xxl,
    fontWeight: '900',
    color: colours.textOnDark,
    letterSpacing: -0.8,
  },
  darkHeaderSub: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dateArrow: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  dateTodayBtn: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: radius.full,
    backgroundColor: colours.primary + '25',
    borderWidth: 1,
    borderColor: colours.primary + '55',
  },
  dateTodayText: { fontSize: typography.xxs, fontWeight: '700', color: colours.primary },

  // Tab scroll
  statusTabsScroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    paddingBottom: spacing.sm,
  },
  statusTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  statusTabActive: {
    backgroundColor: colours.primary,
    borderColor: colours.primary,
  },
  statusTabText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
  },
  statusTabTextActive: { color: colours.backgroundDark, fontWeight: '800' },

  // ── List ─────────────────────────────────────────────────────────────────────
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  list: {
    backgroundColor: colours.backgroundLight,
    paddingBottom: spacing.xl,
  },
  sectionGroup: {
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: typography.xxs,
    fontWeight: '800',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    backgroundColor: colours.backgroundLight,
  },
  emptyState: {
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colours.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  emptyTitle: { fontSize: typography.md, fontWeight: '700', color: colours.textOnLight },
  empty: { fontSize: typography.sm, color: colours.textMuted, textAlign: 'center' },

  // kept for backwards compat
  filterBar: { backgroundColor: colours.backgroundDark },
  dateLabel: { fontSize: typography.sm, fontWeight: '700', color: colours.textOnDark, minWidth: 120, textAlign: 'center' },
  statusTabsRow: { flexDirection: 'row' },
});
