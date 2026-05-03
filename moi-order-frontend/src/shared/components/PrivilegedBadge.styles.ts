import { StyleSheet } from 'react-native';

import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

const GOLD = '#d4a017';

export const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: GOLD,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 5,
    paddingVertical: 2,
  },

  label: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
});
