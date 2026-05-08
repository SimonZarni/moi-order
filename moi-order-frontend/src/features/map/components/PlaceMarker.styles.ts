import { StyleSheet } from 'react-native';
import { MAP_COLORS } from '@/shared/theme/mapTheme';

export const BUBBLE_SIZE     = 44;
export const BUBBLE_SELECTED = 52; // subtle increase

export const styles = StyleSheet.create({
  pressable: { alignItems: 'center' },

  // Outer ring wrapper — border becomes the visible green ring when selected.
  // Contains the bubble; its padding creates the gap between ring and bubble.
  ringWrap: {
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: 'transparent',
    // Shadow lives here so it renders outside overflow:hidden bubble
    shadowColor:     MAP_COLORS.black,
    shadowOffset:    { width: 0, height: 3 },
    shadowOpacity:   0.25,
    shadowRadius:    5,
    elevation:       8,
  },

  // Inner bubble — clips the image to a circle.
  bubbleBase: {
    overflow:        'hidden',
    backgroundColor: MAP_COLORS.surfaceAlt,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     2,
    borderColor:     MAP_COLORS.white,
  },

  coverImage: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    width: '100%', height: '100%',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: MAP_COLORS.primaryLight,
  },
  fallbackEmoji:  { fontSize: 20 },

  tail: {
    width: 0, height: 0,
    borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8,
    borderLeftColor: MAP_COLORS.transparent,
    borderRightColor: MAP_COLORS.transparent,
    borderTopColor: MAP_COLORS.white,
    marginTop: -1,
  },
  tailSelected: { borderTopColor: MAP_COLORS.primary },

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
