import { StyleSheet } from 'react-native';

import { editorialPalette } from '@/shared/theme/editorialPalette';
import { FONTS } from '@/shared/theme/fonts';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import { TAB_BAR_CLEARANCE } from '@/shared/components/FloatingTabBar/FloatingTabBar.styles';

const CREAM  = '#F5F0E8';
const FOREST = '#1B3A2D';

export const styles = StyleSheet.create({
  // Root matches the header so there is no gap between them
  root: {
    flex: 1,
    backgroundColor: FOREST,
  },

  // ── Header — dark green ───────────────────────────────────────────────────
  header: {
    backgroundColor: FOREST,
    paddingBottom: 0,
    overflow: 'hidden',
  },

  // Decorative orbs
  headerOrb: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.07,
    top: -70,
    right: -50,
  },
  headerOrbSmall: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    opacity: 0.04,
    top: 60,
    left: -20,
  },

  // ── Top row: back button + mode toggle ────────────────────────────────────
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  headerBackBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerModeBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerModeBtnActive: {
    backgroundColor: editorialPalette.gold,
    borderColor: editorialPalette.gold,
  },

  // ── Editorial title ───────────────────────────────────────────────────────
  titleBlock: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  titleAccent: {
    fontFamily: FONTS.playfairBoldItalic,
    fontSize: 30,
    color: editorialPalette.gold,
    letterSpacing: 0.2,
  },
  titleMain: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.8,
  },
  titleSubtitle: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.50)',
    marginTop: 2,
    lineHeight: 18,
  },

  // ── Search row: full-width input + layout toggle ──────────────────────────
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    minHeight: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sm,
    color: '#FFFFFF',
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

  // ── Feed / Grid layout toggle ─────────────────────────────────────────────
  layoutGroup: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    flexShrink: 0,
  },
  layoutBtn: {
    width: 36,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  layoutBtnActive: {
    backgroundColor: editorialPalette.gold,
  },

  // ── Cream card — lifts over the header bottom ─────────────────────────────
  listCard: {
    flex: 1,
    backgroundColor: CREAM,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    overflow: 'hidden',
  },

  // ── Filter row — 2 pill buttons inside dark green header ──────────────────
  // paddingBottom creates the overlap zone the cream listCard slides over
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: 32,
    gap: 8,
  },

  // Unified filter pill (Category + Tags)
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    minHeight: 34,
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: editorialPalette.gold,
    borderColor: editorialPalette.gold,
  },
  filterPillLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.80)',
    lineHeight: 16,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  filterPillLabelActive: {
    color: FOREST,
  },

  // Partial-match note
  partialMatchNote: {
    fontSize: typography.xs,
    color: '#7A7A7A',
    fontStyle: 'italic',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: 0,
  },

  // ── Bottom sheets ─────────────────────────────────────────────────────────
  sheetBg: {
    backgroundColor: '#0d1c1a',
  },
  sheetHandle: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    width: 36,
    height: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  sheetTitleText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.40)',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    lineHeight: 16,
  },

  // Category sheet — list options
  sheetListContent: {
    paddingBottom: 40,
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  sheetOptionActive: {
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  sheetOptionText: {
    fontSize: typography.md,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  sheetOptionTextActive: {
    color: editorialPalette.gold,
    fontWeight: '700',
  },

  // Tags sheet
  sheetTagsWrapper: {
    flex: 1,
  },
  sheetTagsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  sheetClearBtn: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: editorialPalette.gold,
    lineHeight: 20,
  },
  // alignItems: 'flex-start' prevents cross-axis stretching so Latin and Burmese
  // pills don't force each other to match heights
  sheetTagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
    gap: 8,
  },
  sheetTagPill: {
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingTop: 6,
    paddingBottom: 8,
    paddingHorizontal: 14,
    overflow: 'visible',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  sheetTagPillActive: {
    backgroundColor: editorialPalette.gold,
    borderColor: editorialPalette.gold,
  },
  sheetTagText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 24,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  sheetTagTextActive: {
    color: FOREST,
  },

  // ── List ──────────────────────────────────────────────────────────────────
  flatList: {
    flex: 1,
  },
  list: {
    flexGrow: 1,
    paddingTop: spacing.sm,
    paddingBottom: TAB_BAR_CLEARANCE,
    backgroundColor: CREAM,
  },
  gridRow: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },

  // ── State views ───────────────────────────────────────────────────────────
  stateBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingBottom: TAB_BAR_CLEARANCE,
    backgroundColor: CREAM,
  },
  stateIcon: {
    marginBottom: spacing.sm,
    opacity: 0.4,
  },
  stateTitle: {
    fontSize: typography.md,
    fontWeight: '700',
    color: '#2C2C2C',
    marginBottom: 4,
    lineHeight: 24,
  },
  stateSubtitle: {
    fontSize: typography.sm,
    color: '#7A7A7A',
    lineHeight: 20,
  },
  spinner: {
    color: FOREST,
  } as unknown as { color: string },
  listFooter: {
    paddingVertical: spacing.lg,
  },
});
