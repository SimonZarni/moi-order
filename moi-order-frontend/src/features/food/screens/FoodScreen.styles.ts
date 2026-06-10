import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import { TAB_BAR_CLEARANCE } from '@/shared/components/FloatingTabBar/FloatingTabBar.styles';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colours.backgroundDark,
  },
  hero: {
    backgroundColor: colours.backgroundDark,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl + spacing.xl,
    paddingHorizontal: spacing.md,
    overflow: 'hidden',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontSize: typography.xxl,
    fontWeight: '800',
    color: colours.textOnDark,
    letterSpacing: -0.5,
  },
  heroTitleMM: {
    fontSize: typography.lg,
    lineHeight: typography.xxl + 8,
    includeFontPadding: false,
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  heroActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colours.destructive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontSize: typography.xxs,
    fontWeight: '800',
    color: colours.white,
    lineHeight: 12,
  },
  // Search bar
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm,
    height: 40,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnDark,
    height: 40,
  },
  // Category pills
  categoryScroll: {
    marginBottom: spacing.xs,
  },
  categoryPillsContent: {
    gap: spacing.xs,
    flexDirection: 'row',
  },
  categoryPill: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  categoryPillActive: {
    backgroundColor: colours.primary,
    borderColor: colours.primary,
  },
  categoryPillText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
  },
  categoryPillTextActive: {
    color: colours.white,
  },
  // Body
  body: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -(spacing.xxl),
  },
  flatList: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: TAB_BAR_CLEARANCE + spacing.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl,
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: typography.md,
    color: colours.textMuted,
    fontWeight: '500',
  },
  errorText: {
    fontSize: typography.sm,
    color: colours.danger,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  sectionLabel: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
});
