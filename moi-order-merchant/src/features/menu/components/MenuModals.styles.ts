import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  // ── Overlay / backdrop ─────────────────────────────────────────────────────
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },

  // ── Simple modal card (add category, rename, delete) ───────────────────────
  card: {
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
    width: '100%',
    maxWidth: 420,
  },

  // ── Scrollable add-item dialog ─────────────────────────────────────────────
  scrollWrap: {
    width: '100%',
    maxWidth: 560,
    maxHeight: '85%',
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  scrollCardContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl + spacing.md,
    gap: spacing.sm,
  },

  // ── Typography ─────────────────────────────────────────────────────────────
  title: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colours.textOnLight,
    marginBottom: spacing.xs,
  },
  deleteBody: {
    fontSize: typography.sm,
    color: colours.textMuted,
    lineHeight: 24,
  },

  // ── Inputs ─────────────────────────────────────────────────────────────────
  input: {
    backgroundColor: colours.surfaceMuted,
    borderWidth: 1,
    borderColor: colours.divider,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colours.textOnLight,
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

  // ── Actions row ────────────────────────────────────────────────────────────
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
    borderColor: colours.divider,
  },
  cancelText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textMuted,
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
    color: colours.surface,
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
    color: colours.textMuted,
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
    color: colours.surface,
    letterSpacing: 0.5,
  },
  changePhotoBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    backgroundColor: colours.divider,
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
    color: colours.textOnLight,
  },
  sectionHint: {
    fontSize: typography.xxs,
    color: colours.textSubtle,
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
    backgroundColor: colours.primaryBg,
  },
  addGroupBtnText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.primary,
  },
  optionGroupCard: {
    backgroundColor: colours.surfaceMuted,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colours.divider,
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
    color: colours.textMuted,
  },
  numInput: {
    backgroundColor: colours.surface,
    borderWidth: 1,
    borderColor: colours.divider,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    color: colours.textOnLight,
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

  // ── System category chips ──────────────────────────────────────────────────
  systemCatSection: {
    borderTopWidth: 1,
    borderTopColor: colours.divider,
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  systemCatLabel: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  systemCatRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  systemCatChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.divider,
    backgroundColor: colours.surfaceMuted,
    minHeight: 36,
  },
  systemCatChipSelected: {
    borderColor: colours.primary,
    backgroundColor: colours.primary + '18',
  },
  systemCatChipText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.textMuted,
  },
  systemCatChipTextSelected: {
    color: colours.primary,
    fontWeight: '700',
  },
});
