import { StyleSheet, Dimensions } from 'react-native';
import { MAP_COLORS } from '@/shared/theme/mapTheme';

const { height: SCREEN_H } = Dimensions.get('window');

export const styles = StyleSheet.create({
  backdrop: {
    position:        'absolute',
    top:             0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  backdropTap: {
    flex: 1,
  },
  cardContainer: {
    position:       'absolute',
    bottom:         0,
    left:           0,
    right:          0,
  },
  sheet: {
    backgroundColor: MAP_COLORS.surface,
    borderTopLeftRadius:  24,
    borderTopRightRadius: 24,
    maxHeight:            SCREEN_H * 0.72,
    paddingBottom:        32,
    shadowColor:          MAP_COLORS.black,
    shadowOffset:         { width: 0, height: -4 },
    shadowOpacity:        0.12,
    shadowRadius:         20,
    elevation:            20,
  },
  handleArea: {
    alignItems:  'center',
    paddingTop:  12,
    paddingBottom: 4,
    paddingHorizontal: 60,
  },
  handle: {
    width:           40,
    height:          4,
    borderRadius:    2,
    backgroundColor: MAP_COLORS.border,
  },
  header: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical:   14,
    borderBottomWidth: 1,
    borderBottomColor: MAP_COLORS.border,
  },
  title: {
    fontSize:   18,
    fontWeight: '700',
    color:      MAP_COLORS.textPrimary,
  },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical:   6,
    borderRadius:      20,
    backgroundColor:   MAP_COLORS.surfaceAlt,
  },
  clearText: {
    fontSize:   13,
    fontWeight: '600',
    color:      MAP_COLORS.textSecondary,
  },
  body: {
    flexDirection:   'row',
    flexWrap:        'wrap',
    padding:         16,
    gap:             10,
  },
  chip: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius:    9999,
    borderWidth:     1.5,
    borderColor:     MAP_COLORS.border,
    backgroundColor: MAP_COLORS.surface,
  },
  chipActive: {
    borderColor:     MAP_COLORS.primary,
    backgroundColor: MAP_COLORS.primaryLight,
  },
  chipLabel: {
    fontSize:   14,
    color:      MAP_COLORS.textSecondary,
    fontWeight: '500',
  },
  chipLabelActive: {
    color:      MAP_COLORS.primary,
    fontWeight: '700',
  },
  checkmark: {
    fontSize: 12,
    color:    MAP_COLORS.primary,
  },
  footer: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: 20,
    paddingTop:        12,
    borderTopWidth:    1,
    borderTopColor:    MAP_COLORS.border,
    gap:               12,
  },
  selectAllBtn: {
    flex:              1,
    paddingVertical:   14,
    borderRadius:      14,
    alignItems:        'center',
    backgroundColor:   MAP_COLORS.surfaceAlt,
    borderWidth:       1.5,
    borderColor:       MAP_COLORS.border,
  },
  selectAllText: {
    fontSize:   15,
    fontWeight: '600',
    color:      MAP_COLORS.textPrimary,
  },
  applyBtn: {
    flex:              1,
    paddingVertical:   14,
    borderRadius:      14,
    alignItems:        'center',
    backgroundColor:   MAP_COLORS.primary,
  },
  applyText: {
    fontSize:   15,
    fontWeight: '700',
    color:      MAP_COLORS.white,
  },
  empty: {
    alignItems:  'center',
    paddingVertical: 32,
  },
  emptyText: { color: MAP_COLORS.textMuted, fontSize: 14 },
});
