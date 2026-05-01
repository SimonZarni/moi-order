import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colours.card,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    maxHeight: '92%',
  },
  dragBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colours.divider,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  // Header row inside modal
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  modalTitle: {
    flex: 1,
    fontSize: typography.md,
    fontWeight: '800',
    color: colours.textOnLight,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colours.infoBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Invoice document
  scroll: { flex: 1 },
  invoice: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  // Header
  invoiceTitle: {
    fontSize: typography.xxl,
    fontWeight: '900',
    color: colours.primary,
    letterSpacing: 2,
    textAlign: 'center',
  },
  invoiceSubtitle: {
    fontSize: typography.xs,
    color: colours.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colours.divider,
    marginVertical: spacing.xs,
  },
  // Info rows
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  infoLabel: {
    fontSize: typography.xs,
    color: colours.textMuted,
    fontWeight: '600',
    flexShrink: 0,
  },
  infoValue: {
    fontSize: typography.xs,
    color: colours.textOnLight,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
  // Section headers
  sectionHeader: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: spacing.xs,
  },
  // Line items table
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
    gap: spacing.xs,
  },
  tableHeaderText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  colName:  { flex: 1 },
  colQty:   { width: 28, textAlign: 'center' },
  colPrice: { width: 60, textAlign: 'right' },
  colTotal: { width: 64, textAlign: 'right' },
  itemRow: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
    gap: spacing.xs,
    alignItems: 'center',
  },
  itemName: {
    flex: 1,
    fontSize: typography.xs,
    color: colours.textOnLight,
  },
  itemQty: {
    width: 28,
    textAlign: 'center',
    fontSize: typography.xs,
    color: colours.medium,
  },
  itemPrice: {
    width: 60,
    textAlign: 'right',
    fontSize: typography.xs,
    color: colours.medium,
  },
  itemTotal: {
    width: 64,
    textAlign: 'right',
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.textOnLight,
  },
  // Totals
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  totalLabel: {
    fontSize: typography.sm,
    color: colours.textMuted,
    fontWeight: '500',
  },
  totalValue: {
    fontSize: typography.sm,
    color: colours.textOnLight,
    fontWeight: '600',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderTopWidth: 2,
    borderTopColor: colours.primary,
    marginTop: spacing.xs,
  },
  grandTotalLabel: {
    fontSize: typography.md,
    fontWeight: '800',
    color: colours.textOnLight,
  },
  grandTotalValue: {
    fontSize: typography.md,
    fontWeight: '900',
    color: colours.primary,
  },
  // Status badge
  paidBadge: {
    alignSelf: 'center',
    backgroundColor: '#dcfce7',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: spacing.sm,
  },
  paidBadgeText: {
    fontSize: typography.sm,
    fontWeight: '800',
    color: '#16a34a',
    letterSpacing: 2,
  },
  // Footer
  footer: {
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colours.divider,
    gap: 4,
    paddingBottom: spacing.xxl,
  },
  footerLogo: {
    fontSize: typography.lg,
    fontWeight: '900',
    color: colours.primary,
    letterSpacing: 1,
  },
  footerSub: {
    fontSize: typography.xxs,
    color: colours.textMuted,
  },
});
