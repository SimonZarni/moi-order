import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.07,
  shadowRadius: 10,
  elevation: 3,
};

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.backgroundDark },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xl },

  // ── Hero header ─────────────────────────────────────────────────────────────
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: colours.backgroundDark,
  },
  pageTitleBlock: { gap: 2 },
  pageGreeting: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  pageTitle: {
    fontSize: typography.hero,
    fontWeight: '900',
    color: colours.textOnDark,
    letterSpacing: -1.2,
    lineHeight: 40,
  },
  pageDate: { fontSize: typography.xs, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  pendingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colours.warning + '20',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colours.warning + '55',
    marginTop: 4,
  },
  pendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colours.warning,
  },
  pendingPillText: { fontSize: typography.xs, fontWeight: '700', color: colours.warning },

  // ── KPI grid (overlaps hero) ─────────────────────────────────────────────────
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: -spacing.lg,
    paddingHorizontal: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: 148,
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.xs,
    ...shadow,
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.xxl,
    fontWeight: '900',
    color: colours.textOnLight,
    letterSpacing: -0.8,
    lineHeight: 28,
  },
  statLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  statSub: { fontSize: typography.xxs, color: colours.textMuted },

  // ── Section card ─────────────────────────────────────────────────────────────
  sectionCard: {
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    overflow: 'hidden',
    ...shadow,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionAccent: {
    width: 3,
    height: 18,
    borderRadius: radius.full,
    backgroundColor: colours.primary,
  },
  sectionTitle: {
    fontSize: typography.md,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.3,
  },
  pendingBadge: {
    backgroundColor: colours.primaryBg,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colours.primary + '40',
  },
  pendingBadgeText: { fontSize: typography.xxs, color: colours.primary, fontWeight: '700' },
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
  emptyText: { fontSize: typography.sm, color: colours.textMuted },

  // kept for backwards compat
  pageTitleLegacy: { fontSize: typography.display, fontWeight: '800', color: colours.textOnDark },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colours.backgroundLight },
  loadingText: { fontSize: typography.sm, color: colours.textMuted },
});
