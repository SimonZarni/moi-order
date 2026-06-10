import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { spacing } from '@/shared/theme/spacing';

export const styles = StyleSheet.create({
  container: { width: '100%', height: 220 },
  slide: { width: '100%', height: 220, backgroundColor: colours.infoBg },
  dotsRow: {
    position: 'absolute',
    bottom: spacing.sm,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    backgroundColor: colours.textOnDark,
  },
});
