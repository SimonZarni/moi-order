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
  shadowOpacity: 0.07,
  shadowRadius: 12,
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
  pageHeader: {
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
  pageTitleBlock: {
    gap: 4,
  },
  pageTitle: {
    fontSize: typography.display,
    fontWeight: '800',
    color: colours.textOnDark,
    letterSpacing: -0.8,
  },
  pageDate: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '500',
  },
  pendingPill: {
    backgroundColor: colours.warning + '22',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colours.warning + '55',
    marginTop: 4,
  },
  pendingPillText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.warning,
  },

  // ── KPI stat grid ───────────────────────────────────────────────────────────
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: -spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: 148,
    ...card,
    padding: spacing.md,
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  statIconBg: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colours.primaryGlow,
  },
  statLabel: {
    fontSize: typography.xxs,
    color: colours.textMuted,
    fontWeight: '600',
    flex: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  statValue: {
    fontSize: typography.xxl,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.5,
  },
  statSub: {
    fontSize: typography.xs,
    color: colours.textMuted,
    marginTop: 2,
  },

  // ── Section card ────────────────────────────────────────────────────────────
  sectionCard: {
    ...card,
    overflow: 'hidden',
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
  sectionTitle: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
    letterSpacing: -0.2,
  },
  pendingBadge: {
    backgroundColor: colours.warning + '18',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colours.warning + '40',
  },
  pendingBadgeText: {
    fontSize: typography.xxs,
    color: colours.warning,
    fontWeight: '700',
  },
  emptyState: {
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: typography.sm,
    color: colours.textMuted,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.backgroundLight,
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: typography.sm,
    color: colours.textMuted,
  },
});
