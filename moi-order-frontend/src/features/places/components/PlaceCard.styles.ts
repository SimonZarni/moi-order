import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  // Outer wrapper: owns shadow — no overflow:hidden so Android elevation shows.
  // Intentionally heavier than shadows.heavy (0.22 vs 0.13) because the card
  // sits on a light list background and needs strong depth against the image.
  shadowWrap: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colours.backgroundDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 7,
  },

  // Inner Pressable: clips image + gradient to rounded corners
  card: {
    height: 160,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colours.backgroundDark,
    justifyContent: 'flex-end',
  },

  // ── Full-bleed image ──────────────────────────────────────────────────────
  image: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colours.backgroundDark,
  },

  // ── No-image fallback ─────────────────────────────────────────────────────
  imageFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0f2422',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageFallbackIcon: {
    fontSize: 44,
    opacity: 0.2,
  },

  // ── Gradient overlay ──────────────────────────────────────────────────────
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },

  // ── Category badge — top left ─────────────────────────────────────────────
  categoryBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.38)',
    borderRadius: radius.full,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: `${colours.tertiary}88`,
  },
  categoryText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.tertiary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  // ── Bottom content ────────────────────────────────────────────────────────
  bottomContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  name: {
    fontSize: typography.md + 1,
    fontWeight: '800',
    color: colours.white,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaCity: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '500',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: editorialPalette.gold,
    marginHorizontal: spacing.xs,
    opacity: 0.7,
  },
  metaHours: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.5)',
    flex: 1,
  },
});
