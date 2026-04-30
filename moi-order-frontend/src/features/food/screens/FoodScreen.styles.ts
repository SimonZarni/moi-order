import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
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
  },
  heroTitle: {
    fontSize: typography.xxl,
    fontWeight: '800',
    color: colours.textOnDark,
    letterSpacing: -0.5,
  },
  heroActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  body: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -(spacing.xxl),
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
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
