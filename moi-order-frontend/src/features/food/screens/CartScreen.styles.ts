import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colours.backgroundDark },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colours.backgroundDark,
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: colours.textOnDark,
    flex: 1,
  },
  scroll: { flex: 1, backgroundColor: colours.backgroundLight },
  content: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xxl },
  sectionLabel: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  cartRestaurant: {
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
  },
  cartItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: typography.sm,
    color: colours.textOnLight,
    fontWeight: '500',
  },
  cartItemOptions: {
    fontSize: typography.xxs,
    color: colours.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  cartItemQty: { fontSize: typography.sm, color: colours.medium, marginRight: spacing.sm },
  cartItemPrice: { fontSize: typography.sm, fontWeight: '700', color: colours.textOnLight },
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
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: typography.md,
    color: colours.textMuted,
    fontWeight: '500',
  },
});
