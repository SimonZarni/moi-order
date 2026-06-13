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
  expired:               { bg: '#fde8d8', text: '#c2410c' },
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
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: colours.textOnDark,
    flex: 1,
  },
  scroll: { flex: 1, backgroundColor: colours.backgroundLight },
  content: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xxl },
  card: {
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    overflow: 'hidden',
    paddingVertical: spacing.xs,
  },
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
  orderItems: {
    fontSize: typography.xs,
    color: colours.textMuted,
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
  stateBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  stateText: {
    fontSize: typography.sm,
    color: colours.textMuted,
    textAlign: 'center',
  },
});
