import { StyleSheet } from 'react-native';
import { MAP_COLORS } from '@/shared/theme/mapTheme';

export const BUBBLE_SIZE     = 44;
export const BUBBLE_SELECTED = 54;

export const styles = StyleSheet.create({
  pressable: { alignItems: 'center' },

  bubble: {
    width:           BUBBLE_SIZE,
    height:          BUBBLE_SIZE,
    borderRadius:    BUBBLE_SIZE / 2,
    borderWidth:     2.5,
    borderColor:     MAP_COLORS.white,
    overflow:        'hidden',
    backgroundColor: MAP_COLORS.surfaceAlt,
    alignItems:      'center',
    justifyContent:  'center',
  },
  bubbleSelected: {
    width:        BUBBLE_SELECTED,
    height:       BUBBLE_SELECTED,
    borderRadius: BUBBLE_SELECTED / 2,
    borderWidth:  3.5,
    borderColor:  '#10B981',   // green border IS the ring
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
