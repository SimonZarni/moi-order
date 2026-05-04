import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

const CARD_RADIUS = radius.xl + 4; // 20

export const styles = StyleSheet.create({
  // Outer shadow wrapper — no overflow:hidden so elevation renders on Android
  shadowWrap: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md + 2,
    borderRadius: CARD_RADIUS,
    backgroundColor: colours.backgroundDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 9,
  },

  // Inner Pressable clips image + glass to rounded corners
  card: {
    height: 280,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    backgroundColor: colours.backgroundDark,
    justifyContent: 'flex-end',
  },

  // ── Full-bleed image ──────────────────────────────────────────────────────
  image: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colours.backgroundDark,
  },

  imageFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0f2422',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Bottom gradient ───────────────────────────────────────────────────────
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },

  // ── Category pill — top right ─────────────────────────────────────────────
  categoryPill: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.42)',
    borderRadius: radius.full,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm + 2,
    borderWidth: 1,
    borderColor: `${editorialPalette.gold}55`,
  },
  categoryText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: editorialPalette.gold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    lineHeight: 13,
  },

  // ── Frosted glass panel ───────────────────────────────────────────────────
  glassPanel: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    overflow: 'hidden',
  },

  // Dark tint layered on top of the blur for depth
  glassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12,24,22,0.40)',
  },

  glassContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },

  // ── Name row ─────────────────────────────────────────────────────────────
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  name: {
    flex: 1,
    fontSize: typography.lg,
    fontWeight: '800',
    color: colours.white,
    letterSpacing: -0.4,
    lineHeight: 24,
    marginRight: spacing.sm,
  },
  heartBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Meta row ─────────────────────────────────────────────────────────────
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: spacing.sm,
  },
  metaCity: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.60)',
    fontWeight: '500',
    lineHeight: 16,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: editorialPalette.gold,
    opacity: 0.7,
  },
  metaHours: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.42)',
    flex: 1,
    lineHeight: 16,
  },
  metaDistance: {
    fontSize: typography.xs,
    color: editorialPalette.gold,
    fontWeight: '600',
    lineHeight: 16,
  },

  // ── Tag chips ────────────────────────────────────────────────────────────
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tagChip: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: `${editorialPalette.gold}50`,
    backgroundColor: `${editorialPalette.gold}18`,
  },
  tagText: {
    fontSize: typography.xxs,
    fontWeight: '600',
    color: editorialPalette.gold,
    letterSpacing: 0.4,
    lineHeight: 13,
  },
});
