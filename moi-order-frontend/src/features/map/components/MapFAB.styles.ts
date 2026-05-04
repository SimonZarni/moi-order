import { Dimensions, StyleSheet } from 'react-native';
import { MAP_COLORS } from '@/shared/theme/mapTheme';

const { width: SCREEN_W } = Dimensions.get('window');

export const FAB_SIZE   = 52;
export const ITEM_SIZE  = 58;
export const RADIUS     = Math.round(SCREEN_W * 0.65);
export const STEP_DEG   = 22;
export const FAB_BOTTOM = 142;
export const FAB_RIGHT  = 26;
// arcArea is a square whose bottom-right corner sits at the FAB centre.
export const ARC_AREA   = RADIUS + Math.ceil(ITEM_SIZE / 2) + 14;
// FAB centre coordinates inside arcArea (bottom-right corner of area).
export const FAB_CX     = ARC_AREA;
export const FAB_CY     = ARC_AREA;

export const styles = StyleSheet.create({
  // Full-screen root — covers the container so the overlay can dim the map.
  root: {
    position:      'absolute',
    top:           0,
    left:          0,
    right:         0,
    bottom:        0,
    zIndex:        14,
    pointerEvents: 'box-none',
  },
  // Semi-transparent overlay: dims map, handles pan-to-scroll + tap-to-close.
  overlay: {
    position:        'absolute',
    top:             0,
    left:            0,
    right:           0,
    bottom:          0,
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
  },
  // Arc item container — bottom-right corner aligned with FAB centre.
  arcArea: {
    position: 'absolute',
    bottom:   FAB_BOTTOM + FAB_SIZE / 2,
    right:    FAB_RIGHT  + FAB_SIZE / 2,
    width:    ARC_AREA,
    height:   ARC_AREA,
    zIndex:   15,
  },
  // FAB button — fixed position over the overlay.
  fab: {
    position:        'absolute',
    bottom:          FAB_BOTTOM,
    right:           FAB_RIGHT,
    width:           FAB_SIZE,
    height:          FAB_SIZE,
    borderRadius:    FAB_SIZE / 2,
    backgroundColor: MAP_COLORS.primary,
    alignItems:      'center',
    justifyContent:  'center',
    shadowColor:     MAP_COLORS.black,
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.28,
    shadowRadius:    10,
    elevation:       10,
    zIndex:          16,
  },
  fabOpen: {
    backgroundColor: MAP_COLORS.primaryDark,
  },
  fabIcon: {
    fontSize:   28,
    color:      MAP_COLORS.white,
    lineHeight: 34,
    fontWeight: '300',
  },
  arcItem: {
    width:           ITEM_SIZE,
    height:          ITEM_SIZE,
    borderRadius:    ITEM_SIZE / 2,
    backgroundColor: MAP_COLORS.surface,
    alignItems:      'center',
    justifyContent:  'center',
    shadowColor:     MAP_COLORS.black,
    shadowOffset:    { width: 0, height: 3 },
    shadowOpacity:   0.18,
    shadowRadius:    8,
    elevation:       8,
    borderWidth:     1.5,
    borderColor:     MAP_COLORS.border,
  },
  arcItemActive: {
    backgroundColor: MAP_COLORS.primary,
    borderColor:     MAP_COLORS.primary,
    shadowOpacity:   0.32,
    elevation:       12,
  },
  arcEmoji: { fontSize: 22 },
  arcLabel: {
    position:      'absolute',
    bottom:        -(ITEM_SIZE * 0.45),
    left:          -(ITEM_SIZE * 0.5),
    right:         -(ITEM_SIZE * 0.5),
    alignItems:    'center',
    pointerEvents: 'none',
  },
  arcLabelText: {
    fontSize:          9,
    fontWeight:        '700',
    color:             MAP_COLORS.textSecondary,
    textAlign:         'center',
    backgroundColor:   MAP_COLORS.surface,
    borderRadius:      6,
    paddingHorizontal: 5,
    paddingVertical:   2,
    overflow:          'hidden',
  },
  arcLabelTextActive: { color: MAP_COLORS.primary },
});
