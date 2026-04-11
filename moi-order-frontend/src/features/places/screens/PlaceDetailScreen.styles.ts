import { Dimensions, StyleSheet } from 'react-native';

// Two gallery images + one gap fit exactly within the section's horizontal margins.
const SCREEN_WIDTH = Dimensions.get('window').width;
const GALLERY_IMAGE_WIDTH = (SCREEN_WIDTH - 32 - 8) / 2; // 32 = 2×spacing.md, 8 = spacing.sm gap

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  // ── Scaffold ──────────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colours.backgroundLight,
  },
  spinner: {
    color: colours.tertiary,
  } as unknown as { color: string },
  errorText: {
    fontSize: typography.md,
    color: colours.danger,
    marginBottom: spacing.md,
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
  heroContainer: {
    position: 'relative',
    minHeight: 60,
  },
  heroImage: {
    width: '100%',
    height: 300,
  },
  // Floating back button overlaid on hero image (top-left)
  heroBackBtn: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.38)',
    borderRadius: radius.full,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    minHeight: 36,
    zIndex: 10,
  },
  heroBackArrow: {
    fontSize: 22,
    color: colours.tertiary,
    lineHeight: 26,
    fontWeight: '300',
  },
  heroBackLabel: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.tertiary,
    letterSpacing: 0.2,
  },
  // Floating heart button overlaid on hero image (top-right) — mirrors back button
  heroFavBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.md,
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: 'rgba(0,0,0,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  heroFavIcon: {
    fontSize: 18,
    color: colours.white,
    lineHeight: 22,
  },
  // Active (favorited) state: bright coral-red to pop against the dark overlay
  heroFavIconActive: {
    color: colours.destructive,
  },

  // ── Section 1 — Identity card (pulls up over hero) ───────────────────────
  identityCard: {
    marginHorizontal: spacing.md,
    marginTop: -(spacing.xl), // -32: overlaps bottom of hero
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    padding: spacing.md,
    ...shadows.heavy,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  categoryText: {
    color: colours.white,
    fontSize: typography.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  name: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.3,
  },
  nameSub: {
    fontSize: typography.md,
    color: colours.tertiary,
    fontWeight: '500',
    marginTop: 2,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  cityDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colours.tertiary,
    marginRight: spacing.xs,
  },
  city: {
    fontSize: typography.sm,
    color: colours.medium,
    fontWeight: '500',
  },

  // ── Shared card shell ─────────────────────────────────────────────────────
  sectionCard: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    padding: spacing.md,
    ...shadows.light,
  },
  // Uppercase spaced label used at the top of every section card
  sectionLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.primary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },

  // ── Section 2 — Details (info rows) ──────────────────────────────────────
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: colours.infoBg,
  },
  infoIcon: {
    width: 28,
    fontSize: typography.md,
    textAlign: 'center',
    marginRight: spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnLight,
    lineHeight: 20,
  },
  infoLink: {
    color: colours.primary,
    fontWeight: '500',
  },

  // ── Section 3 — Tags ──────────────────────────────────────────────────────
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    backgroundColor: colours.infoBg,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderWidth: 1,
    borderColor: 'rgba(34,78,74,0.18)',
  },
  tagText: {
    fontSize: typography.xs,
    color: colours.tertiary,
    fontWeight: '600',
  },

  // ── Section 4 — About (left accent bar) ──────────────────────────────────
  // Absolutely positioned inside sectionCard; gives the card its signature left stripe
  aboutAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colours.primary,
    borderTopLeftRadius: radius.xl,
    borderBottomLeftRadius: radius.xl,
  },
  longDescription: {
    fontSize: typography.md,
    color: colours.medium,
    lineHeight: 26,
  },

  // ── Section 5 — Gallery ───────────────────────────────────────────────────
  gallerySection: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  // Row: "Gallery" label left + "View all" button right
  galleryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  // Same visual as sectionLabel but no marginBottom (handled by galleryHeader)
  galleryLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.primary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  viewAllBtn: {
    paddingVertical: 2,
    paddingHorizontal: spacing.xs,
  },
  viewAllText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.primary,
  },
  galleryList: {
    paddingRight: spacing.md,
  },
  galleryImageWrap: {
    marginRight: spacing.sm,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  // Width computed so exactly 2 images are visible without scrolling
  galleryImage: {
    width: GALLERY_IMAGE_WIDTH,
    height: 130,
    resizeMode: 'cover',
  },
});
