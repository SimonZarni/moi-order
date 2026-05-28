import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  // ── Card container ────────────────────────────────────────────────────────
  card: {
    // flex:1 fills the gridItem wrapper so all cards in the same row share the
    // same height (driven by the tallest card). Width is still controlled by
    // the percentage-width gridItem in MenuScreen.
    flex: 1,
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colours.divider,
    overflow: 'hidden',
    marginHorizontal: 6,
    marginBottom: spacing.md,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  // ── Image — 16:9 cinematic crop looks modern for food cards ───────────────
  imageWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
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
    top: spacing.sm,
    right: spacing.sm,
    width: 10,
    height: 10,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colours.surface,
  },
  // SALE ribbon — top-left corner
  discountBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colours.error,
    borderRadius: radius.sm,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  discountText: {
    fontSize: 10,
    color: colours.white,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // ── Body ──────────────────────────────────────────────────────────────────
  // flex:1 + space-between: name/description stick to the top,
  // price row + footer stick to the bottom regardless of card height.
  body: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  // Groups name + description at the top of the flex body
  bodyTop: {
    gap: spacing.xs,
  },
  name: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnLight,
    lineHeight: 20,
  },
  description: {
    fontSize: typography.xs,
    color: colours.textMuted,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
    marginTop: 2,
  },
  price: {
    fontSize: typography.md,
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
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colours.divider,
  },
  // Status chip
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    flex: 1,
    marginRight: spacing.xs,
  },
  statusDotSmall: {
    width: 7,
    height: 7,
    borderRadius: radius.full,
  },
  statusLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    flexShrink: 1,
  },
  // Icon buttons — 32 × 32 for comfortable touch targets
  iconRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  iconBtn: {
    width: 32,
    height: 32,
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  actionBarText: {
    fontSize: typography.xs,
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
    gap: 5,
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
    fontSize: typography.xs,
    fontWeight: '700',
  },
  statusPickerClose: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
