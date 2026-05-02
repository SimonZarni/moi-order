import { Dimensions, StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const TRACK_WIDTH  = Dimensions.get('window').width - spacing.md * 2 - spacing.md * 2;
export const THUMB_SIZE   = 52;

export const styles = StyleSheet.create({
  track: {
    height: THUMB_SIZE + 8,
    borderRadius: radius.full,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 4,
  },
  trackDisabled: {
    opacity: 0.45,
  },
  trackLabel: {
    position: 'absolute',
    alignSelf: 'center',
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.white,
    letterSpacing: 0.3,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#15803d',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});
