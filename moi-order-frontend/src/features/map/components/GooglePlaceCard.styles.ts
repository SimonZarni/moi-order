import { StyleSheet } from 'react-native';
import { MAP_COLORS } from '@/shared/theme/mapTheme';

export const styles = StyleSheet.create({
  card: {
    position:        'absolute',
    bottom:          24,
    left:            16,
    right:           16,
    backgroundColor: MAP_COLORS.textPrimary,
    borderRadius:    20,
    padding:         16,
    shadowColor:     MAP_COLORS.black,
    shadowOffset:    { width: 0, height: 6 },
    shadowOpacity:   0.28,
    shadowRadius:    16,
    elevation:       14,
    gap:             12,
  },
  header: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           10,
  },
  gBadge: {
    width:           34,
    height:          34,
    borderRadius:    17,
    backgroundColor: '#ffffff14',
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     1,
    borderColor:     '#ffffff22',
  },
  gBadgeText: {
    fontSize:   15,
    fontWeight: '800',
    color:      MAP_COLORS.white,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize:   15,
    fontWeight: '700',
    color:      MAP_COLORS.white,
    lineHeight: 20,
  },
  address: {
    fontSize:   12,
    color:      '#ffffff99',
    marginTop:  2,
    lineHeight: 16,
  },
  dismissBtn: {
    width:           28,
    height:          28,
    borderRadius:    14,
    backgroundColor: '#ffffff14',
    alignItems:      'center',
    justifyContent:  'center',
  },
  dismissText: {
    fontSize:   11,
    color:      '#ffffff99',
    fontWeight: '700',
  },
  mapsBtn: {
    backgroundColor: MAP_COLORS.primary,
    borderRadius:    12,
    paddingVertical: 11,
    alignItems:      'center',
    justifyContent:  'center',
  },
  mapsBtnText: {
    fontSize:   14,
    fontWeight: '700',
    color:      MAP_COLORS.white,
    letterSpacing: 0.2,
  },
});
