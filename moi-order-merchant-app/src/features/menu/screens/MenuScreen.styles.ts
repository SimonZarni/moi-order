import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

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
  addButton: {
    backgroundColor: colours.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  addButtonText: {
    color: colours.white,
    fontSize: typography.md,
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    color: colours.medium,
    fontSize: typography.md,
    marginTop: spacing.xxl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colours.textOnLight + '88',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colours.card,
    borderRadius: radius.sheet,
    padding: spacing.lg,
  },
  modalTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colours.textOnLight,
    marginBottom: spacing.md,
  },
  modalInput: {
    backgroundColor: colours.backgroundLight,
    borderWidth: 1,
    borderColor: colours.divider,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: typography.md,
    color: colours.textOnLight,
    marginBottom: spacing.md,
    minHeight: 44,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colours.divider,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  cancelText: {
    color: colours.textMuted,
    fontSize: typography.md,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colours.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  confirmText: {
    color: colours.white,
    fontSize: typography.md,
    fontWeight: '600',
  },
});
