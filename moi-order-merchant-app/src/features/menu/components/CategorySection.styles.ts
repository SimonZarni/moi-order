import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colours.card,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 44,
  },
  title: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  count: {
    fontSize: typography.sm,
    color: colours.textMuted,
  },
  deleteButton: {
    padding: spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  items: {
    paddingHorizontal: spacing.md,
  },
  empty: {
    fontSize: typography.sm,
    color: colours.medium,
    paddingVertical: spacing.md,
    textAlign: 'center',
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
    minHeight: 44,
  },
  addItemText: {
    fontSize: typography.sm,
    color: colours.primary,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  renameRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  renameInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colours.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    fontSize: typography.md,
    color: colours.textOnLight,
    backgroundColor: colours.backgroundLight,
    minHeight: 36,
  },
  renameAction: {
    padding: spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
