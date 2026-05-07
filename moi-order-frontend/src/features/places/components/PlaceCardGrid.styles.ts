import { Dimensions, StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

// Width = 50% of screen minus outer padding and column gap
const SCREEN_WIDTH = Dimensions.get('window').width;
const OUTER_PAD = spacing.md * 2;
const INNER_GAP = spacing.sm;
export const CARD_WIDTH = (SCREEN_WIDTH - OUTER_PAD - INNER_GAP) / 2;
const CARD_RADIUS = 16;

export const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    marginBottom: spacing.sm,
    borderRadius: CARD_RADIUS,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.24,
    shadowRadius: 12,
    elevation: 7,
    backgroundColor: colours.backgroundDark,
  },

  card: {
    height: 178,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    backgroundColor: colours.backgroundDark,
    justifyContent: 'flex-end',
  },

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

  gradient: {
    ...StyleSheet.absoluteFillObject,
  },

  categoryPill: {
    position: 'absolute',
    top: spacing.xs + 2,
    left: spacing.xs + 2,
    backgroundColor: 'rgba(0,0,0,0.46)',
    borderRadius: radius.full,
    paddingVertical: 2,
    paddingHorizontal: spacing.xs + 2,
    borderWidth: 1,
    borderColor: `${editorialPalette.gold}44`,
    maxWidth: '80%',
  },
  categoryText: {
    fontSize: 9,
    fontWeight: '700',
    color: editorialPalette.gold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    lineHeight: 12,
  },

  heartBtn: {
    position: 'absolute',
    top: spacing.xs + 2,
    right: spacing.xs + 2,
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: 'rgba(0,0,0,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  info: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xs,
  },
  name: {
    fontSize: typography.sm,
    fontWeight: '800',
    color: colours.white,
    letterSpacing: -0.2,
    lineHeight: 18,
    marginBottom: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaCity: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '500',
    lineHeight: 14,
    flexShrink: 1,
  },
  metaDot: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    lineHeight: 14,
  },
  metaDistance: {
    fontSize: 10,
    color: editorialPalette.gold,
    fontWeight: '600',
    lineHeight: 14,
  },
});
