import { StyleSheet } from 'react-native';

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

  // ── Search row ────────────────────────────────────────────────────────────
  // marginTop: -spacing.xl cancels HeroHeader's paddingBottom (32)
  searchRow: {
    backgroundColor: colours.backgroundDark,
    paddingHorizontal: spacing.xl + spacing.sm,
    marginTop: -spacing.xl,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  searchInputWrap: {
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

  // ── Category chips ────────────────────────────────────────────────────────
  chipsRow: {
    backgroundColor: colours.backgroundDark,
  },
  chipsContent: {
    paddingHorizontal: spacing.xl + spacing.sm,
    paddingTop: spacing.sm,
    // Extra paddingBottom so bodyGap's marginTop:-32 doesn't obscure last chip row
    paddingBottom: spacing.xl + spacing.sm,
    gap: spacing.sm,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    backgroundColor: 'rgba(255,255,255,0.07)',
    minHeight: 32,
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: editorialPalette.gold,
    borderColor: editorialPalette.gold,
  },
  chipLabel: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.3,
    lineHeight: 16,
  },
  chipLabelActive: {
    color: colours.backgroundDark,
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
