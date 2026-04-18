import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';

export const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colours.card,
    overflow: 'hidden',
    ...shadows.medium,
  },
  body: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
});
