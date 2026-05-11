import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  rowTapArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  photo: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colours.backgroundLight,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textOnLight,
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: typography.xs,
    color: colours.textMuted,
    fontWeight: '600',
  },
  originalPrice: {
    fontSize: typography.xxs,
    color: colours.medium,
    textDecorationLine: 'line-through',
  },
  modifierCount: {
    fontSize: typography.xxs,
    color: colours.primary,
    fontWeight: '500',
    backgroundColor: colours.primary + '15',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: radius.sm,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  editButton: {
    padding: 8,
    minWidth: 36,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    padding: 8,
    minWidth: 36,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    minHeight: 44,
    justifyContent: 'center',
  },
  chevronButton: {
    padding: 8,
    minWidth: 32,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: typography.xxs,
    fontWeight: '700',
  },
  // Inline confirmation bar (delete + status picker) — replaces Alert.alert
  confirmBar: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    backgroundColor: colours.errorBg,
    borderTopWidth: 1,
    borderTopColor: colours.error + '33',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  confirmText: {
    flex: 1,
    fontSize: typography.xs,
    color: colours.error,
    fontWeight: '600',
  },
  confirmYes: {
    backgroundColor: colours.error,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.sm,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmYesText: {
    fontSize: typography.xs,
    color: colours.white,
    fontWeight: '700',
  },
  confirmNo: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmNoText: {
    fontSize: typography.xs,
    color: colours.textMuted,
    fontWeight: '600',
  },
  // Accordion
  accordion: {
    backgroundColor: colours.surfaceMuted,
    borderTopWidth: 1,
    borderTopColor: colours.divider,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  groupBlock: {
    gap: 4,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  groupName: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.textOnLight,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  groupMeta: {
    fontSize: typography.xxs,
    color: colours.textMuted,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: spacing.sm,
    paddingVertical: 2,
  },
  optionName: {
    fontSize: typography.xs,
    color: colours.textOnLight,
  },
  optionPrice: {
    fontSize: typography.xs,
    color: colours.primary,
    fontWeight: '600',
  },
});
