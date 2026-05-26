import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  // ── Card container ────────────────────────────────────────────────────────
  card: {
    flex: 1,
    backgroundColor: colours.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colours.divider,
    overflow: 'hidden',
    marginHorizontal: spacing.xs,
    marginBottom: spacing.md,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },

  // ── Image section ─────────────────────────────────────────────────────────
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colours.surfaceMuted,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.surfaceMuted,
  },
  // Coloured dot indicator — top-right corner of image
  statusDot: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 10,
    height: 10,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colours.surface,
  },
  // SALE ribbon — top-left corner of image
  discountBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colours.error,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    fontSize: typography.xxs,
    color: colours.white,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // ── Body section ──────────────────────────────────────────────────────────
  body: {
    padding: spacing.sm,
    gap: 4,
  },
  name: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnLight,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: typography.sm,
    fontWeight: '800',
    color: colours.textOnLight,
  },
  originalPrice: {
    fontSize: typography.xs,
    color: colours.textSubtle,
    textDecorationLine: 'line-through',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  // Status chip
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    flex: 1,
    marginRight: 4,
  },
  statusDotSmall: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
  },
  statusLabel: {
    fontSize: typography.xxs,
    fontWeight: '700',
    flexShrink: 1,
  },
  // Icon buttons
  iconRow: {
    flexDirection: 'row',
    gap: 4,
  },
  iconBtn: {
    width: 28,
    height: 28,
    borderRadius: radius.md,
    backgroundColor: colours.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBtnDanger: {
    backgroundColor: colours.errorBg,
  },

  // ── Action bar (inline confirm / status picker / guard) ────────────────────
  actionBar: {
    borderTopWidth: 1,
    borderTopColor: colours.divider,
    backgroundColor: colours.surfaceMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  actionBarText: {
    fontSize: typography.xxs,
    color: colours.textMuted,
    fontWeight: '600',
  },
  actionBarBtns: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionBtnDanger: {
    flex: 1,
    backgroundColor: colours.error,
    borderRadius: radius.full,
    paddingVertical: 6,
    alignItems: 'center',
    minHeight: 32,
    justifyContent: 'center',
  },
  actionBtnDangerText: {
    fontSize: typography.xs,
    color: colours.white,
    fontWeight: '700',
  },
  actionBtnPrimary: {
    flex: 1,
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    paddingVertical: 6,
    alignItems: 'center',
    minHeight: 32,
    justifyContent: 'center',
  },
  actionBtnPrimaryText: {
    fontSize: typography.xs,
    color: colours.backgroundDark,
    fontWeight: '700',
  },
  actionBtnCancel: {
    flex: 1,
    borderWidth: 1,
    borderColor: colours.divider,
    borderRadius: radius.full,
    paddingVertical: 6,
    alignItems: 'center',
    minHeight: 32,
    justifyContent: 'center',
    backgroundColor: colours.surface,
  },
  actionBtnCancelText: {
    fontSize: typography.xs,
    color: colours.textMuted,
    fontWeight: '600',
  },
  // Status picker row
  statusPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  statusPickerOpt: {
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    minHeight: 28,
    justifyContent: 'center',
  },
  statusPickerText: {
    fontSize: typography.xxs,
    fontWeight: '700',
  },
  statusPickerClose: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
