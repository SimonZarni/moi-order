import { Platform, StyleSheet } from 'react-native';

import { editorialPalette } from '@/shared/theme/editorialPalette';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

const CARD_RADIUS = 20;
const CARD_HEIGHT = 248;

export const styles = StyleSheet.create({

  // Outer wrapper: shadow only — no overflow so elevation renders on Android
  shadowWrap: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: CARD_RADIUS,
    backgroundColor: '#0f2422',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 7,
  },

  // Separate clip view so overflow:hidden only applies to the image/gradient,
  // not the interactive Pressable — this lets the nested ScrollView scroll freely
  imageClip: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
  },

  // Interactive Pressable — transparent so imageClip shows through; no overflow:hidden
  card: {
    height: CARD_HEIGHT,
    borderRadius: CARD_RADIUS,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },

  // ── Full-bleed image ──────────────────────────────────────────────────────
  image: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0f2422',
  },
  imageFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0f2422',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Gradient overlay — transparent top → dark bottom ──────────────────────
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },

  // ── Category badge — top left ─────────────────────────────────────────────
  categoryPill: {
    position: 'absolute',
    top: spacing.sm + 2,
    left: spacing.sm + 2,
    backgroundColor: 'rgba(0,0,0,0.46)',
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

  // ── Heart — top right ─────────────────────────────────────────────────────
  heartBtn: {
    position: 'absolute',
    top: spacing.sm + 2,
    right: spacing.sm + 2,
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Content overlay — absolute at the bottom ──────────────────────────────
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
  },
  // When tags are present, push name/meta up to leave room for the tag strip
  // 16 (bottom gap) + 32 (pill height) + 6 (breathing room) = 54
  contentWithTags: {
    paddingBottom: 54,
  },

  name: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    lineHeight: 24,
    marginBottom: 4,
  },

  // ── Meta row: city · distance · hours ────────────────────────────────────
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: spacing.xs + 2,
  },
  metaCity: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '500',
    lineHeight: 16,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: editorialPalette.gold,
    opacity: 0.8,
    flexShrink: 0,
  },
  metaHours: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.50)',
    flex: 1,
    lineHeight: 16,
  },
  metaDistance: {
    fontSize: typography.xs,
    color: editorialPalette.gold,
    fontWeight: '600',
    lineHeight: 16,
  },

  // ── Tag chips — no fixed height, horizontal scroll, Burmese-safe padding ────
  // ScrollView positioned as a sibling of the Pressable to avoid gesture conflict
  tagsScroll: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: 0,
  },
  tagsRow: {
    gap: 6,
    paddingRight: 16,
  },
  tagChip: {
    paddingTop: 6,
    paddingBottom: Platform.OS === 'android' ? 8 : 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: `${editorialPalette.gold}99`,
    backgroundColor: `${editorialPalette.gold}40`,
    overflow: 'visible',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: editorialPalette.gold,
    letterSpacing: 0.3,
    lineHeight: 20,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});
