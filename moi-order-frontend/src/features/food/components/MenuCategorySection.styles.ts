import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  section: {
    backgroundColor: colours.backgroundLight,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colours.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  headerText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  itemsCard: {
    backgroundColor: colours.card,
    marginBottom: 1,
  },
  emptyText: {
    fontSize: typography.sm,
    color: colours.textMuted,
    padding: spacing.md,
    textAlign: 'center',
  },
});
