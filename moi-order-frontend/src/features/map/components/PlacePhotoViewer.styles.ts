import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },

  container: {
    flex: 1,
  },

  image: {
    flex: 1,
  },

  closeBtn: {
    position:        'absolute',
    top:             56,
    right:           20,
    width:           36,
    height:          36,
    borderRadius:    18,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems:      'center',
    justifyContent:  'center',
    zIndex:          10,
  },
  closeBtnText: {
    color:      '#fff',
    fontSize:   16,
    fontWeight: '600',
  },

  counter: {
    position:   'absolute',
    top:        60,
    left:       0,
    right:      0,
    alignItems: 'center',
  },
  counterText: {
    color:      'rgba(255,255,255,0.7)',
    fontSize:   13,
    fontWeight: '500',
  },

  dots: {
    position:       'absolute',
    bottom:         52,
    left:           0,
    right:          0,
    flexDirection:  'row',
    justifyContent: 'center',
    gap:            6,
  },
  dot: {
    width:           6,
    height:          6,
    borderRadius:    3,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    width:           8,
    height:          8,
    borderRadius:    4,
    backgroundColor: '#fff',
  },
});
