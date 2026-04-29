import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    backgroundColor: 'rgba(34, 78, 74, 0.08)',
    borderRadius: radius.full,
    padding: 4,
    gap: 4,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: colours.primary,
  },
  tabText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textMuted,
  },
  tabTextActive: {
    color: colours.white,
  },
});
