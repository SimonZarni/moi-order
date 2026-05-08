import { StyleSheet } from 'react-native';
import { MAP_COLORS } from '@/shared/theme/mapTheme';

export const BUBBLE_SIZE     = 44;
export const BUBBLE_SELECTED = 52;

const GREEN = '#10B981';

export const styles = StyleSheet.create({
  pressable: { alignItems: 'center' },

  // ── Ring wrap ──────────────────────────────────────────────────────────────
  ringWrap: {
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: 'transparent',
    shadowColor:     MAP_COLORS.black,
    shadowOffset:    { width: 0, height: 3 },
    shadowOpacity:   0.25,
    shadowRadius:    5,
    elevation:       8,
  },
  ringWrapSelected: {
    borderWidth:  3,
    borderColor:  GREEN,
    borderRadius: (BUBBLE_SELECTED + 8) / 2,
    padding:      4,
    shadowColor:  GREEN,
    shadowOpacity: 0.45,
    shadowRadius:  8,
  },

  // ── Bubble ────────────────────────────────────────────────────────────────
  bubbleBase: {
    width:           BUBBLE_SIZE,
    height:          BUBBLE_SIZE,
    borderRadius:    BUBBLE_SIZE / 2,
    overflow:        'hidden',
    backgroundColor: MAP_COLORS.surfaceAlt,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     2,
    borderColor:     MAP_COLORS.white,
  },
  bubbleSelected: {
    width:        BUBBLE_SELECTED,
    height:       BUBBLE_SELECTED,
    borderRadius: BUBBLE_SELECTED / 2,
  },

  coverImage:    { width: '100%', height: '100%' },
  imageFallback: {
    width: '100%', height: '100%',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: MAP_COLORS.primaryLight,
  },
  fallbackEmoji: { fontSize: 20 },

  // ── Tail ──────────────────────────────────────────────────────────────────
  tail: {
    width: 0, height: 0,
    borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8,
    borderLeftColor: MAP_COLORS.transparent,
    borderRightColor: MAP_COLORS.transparent,
    borderTopColor: MAP_COLORS.white,
    marginTop: -1,
  },
  tailSelected: { borderTopColor: GREEN },

  // ── Label ─────────────────────────────────────────────────────────────────
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
