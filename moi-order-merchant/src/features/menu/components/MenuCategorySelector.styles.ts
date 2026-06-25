import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  // ── Desktop sidebar ────────────────────────────────────────────────────────
  sidebar: {
    width: 220,
    backgroundColor: colours.surface,
    borderRightWidth: 1,
    borderRightColor: colours.divider,
    flexShrink: 0,
    paddingTop: spacing.sm,
  },
  sidebarTitle: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  sidebarScroll: {
    flex: 1,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs + 3,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    gap: spacing.xs,
    position: 'relative',
  },
  sidebarItemActive: {
    backgroundColor: colours.primaryBg,
  },
  sidebarAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colours.primary,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  sidebarItemLabel: {
    flex: 1,
    fontSize: typography.sm,
    fontWeight: '500',
    color: colours.textMuted,
  },
  sidebarItemLabelActive: {
    color: colours.primaryDark,
    fontWeight: '700',
  },
  systemBadge: {
    backgroundColor: colours.surfaceMuted,
    borderRadius: radius.full,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderWidth: 1,
    borderColor: colours.divider,
  },
  systemBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colours.textSubtle,
    letterSpacing: 0.5,
  },
  sidebarCount: {
    minWidth: 20,
    height: 20,
    borderRadius: radius.full,
    backgroundColor: colours.surfaceMuted,
    borderWidth: 1,
    borderColor: colours.divider,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  sidebarCountActive: {
    backgroundColor: colours.primary,
    borderColor: colours.primary,
  },
  sidebarCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: colours.textMuted,
  },
  sidebarCountTextActive: {
    color: colours.backgroundDark,
  },
  sidebarActions: {
    flexDirection: 'row',
    gap: 3,
    marginLeft: 2,
  },
  sidebarActionBtn: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    backgroundColor: colours.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarFooter: {
    padding: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colours.divider,
  },
  addCatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 7,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.primaryLight,
    backgroundColor: colours.primaryBg,
  },
  addCatBtnText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.primaryDark,
  },

  // ── Mobile horizontal tabs ─────────────────────────────────────────────────
  tabsOuter: {
    height: 44,
    backgroundColor: colours.surface,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  tabsScroll: {
    flex: 1,
  },
  tabsContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    alignItems: 'center',
    height: 44,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colours.divider,
    backgroundColor: colours.surface,
    alignSelf: 'center',
  },
  tabActive: {
    borderColor: colours.primary,
    backgroundColor: colours.primaryBg,
  },
  tabLabelArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tabText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.textMuted,
  },
  tabTextActive: {
    color: colours.primaryDark,
    fontWeight: '700',
  },
  tabCount: {
    backgroundColor: colours.surfaceMuted,
    borderRadius: radius.full,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  tabCountActive: { backgroundColor: colours.primary },
  tabCountText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textMuted,
  },
  tabCountTextActive: { color: colours.backgroundDark },
  tabEditBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.full,
    backgroundColor: colours.primaryBg,
    borderWidth: 1,
    borderColor: colours.primary + '55',
  },
  tabDeleteBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.full,
    backgroundColor: colours.errorBg,
    borderWidth: 1,
    borderColor: colours.error + '55',
  },
});
