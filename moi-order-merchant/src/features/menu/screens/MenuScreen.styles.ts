import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.surfaceMuted },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colours.surfaceMuted },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colours.surface,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  pageTitle: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.4,
    lineHeight: 60,
  },
  addCategoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: colours.primary,
  },
  addCategoryBtnText: {
    color: colours.backgroundDark,
    fontSize: typography.xs,
    fontWeight: '700',
  },

  // ── Two-column body ────────────────────────────────────────────────────────
  body: {
    flex: 1,
    flexDirection: 'column',
  },
  bodyDesktop: {
    flexDirection: 'row',
  },

  // ── Right content pane ────────────────────────────────────────────────────
  contentPane: {
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
  },

  // ── Search bar ─────────────────────────────────────────────────────────────
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.surface,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colours.divider,
    paddingHorizontal: spacing.md,
    height: 38,
    gap: spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnLight,
    paddingVertical: 0,
  },

  // ── Warning banner ────────────────────────────────────────────────────────
  warnBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colours.warningBg,
    borderBottomWidth: 1,
    borderBottomColor: colours.warning + '44',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    gap: spacing.xs,
  },
  warnText: {
    flex: 1,
    fontSize: typography.xs,
    color: colours.warning,
    lineHeight: 16,
    fontWeight: '600',
  },

  // ── Scroll & grid ─────────────────────────────────────────────────────────
  scroll: { flex: 1 },
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    padding: spacing.sm,
    paddingBottom: spacing.xxl + spacing.xl,
  },
  gridCell: { padding: 6 },
  listWrap: {
    flexDirection: 'column',
    width: '100%',
    paddingBottom: spacing.xxl + spacing.xl,
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyState: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.xxl + spacing.xl,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
    textAlign: 'center',
    lineHeight: 44,
  },
  emptySubtitle: {
    fontSize: typography.sm,
    color: colours.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },

  // ── FAB ────────────────────────────────────────────────────────────────────
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    shadowColor: colours.primaryDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    fontSize: typography.xs,
    fontWeight: '800',
    color: colours.backgroundDark,
  },
});
