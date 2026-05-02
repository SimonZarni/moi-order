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
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colours.backgroundLight,
  },
  topBarTitle: {
    flex: 1,
    fontSize: typography.md,
    fontWeight: '600',
    color: colours.textOnLight,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colours.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colours.divider,
  },
  cardHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colours.surfaceMuted,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  cardTitle: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  cardBody: {
    padding: spacing.md,
    gap: spacing.xs + 2,
  },
  orderHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderNumber: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  statusText: {
    fontSize: typography.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  divider: {
    height: 1,
    backgroundColor: colours.divider,
    marginVertical: spacing.xs / 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  label: {
    fontSize: typography.sm,
    color: colours.textMuted,
    flexShrink: 0,
  },
  value: {
    fontSize: typography.sm,
    fontWeight: '500',
    color: colours.textOnLight,
    flex: 1,
    textAlign: 'right',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  itemNameCol: {
    flex: 1,
    gap: 2,
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
    fontWeight: '600',
    color: colours.textOnLight,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    marginTop: spacing.xs / 2,
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
    fontSize: typography.sm,
    fontWeight: '700',
    letterSpacing: 0.2,
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
  infoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colours.warningBg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colours.warning + '33',
  },
  infoNoteText: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.warning,
    fontWeight: '500',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.backgroundLight,
    gap: spacing.sm,
  },
  errorText: {
    fontSize: typography.sm,
    color: colours.error,
  },
});
