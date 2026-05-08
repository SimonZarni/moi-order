import { StyleSheet } from 'react-native';
import { MAP_COLORS } from '@/shared/theme/mapTheme';

export const BUBBLE_SIZE     = 44;
export const BUBBLE_SELECTED = 52;

export const styles = StyleSheet.create({
  pressable: { alignItems: 'center' },

  // Single bubble — animated size + border colour. overflow:hidden clips image
  // to circle. No wrapper needed; Android elevation uses borderRadius for shape.
  bubble: {
    overflow:        'hidden',
    backgroundColor: MAP_COLORS.surfaceAlt,
    alignItems:      'center',
    justifyContent:  'center',
    elevation:       6,   // Android circular shadow (works with borderRadius)
  },

  coverImage:    { width: '100%', height: '100%' },
  imageFallback: {
    width: '100%', height: '100%',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: MAP_COLORS.primaryLight,
  },
  fallbackEmoji: { fontSize: 20 },

  tail: {
    width: 0, height: 0,
    borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8,
    borderLeftColor: MAP_COLORS.transparent,
    borderRightColor: MAP_COLORS.transparent,
    borderTopColor: MAP_COLORS.white,
    marginTop: -1,
  },
  tailSelected: { borderTopColor: '#10B981' },

  labelBubble: {
    position:          'absolute',
    top:               -30,
    backgroundColor:   MAP_COLORS.textPrimary,
    borderRadius:      6,
    paddingHorizontal: 8,
    paddingVertical:   3,
    maxWidth:          160,
  },
  labelText: { color: MAP_COLORS.white, fontSize: 11, fontWeight: '600' },
});
