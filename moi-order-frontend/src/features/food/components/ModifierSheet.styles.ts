import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: colours.card,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    maxHeight: '88%',
    paddingBottom: spacing.xl,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colours.divider,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
    gap: spacing.sm,
  },
  itemName: {
    flex: 1,
    fontSize: typography.lg,
    fontWeight: '700',
    color: colours.textOnLight,
    lineHeight: 24,
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flexGrow: 0,
  },
  groupSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 4,
  },
  groupName: {
    flex: 1,
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  groupBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  groupBadgeRequired: {
    backgroundColor: colours.primary + '18',
  },
  groupBadgeOptional: {
    backgroundColor: colours.infoBg,
  },
  groupBadgeText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  groupBadgeTextRequired: {
    color: colours.primary,
  },
  groupBadgeTextOptional: {
    color: colours.textMuted,
  },
  groupHint: {
    fontSize: typography.xxs,
    color: colours.textMuted,
    marginBottom: spacing.xs,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 10,
    minHeight: 44,
  },
  optionIndicator: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colours.divider,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colours.card,
  },
  optionIndicatorSelected: {
    borderColor: colours.primary,
    backgroundColor: colours.primary,
  },
  optionName: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnLight,
    lineHeight: 20,
  },
  optionPrice: {
    fontSize: typography.sm,
    color: colours.primary,
    fontWeight: '600',
  },
  scrollBottom: {
    height: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colours.divider,
  },
  totalLabel: {
    fontSize: typography.sm,
    color: colours.textMuted,
    fontWeight: '500',
  },
  totalPrice: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
    flex: 1,
  },
  addBtn: {
    backgroundColor: colours.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDisabled: {
    opacity: 0.45,
  },
  addBtnText: {
    color: colours.white,
    fontSize: typography.sm,
    fontWeight: '700',
  },
});
