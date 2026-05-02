import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colours.surface,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
    gap: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
    borderRadius: radius.sm,
  },
  topBarTitle: {
    flex: 1,
    fontSize: typography.lg,
    fontWeight: '600',
    color: colours.textOnLight,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colours.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs / 2,
  },
  orderHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderNumber: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2 + 1,
    borderRadius: radius.full ?? 100,
  },
  statusText: {
    fontSize: typography.xs,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colours.divider,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: typography.sm,
    color: colours.textMuted,
  },
  value: {
    fontSize: typography.sm,
    fontWeight: '500',
    color: colours.textOnLight,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.xs / 2,
  },
  itemNameCol: {
    flex: 1,
    gap: spacing.xs / 2,
  },
  itemName: {
    fontSize: typography.sm,
    fontWeight: '500',
    color: colours.textOnLight,
  },
  itemQty: {
    fontSize: typography.xs,
    color: colours.textMuted,
  },
  itemNotes: {
    fontSize: typography.xs,
    color: colours.textMuted,
    fontStyle: 'italic',
  },
  itemPrice: {
    fontSize: typography.sm,
    fontWeight: '500',
    color: colours.textOnLight,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
  },
  totalLabel: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  totalValue: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.primary,
  },
  actionButton: {
    backgroundColor: colours.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    color: colours.white,
    fontSize: typography.md,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: colours.errorBg,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colours.error + '33',
  },
  cancelButtonText: {
    color: colours.error,
    fontSize: typography.sm,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.backgroundLight,
  },
  errorText: {
    fontSize: typography.sm,
    color: colours.error,
    marginTop: spacing.sm,
  },
});
