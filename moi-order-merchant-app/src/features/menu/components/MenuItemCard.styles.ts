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
    // Horizontal margin creates the gap between columns; grid padding handles edges.
    marginHorizontal: 4,
    marginBottom: spacing.sm,
    // Shadow — iOS / web
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  // ── Image section — 4:3 ratio keeps cards compact on wide desktop screens ─
  imageWrap: {
    width: '100%',
    aspectRatio: 4 / 3,   // was 1:1 (square). 4:3 cuts image height by 25 %.
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
  // Coloured status dot — top-right corner
  statusDot: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 8,
    height: 8,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colours.surface,
  },
  // SALE ribbon — top-left corner
  discountBadge: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    backgroundColor: colours.error,
    borderRadius: radius.sm,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  discountText: {
    fontSize: 9,
    color: colours.white,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  // ── Body section — compact to match smaller cards ─────────────────────────
  body: {
    padding: spacing.xs + 2,   // tighter than spacing.sm to keep cards short
    gap: 2,
  },
  name: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.textOnLight,
    lineHeight: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: typography.xs,
    fontWeight: '800',
    color: colours.textOnLight,
  },
  originalPrice: {
    fontSize: 10,
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
    gap: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: radius.full,
    borderWidth: 1,
    flex: 1,
    marginRight: 3,
  },
  statusDotSmall: {
    width: 5,
    height: 5,
    borderRadius: radius.full,
  },
  statusLabel: {
    fontSize: 9,
    fontWeight: '700',
    flexShrink: 1,
  },
  // Icon buttons — smaller than before (22 × 22 instead of 28 × 28)
  iconRow: {
    flexDirection: 'row',
    gap: 3,
  },
  iconBtn: {
    width: 22,
    height: 22,
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
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  actionBarText: {
    fontSize: 9,
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
    paddingVertical: 4,
    alignItems: 'center',
    minHeight: 26,
    justifyContent: 'center',
  },
  actionBtnDangerText: {
    fontSize: 10,
    color: colours.white,
    fontWeight: '700',
  },
  actionBtnPrimary: {
    flex: 1,
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    paddingVertical: 4,
    alignItems: 'center',
    minHeight: 26,
    justifyContent: 'center',
  },
  actionBtnPrimaryText: {
    fontSize: 10,
    color: colours.backgroundDark,
    fontWeight: '700',
  },
  actionBtnCancel: {
    flex: 1,
    borderWidth: 1,
    borderColor: colours.divider,
    borderRadius: radius.full,
    paddingVertical: 4,
    alignItems: 'center',
    minHeight: 26,
    justifyContent: 'center',
    backgroundColor: colours.surface,
  },
  actionBtnCancelText: {
    fontSize: 10,
    color: colours.textMuted,
    fontWeight: '600',
  },
  // Status picker row
  statusPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  statusPickerOpt: {
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 3,
    minHeight: 24,
    justifyContent: 'center',
  },
  statusPickerText: {
    fontSize: 9,
    fontWeight: '700',
  },
  statusPickerClose: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
