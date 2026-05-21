import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    marginBottom: spacing.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colours.backgroundDark,
    borderBottomWidth: 0,
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
    color: colours.textOnDark,
  },
  count: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
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
    fontWeight: '700',
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
    borderWidth: 1.5,
    borderColor: colours.primary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    fontSize: typography.md,
    color: colours.textOnDark,
    backgroundColor: 'rgba(255,255,255,0.1)',
    minHeight: 36,
  },
  renameAction: {
    padding: spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
