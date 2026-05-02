import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textOnLight,
  },
  stars: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  input: {
    backgroundColor: colours.backgroundLight,
    borderRadius: radius.lg,
    padding: spacing.md,
    fontSize: typography.sm,
    color: colours.textOnLight,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colours.divider,
  },
});
