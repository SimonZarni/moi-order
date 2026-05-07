import { Dimensions, StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { FONTS } from '@/shared/theme/fonts';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import { TAB_BAR_CLEARANCE } from '@/shared/components/FloatingTabBar/FloatingTabBar.styles';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Hero takes ~45% of screen; exported for animation ranges
export const HERO_HEIGHT = Math.round(SCREEN_HEIGHT * 0.45);

// Extra pixels the heroImageWrap extends beyond the container on top + bottom
export const HERO_PARALLAX_OFFSET = 90;

const GALLERY_THUMB = 92;
const BODY_OVERLAP  = 20;

// Design palette
const CREAM       = '#F5F0E8';
const FOREST      = '#1B3A2D';
const GOLD        = '#C9A84C';
const TEXT_DARK   = '#2C2C2C';
const TEXT_MUTED  = '#7A7A7A';
const DIVIDER_CLR = 'rgba(0,0,0,0.08)';

export const styles = StyleSheet.create({

  // ── Scaffold ──────────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: colours.dark,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CREAM,
    paddingHorizontal: spacing.md,
  },
  errorText: {
    fontSize: typography.md,
    color: colours.danger,
    marginBottom: spacing.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  backBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: FOREST,
    borderRadius: radius.md,
  },
  backBtnText: { color: colours.white, fontSize: typography.md, fontWeight: '600' },

  // ── Fixed back button — outside ScrollView, always visible ────────────────
  fixedBackBtnWrap: {
    position: 'absolute',
    left: 16,
    zIndex: 100,
  },
  fixedBackBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Hero — edge-to-edge, no border radius ─────────────────────────────────
  hero: {
    height: HERO_HEIGHT,
    backgroundColor: colours.dark,
    overflow: 'hidden',
  },

  heroImageWrap: {
    position: 'absolute',
    top:    -HERO_PARALLAX_OFFSET,
    left:   0,
    right:  0,
    bottom: -HERO_PARALLAX_OFFSET,
  },
  heroImage: {
    width:  '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },

  // Heart button row — right-aligned, always visible inside hero
  heroControls: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 10,
  },
  heroBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Name + category — fades on scroll
  heroIdentity: {
    position: 'absolute',
    bottom: BODY_OVERLAP + spacing.lg,
    left:  spacing.lg,
    right: spacing.lg,
    zIndex: 10,
  },
  heroCategoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: `${GOLD}55`,
    backgroundColor: 'rgba(0,0,0,0.40)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    marginBottom: spacing.sm,
    gap: 5,
  },
  heroCategoryDot: {
    width: 5,
    height: 5,
    borderRadius: radius.full,
    backgroundColor: GOLD,
  },
  heroCategoryText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: GOLD,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    lineHeight: 13,
  },
  heroName: {
    fontSize: 28,
    fontWeight: '900',
    color: colours.white,
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  heroNameSub: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.52)',
    fontWeight: '400',
    marginTop: 3,
    lineHeight: 20,
  },

  // ── Body — cream card, overlaps hero bottom ────────────────────────────────
  body: {
    backgroundColor: CREAM,
    marginTop: -BODY_OVERLAP,
    borderTopLeftRadius:  24,
    borderTopRightRadius: 24,
    paddingTop: spacing.md,
    paddingBottom: TAB_BAR_CLEARANCE + spacing.xl,
    minHeight: SCREEN_HEIGHT - HERO_HEIGHT + BODY_OVERLAP,
  },

  // ── Info bar — 3-column row (CITY | HOURS | DISTANCE) ─────────────────────
  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.white,
    borderRadius: 16,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  infoCell: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.xs,
  },
  infoCellLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: TEXT_MUTED,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    lineHeight: 12,
  },
  infoCellValue: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: TEXT_DARK,
    lineHeight: 16,
    textAlign: 'center',
  },
  infoDivider: {
    width: 1,
    height: 32,
    backgroundColor: DIVIDER_CLR,
  },

  // ── Divider ───────────────────────────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: DIVIDER_CLR,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
  },

  // ── Section heading (Playfair serif) ──────────────────────────────────────
  sectionHeading: {
    fontFamily: FONTS.playfairBold,
    fontSize: 20,
    color: TEXT_DARK,
    letterSpacing: -0.2,
    lineHeight: 26,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  shortDescHeading: {
    fontFamily: FONTS.playfairBold,
    fontSize: 17,
    color: TEXT_DARK,
    letterSpacing: -0.1,
    lineHeight: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },

  // ── Description ───────────────────────────────────────────────────────────
  descriptionWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    marginBottom: spacing.md,
  },
  descriptionShort: {
    fontSize: typography.md,
    fontWeight: '700',
    fontStyle: 'italic',
    color: TEXT_DARK,
    lineHeight: 26,
    marginBottom: spacing.xs + 2,
  },
  description: {
    fontSize: typography.md,
    color: TEXT_MUTED,
    lineHeight: 26,
  },
  seeMoreText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: FOREST,
    marginTop: spacing.xs,
    lineHeight: 20,
  },

  // ── Tags — no fixed height; expands to fit tall scripts ───────────────────
  tagsScroll: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    paddingBottom: spacing.md,
    alignItems: 'center',
  },
  tag: {
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: `${GOLD}66`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 4,
    marginRight: spacing.xs + 2,
    backgroundColor: `${GOLD}11`,
    minHeight: 36,
    justifyContent: 'center',
  },
  tagText: {
    fontSize: typography.xs,
    color: FOREST,
    fontWeight: '600',
    lineHeight: 20,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },

  // ── Action buttons — full-width dark green ────────────────────────────────
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: FOREST,
    borderRadius: 14,
    paddingVertical: spacing.md,
    minHeight: 52,
  },
  actionBtnText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.white,
    lineHeight: 18,
  },
  actionBtnWebsite: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: FOREST,
  },
  actionBtnWebsiteText: {
    color: FOREST,
  },

  // ── Gallery strip ─────────────────────────────────────────────────────────
  gallerySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  galleryLabel: {
    fontSize: typography.xxs,
    fontWeight: '800',
    color: GOLD,
    letterSpacing: 2,
    textTransform: 'uppercase',
    lineHeight: 14,
  },
  viewAllText: {
    fontSize: typography.sm,
    color: FOREST,
    fontWeight: '600',
  },
  galleryStrip: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    paddingBottom: spacing.xs,
  },
  galleryThumb: {
    width: GALLERY_THUMB,
    height: GALLERY_THUMB,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: `${GOLD}22`,
    marginRight: spacing.sm,
  },
  galleryThumbImg: { width: '100%', height: '100%' },
  galleryMoreBadge: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryMoreText: {
    fontSize: typography.sm,
    fontWeight: '800',
    color: colours.white,
    lineHeight: 20,
  },

});
