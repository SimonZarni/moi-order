import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { radius } from '../../../shared/theme/radius';
import { typography } from '../../../shared/theme/typography';

export const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  // Badge overlaid on bell icon
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: radius.full,
    backgroundColor: colours.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    // Make badge always on top
    zIndex: 1,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colours.white,
    lineHeight: 14,
  },
});
