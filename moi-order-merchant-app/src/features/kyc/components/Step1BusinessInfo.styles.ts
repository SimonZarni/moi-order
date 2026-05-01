import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colours.textOnLight,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textOnLight,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colours.card,
    borderWidth: 1,
    borderColor: colours.divider,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: typography.md,
    color: colours.textOnLight,
    marginBottom: spacing.md,
    minHeight: 44,
  },
  textArea: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  typeChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.divider,
    backgroundColor: colours.card,
    minHeight: 44,
    justifyContent: 'center',
  },
  typeChipSelected: {
    borderColor: colours.primary,
    backgroundColor: colours.primaryLight,
  },
  typeChipText: {
    fontSize: typography.sm,
    color: colours.textMuted,
  },
  typeChipTextSelected: {
    color: colours.primaryDark,
    fontWeight: '600',
  },
  button: {
    backgroundColor: colours.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colours.white,
    fontSize: typography.md,
    fontWeight: '600',
  },
});
