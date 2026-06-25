import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colours.surfaceMuted },
  flex:    { flex: 1 },
  listContent: { maxWidth: 920, alignSelf: 'center', width: '100%', paddingBottom: spacing.xl },

  // ── Page header ───────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
    backgroundColor: colours.surface,
  },
  headerLeft: { gap: 2 },
  eyebrow: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  pageTitle: {
    fontSize: typography.display,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.8,
  },
  markAllBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colours.primaryBg,
    borderWidth: 1,
    borderColor: colours.primary + '44',
  },
  markAllBtnDisabled: {
    opacity: 0.5,
  },
  markAllText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.primaryDark,
  },

  // ── Tab switcher ─────────────────────────────────────────────────────────
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
    backgroundColor: colours.surface,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colours.primary,
  },
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tabLabel: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textSubtle,
  },
  tabLabelActive: {
    color: colours.primary,
  },
  tabBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: radius.full,
    backgroundColor: colours.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colours.white,
    lineHeight: 14,
  },

  // ── Divider between list items ────────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: colours.divider,
    marginLeft: spacing.md + 8 + 36 + spacing.sm,  // align with text block
  },

  // ── Empty / error states ──────────────────────────────────────────────────
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: typography.sm,
    color: colours.textMuted,
    textAlign: 'center',
  },
});
