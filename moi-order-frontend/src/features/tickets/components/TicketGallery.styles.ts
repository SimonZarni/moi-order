import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';

export const GALLERY_HEIGHT = 260;

export const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    height: GALLERY_HEIGHT,
    backgroundColor: colours.backgroundDark,
  },
  image: {
    height: GALLERY_HEIGHT,
    backgroundColor: colours.backgroundDark,
  },

  // ── Dot indicators ────────────────────────────────────────────────────────
  dots: {
    position: 'absolute',
    bottom: spacing.sm,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  dotActive: {
    width: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
});
