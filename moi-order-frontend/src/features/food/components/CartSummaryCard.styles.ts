import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.xs,
  },
  emptyText: {
    fontSize: typography.sm,
    color: colours.textMuted,
    fontWeight: '500',
  },
  restaurantName: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textMuted,
    marginBottom: spacing.xs,
  },
  card: {
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    overflow: 'hidden',
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  itemName: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnLight,
    fontWeight: '500',
  },
  itemQty:   { fontSize: typography.sm, color: colours.medium, marginRight: spacing.sm },
  itemPrice: { fontSize: typography.sm, fontWeight: '700', color: colours.textOnLight },
  subtotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  subtotalLabel: { fontSize: typography.md, fontWeight: '700', color: colours.textOnLight },
  subtotalValue: { fontSize: typography.md, fontWeight: '800', color: colours.primary },
  checkoutBtn: {
    backgroundColor: colours.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  checkoutBtnText: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.white,
  },
  clearBtn: {
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colours.divider,
  },
  clearBtnText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textMuted,
  },
});
