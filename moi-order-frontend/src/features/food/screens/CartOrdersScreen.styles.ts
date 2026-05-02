import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const ORDER_STATUS_COLOURS: Record<string, { bg: string; text: string }> = {
  order_placed:          { bg: '#fef3c7', text: '#f59e0b' },
  waiting_for_payment:   { bg: '#dbeafe', text: '#3b82f6' },
  payment_confirmed:     { bg: '#ede9fe', text: '#8b5cf6' },
  preparing_food:        { bg: '#ffedd5', text: '#f97316' },
  waiting_for_delivery:  { bg: '#cffafe', text: '#06b6d4' },
  delivery_on_the_way:   { bg: '#d1fae5', text: '#10b981' },
  delivered:             { bg: '#d1fae5', text: '#10b981' },
  completed:             { bg: '#f3f4f6', text: '#6b7280' },
  cancelled:             { bg: '#fee2e2', text: '#ef4444' },
};

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
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: colours.textOnDark,
    flex: 1,
  },
  scroll: { flex: 1, backgroundColor: colours.backgroundLight },
  content: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xxl },
  // Section labels
  sectionLabel: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  // Cart section
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
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  cartItemName: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnLight,
    fontWeight: '500',
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
  // Action buttons
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
  // Order history rows
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
    gap: spacing.sm,
  },
  orderMeta: { flex: 1, gap: 2 },
  orderNumber: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  orderRestaurant: {
    fontSize: typography.xs,
    color: colours.medium,
  },
  orderDate: {
    fontSize: typography.xxs,
    color: colours.textMuted,
  },
  orderRight: { alignItems: 'flex-end', gap: 4 },
  orderTotal: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  orderStatusBadge: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  orderStatusText: {
    fontSize: typography.xxs,
    fontWeight: '700',
  },
  // States
  stateBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  stateText: {
    fontSize: typography.sm,
    color: colours.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
