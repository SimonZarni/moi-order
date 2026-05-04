import { Dimensions, StyleSheet } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

import { colours } from '@/shared/theme/colours';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import { TAB_BAR_CLEARANCE } from '@/shared/components/FloatingTabBar/FloatingTabBar.styles';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colours.backgroundDark,
  },

  // ── Hero title ────────────────────────────────────────────────────────────
  heroTitleAccent: {
    fontSize: 26,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 38,
  },
  heroTitleMain: {
    fontSize: 26,
    fontWeight: '900',
    color: colours.textOnDark,
    letterSpacing: -0.8,
    lineHeight: 38,
  },

  // ── Search + category row ─────────────────────────────────────────────────
  // marginTop: -spacing.xl cancels HeroHeader's paddingBottom (32)
  // paddingBottom >= spacing.xl (32) so bodyGap's marginTop:-32 doesn't clip content
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colours.backgroundDark,
    paddingHorizontal: spacing.xl + spacing.sm,
    marginTop: -spacing.xl,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xl + spacing.sm,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.inputBg,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.inputBorder,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    minHeight: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnDark,
    padding: 0,
    lineHeight: 20,
  },
  clearBtn: {
    width: 20,
    height: 20,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Category dropdown button ──────────────────────────────────────────────
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    minHeight: 44,
    flexShrink: 0,
  },
  categoryBtnActive: {
    backgroundColor: editorialPalette.gold,
    borderColor: editorialPalette.gold,
  },
  modeBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    flexShrink: 0,
  },
  modeBtnActive: {
    backgroundColor: editorialPalette.gold,
    borderColor: editorialPalette.gold,
  },
  categoryBtnLabel: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.3,
    lineHeight: 16,
    maxWidth: 80,
  },
  categoryBtnLabelActive: {
    color: colours.backgroundDark,
    fontWeight: '700',
  },

  // ── Category modal ────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#0d1c1a',
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingTop: spacing.sm,
    paddingBottom: 40,
    maxHeight: SCREEN_HEIGHT * 0.55,
  },
  modalOptions: {
    flexGrow: 0,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xs,
    lineHeight: 16,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  modalOptionActive: {
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  modalOptionText: {
    fontSize: typography.md,
    fontWeight: '500',
    color: colours.textOnDark,
    lineHeight: 24,
  },
  modalOptionTextActive: {
    color: editorialPalette.gold,
    fontWeight: '700',
  },

  // ── Light body transition ─────────────────────────────────────────────────
  bodyGap: {
    height: spacing.xl,
    backgroundColor: colours.backgroundLight,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    marginTop: -spacing.xl,
  },

  // ── List ──────────────────────────────────────────────────────────────────
  list: {
    flexGrow: 1,
    paddingTop: spacing.sm,
    paddingBottom: TAB_BAR_CLEARANCE,
    backgroundColor: colours.backgroundLight,
  },

  // ── State views ───────────────────────────────────────────────────────────
  stateBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingBottom: TAB_BAR_CLEARANCE,
    backgroundColor: colours.backgroundLight,
  },
  stateIcon: {
    marginBottom: spacing.sm,
    opacity: 0.5,
  },
  stateTitle: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
    marginBottom: 4,
    lineHeight: 24,
  },
  stateSubtitle: {
    fontSize: typography.sm,
    color: colours.textMuted,
    lineHeight: 20,
  },
  spinner: {
    color: colours.tertiary,
  } as unknown as { color: string },
  listFooter: {
    paddingVertical: spacing.lg,
  },
});
