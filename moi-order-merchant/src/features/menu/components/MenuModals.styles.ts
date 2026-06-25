import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  scrollView: {
    maxHeight: '90%',
  },
  card: {
    backgroundColor: colours.backgroundDark,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xl + spacing.md,
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colours.textOnDark,
    marginBottom: spacing.xs,
    lineHeight: 50,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colours.textOnDark,
    fontSize: typography.sm,
  },
  inputMultiline: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  inputFlex: {
    flex: 1,
  },
  inputFlex2: {
    flex: 2,
  },
  inputFlex1: {
    flex: 1,
  },
  inputML: {
    marginLeft: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cancelText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnDark,
  },
  confirmBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.full,
    backgroundColor: colours.primary,
  },
  confirmText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.backgroundDark,
  },
  deleteBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.full,
    backgroundColor: colours.error,
  },
  deleteBtnText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.surface,
  },
  disabled: {
    opacity: 0.4,
  },
  deleteBody: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 24,
  },
  // ── Price row ──────────────────────────────────────────────────────────────
  priceRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  priceCol: {
    flex: 1,
    gap: spacing.xs,
  },
  priceLabel: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.3,
  },
  priceHint: {
    fontSize: typography.xxs,
    color: colours.primary,
    fontWeight: '600',
  },
  discountBadge: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: colours.success + '20',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colours.success + '40',
    alignSelf: 'flex-start',
  },
  // ── Photo ──────────────────────────────────────────────────────────────────
  photoWrap: {
    position: 'relative',
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  photoImg: {
    width: '100%',
    height: 160,
    borderRadius: radius.md,
    backgroundColor: colours.surfaceMuted,
  },
  photoError: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colours.surfaceMuted,
  },
  photoErrorText: {
    fontSize: typography.xs,
    color: colours.textSubtle,
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colours.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  newBadgeText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.backgroundDark,
    letterSpacing: 0.5,
  },
  changePhotoBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.primary + '66',
  },
  changeBtnText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.primary,
  },
  photoPickerBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  photoPickerText: {
    color: colours.primary,
  },
  // ── Option groups ──────────────────────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: spacing.xs,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnDark,
  },
  sectionHint: {
    fontSize: typography.xxs,
    color: 'rgba(255,255,255,0.4)',
  },
  addGroupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.primary + '55',
    backgroundColor: colours.primary + '15',
  },
  addGroupBtnText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.primary,
  },
  optionGroupCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: spacing.sm,
    gap: spacing.xs,
  },
  optionGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  toggleLabel: {
    fontSize: typography.xxs,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
  },
  numInput: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    color: colours.textOnDark,
    fontSize: typography.sm,
    fontWeight: '700',
    width: 42,
    textAlign: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removePad: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  addOptionBtnText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.primary,
  },
});
