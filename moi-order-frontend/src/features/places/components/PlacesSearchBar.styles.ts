import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  // Dark section — negative marginTop eats HeroHeader's paddingBottom (32),
  // leaving only spacing.sm (8) of gap between subtitle and search row.
  container: {
    backgroundColor: colours.backgroundDark,
    paddingHorizontal: spacing.xl + spacing.sm, // 40 — matches HeroHeader
    marginTop: -spacing.xl,                      // fully cancels HeroHeader paddingBottom (32)
    paddingTop: spacing.xs,                      // only 4px gap between subtitle and search bar
    paddingBottom: spacing.xl + spacing.sm,      // 40 — clears bodyGap's -32 overlap
  },

  // ── Search row (input + filter pill side-by-side) ─────────────────────────
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.inputBg,    // rgba(255,255,255,0.12)
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colours.inputBorder,    // colours.tertiary — matches back-btn text
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
    minHeight: 44,
  },
  searchIcon: {
    fontSize: 15,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnDark,
    padding: 0,
  },
  // Typed constant for placeholderTextColor prop — not a real style rule
  placeholder: {
    color: colours.medium,
  } as unknown as { color: string },
  clearBtn: {
    width: 20,
    height: 20,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearIcon: {
    fontSize: 10,
    color: colours.textOnDark,
    fontWeight: '700',
    lineHeight: 14,
  },

  // ── Filter pill ───────────────────────────────────────────────────────────
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    minHeight: 44,
  },
  filterPillActive: {
    backgroundColor: editorialPalette.gold,
    borderColor: editorialPalette.gold,
  },
  filterLabel: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 0.2,
    maxWidth: 72,
  },
  filterLabelActive: {
    color: colours.backgroundDark,
    fontWeight: '700',
  },
  filterChevron: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
  },
  filterChevronActive: {
    color: colours.backgroundDark,
  },

  // ── Category dropdown modal ───────────────────────────────────────────────
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.52)',
  },
  dropdownPanel: {
    backgroundColor: colours.backgroundLight,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl + spacing.lg,
    maxHeight: 420,
  },
  dropdownHandle: {
    width: 36,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: 'rgba(0,0,0,0.12)',
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  dropdownTitle: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  dropdownItemActive: {
    backgroundColor: 'rgba(82,121,111,0.07)', // colours.tertiary tint
  },
  dropdownItemLabel: {
    fontSize: typography.sm,
    fontWeight: '500',
    color: colours.textOnLight,
  },
  dropdownItemLabelActive: {
    color: colours.tertiary,
    fontWeight: '700',
  },
  checkmark: {
    fontSize: typography.sm,
    color: colours.tertiary,
    fontWeight: '700',
  },
});
