import { Dimensions, StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HERO_HEIGHT = 300;
// 2-column grid: subtract 2 × horizontal padding (16 each) + 1 gap between columns
const GALLERY_ITEM_SIZE = (SCREEN_WIDTH - spacing.md * 2 - spacing.sm) / 2;

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
    backgroundColor: colours.backgroundLight,
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
    backgroundColor: colours.primary,
    borderRadius: radius.md,
  },
  backBtnText: {
    color: colours.white,
    fontSize: typography.md,
    fontWeight: '600',
  },

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    height: HERO_HEIGHT,
    backgroundColor: colours.dark,
    overflow: 'hidden',
  },
  heroImageWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // Back + heart row floating above everything
  heroControls: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  heroBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: 'rgba(0,0,0,0.32)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Category pill + names anchored to the bottom of the hero
  heroIdentity: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.md,
    right: spacing.md,
    zIndex: 10,
  },
  heroCategoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: `${editorialPalette.gold}55`,
    backgroundColor: 'rgba(0,0,0,0.38)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    marginBottom: spacing.sm,
    gap: 5,
  },
  heroCategoryDot: {
    width: 5,
    height: 5,
    borderRadius: radius.full,
    backgroundColor: editorialPalette.gold,
  },
  heroCategoryText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: editorialPalette.gold,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    lineHeight: 13,
  },
  heroName: {
    fontSize: typography.xxl,
    fontWeight: '900',
    color: colours.white,
    letterSpacing: -0.4,
    lineHeight: 42,
  },
  heroNameSub: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '500',
    marginTop: 2,
    lineHeight: 20,
  },

  // ── Body ──────────────────────────────────────────────────────────────────
  body: {
    backgroundColor: colours.white,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    minHeight: SCREEN_HEIGHT - HERO_HEIGHT,
  },

  // ── Info chips ────────────────────────────────────────────────────────────
  infoChipsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: colours.divider,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  infoChipText: {
    fontSize: typography.sm,
    color: colours.medium,
    fontWeight: '500',
    lineHeight: 18,
  },

  // ── Divider ───────────────────────────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: colours.divider,
    marginVertical: spacing.md,
  },

  // ── Description ───────────────────────────────────────────────────────────
  descriptionWrap: {
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.md,
    color: colours.medium,
    lineHeight: 26,
  },
  seeMoreText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.primary,
    marginTop: spacing.xs,
    lineHeight: 20,
  },

  // ── Tags ──────────────────────────────────────────────────────────────────
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  tag: {
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.infoBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    backgroundColor: colours.infoBg,
  },
  tagText: {
    fontSize: typography.xs,
    color: colours.tertiary,
    fontWeight: '600',
    lineHeight: 16,
  },

  // ── Action buttons ────────────────────────────────────────────────────────
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colours.dark,
    borderRadius: radius.xl,
    paddingVertical: spacing.sm + 4,
    minHeight: 44,
  },
  actionBtnText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.white,
    lineHeight: 18,
  },

  // ── Gallery ───────────────────────────────────────────────────────────────
  galleryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  galleryLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.medium,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  viewAllText: {
    fontSize: typography.sm,
    color: colours.primary,
    fontWeight: '600',
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  galleryItem: {
    width: GALLERY_ITEM_SIZE,
    height: GALLERY_ITEM_SIZE,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colours.infoBg,
  },
  galleryItemImage: {
    width: '100%',
    height: '100%',
  },
});
