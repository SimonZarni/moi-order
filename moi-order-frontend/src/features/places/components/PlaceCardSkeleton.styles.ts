import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';

// Must match PlaceCard.styles.ts CARD_RADIUS
const CARD_RADIUS = radius.xl + 4;

export const styles = StyleSheet.create({
  // Mirrors PlaceCard.styles.ts shadowWrap: flat top corners, rounded bottom only
  shadowWrap: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md + 2,
    borderBottomLeftRadius: CARD_RADIUS,
    borderBottomRightRadius: CARD_RADIUS,
    backgroundColor: colours.backgroundDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 9,
  },
  // Clips shimmer to the card shape — overflow:hidden lives here, not on shadowWrap
  cardClip: {
    borderBottomLeftRadius: CARD_RADIUS,
    borderBottomRightRadius: CARD_RADIUS,
    overflow: 'hidden',
  },
  // Category pill + name + city lines anchored to the bottom, mirroring the glass panel
  metaStrip: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
    gap: spacing.xs,
  },
});
