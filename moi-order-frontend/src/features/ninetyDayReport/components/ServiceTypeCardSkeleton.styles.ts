import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colours.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#e8eae9',
    ...shadows.light,
  },
  content: {
    flex: 1,
  },
});
