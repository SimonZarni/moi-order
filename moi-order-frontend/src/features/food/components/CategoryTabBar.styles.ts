import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colours.card,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
    zIndex: 10,
  },
  scrollContent: {
    paddingHorizontal: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    position: 'relative',
    minWidth: 80,
  },
  tabLabel: {
    fontSize: typography.sm,
    fontWeight: '500',
    color: colours.textMuted,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: colours.primary,
    fontWeight: '700',
  },
  activeBar: {
    position: 'absolute',
    bottom: 0,
    left: spacing.md,
    right: spacing.md,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: colours.primary,
  },
});
