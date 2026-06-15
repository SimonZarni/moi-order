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
  // Items
  card: {
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    overflow: 'hidden',
    paddingVertical: spacing.xs,
  },
  chatPad: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
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
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  totalLabel: { fontSize: typography.md, fontWeight: '700', color: colours.textOnLight },
  totalValue: { fontSize: typography.md, fontWeight: '800', color: colours.primary },
  // Notes
  notesCard: {
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    padding: spacing.md,
  },
  notesText: { fontSize: typography.sm, color: colours.medium, lineHeight: 20 },
  // State
  stateBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, backgroundColor: colours.backgroundLight },
  cancelledCard: {
    backgroundColor: '#fee2e2',
    borderRadius: radius.xl,
    padding: spacing.md,
  },
  cancelledText: { fontSize: typography.sm, color: '#b91c1c', fontWeight: '600', textAlign: 'center' },
  expiredCard: {
    backgroundColor: '#fde8d8',
    borderRadius: radius.xl,
    padding: spacing.md,
  },
  expiredText: { fontSize: typography.sm, color: '#c2410c', fontWeight: '600', textAlign: 'center' },
  // Payment timeout warning banner
  timeoutBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    backgroundColor: '#fffbeb',
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  timeoutText: {
    flex: 1,
    fontSize: typography.sm,
    color: '#92400e',
    lineHeight: 20,
  },
  // Order Again button
  orderAgainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colours.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  orderAgainBtnText: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.white,
  },
  // Preparation time card (shown during PreparingFood)
  prepTimeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colours.primary + '33',
  },
  prepTimeTextCol: {
    flex: 1,
    gap: 2,
  },
  prepTimeMinutes: {
    fontSize: typography.md,
    fontWeight: '800',
    color: colours.primary,
  },
  prepTimeSub: {
    fontSize: typography.xs,
    color: colours.medium,
  },

  // Cancel order
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colours.card,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
    borderWidth: 1.5,
    borderColor: colours.danger,
  },
  cancelBtnText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.danger,
  },
  // Invoice
  invoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
    borderWidth: 1.5,
    borderColor: colours.primary,
  },
  invoiceBtnText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.primary,
  },
  invoiceIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Complete section
  completeSection: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  autoCompleteNotice: {
    fontSize: typography.xxs,
    color: colours.textMuted,
    textAlign: 'center',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    alignSelf: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  callBtnText: {
    fontSize: typography.xs,
    color: colours.primary,
    fontWeight: '600',
  },
  // Chat button
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colours.primary,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  chatBtnText: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.white,
  },
  // Browse more restaurants button
  browseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
    borderWidth: 1.5,
    borderColor: colours.divider,
  },
  browseBtnText: {
    fontSize: typography.md,
    fontWeight: '600',
    color: colours.textMuted,
  },
  // Confirmation modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: spacing.md,
  },
  modalCard: {
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  modalTitle: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: colours.textOnLight,
    textAlign: 'center',
  },
  modalSub: {
    fontSize: typography.sm,
    color: colours.textMuted,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  modalCancelBtn: {
    flex: 1,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colours.divider,
  },
  modalCancelText: {
    fontSize: typography.md,
    fontWeight: '600',
    color: colours.textMuted,
  },
  modalDoneBtn: {
    flex: 1,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    backgroundColor: '#16a34a',
  },
  modalDoneText: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.white,
  },
});
