import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.backgroundLight,
  },
  list: {
    padding: spacing.md,
  },
  sectionHeader: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  empty: {
    textAlign: 'center',
    color: colours.medium,
    fontSize: typography.md,
    marginTop: spacing.xxl,
  },
});
