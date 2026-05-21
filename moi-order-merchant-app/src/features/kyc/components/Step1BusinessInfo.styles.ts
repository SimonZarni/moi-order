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
    fontSize: typography.xl,
    fontWeight: '800',
    color: colours.textOnLight,
    marginBottom: spacing.lg,
    letterSpacing: -0.4,
  },
  label: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnLight,
    marginBottom: spacing.xs,
  },
  labelOptional: {
    fontWeight: '500',
    color: colours.textMuted,
    fontSize: typography.xs,
  },
  input: {
    backgroundColor: colours.surfaceMuted,
    borderWidth: 1.5,
    borderColor: colours.divider,
    borderRadius: radius.lg,
    padding: spacing.md,
    fontSize: typography.md,
    color: colours.textOnLight,
    marginBottom: spacing.md,
    minHeight: 52,
  },
  textArea: {
    minHeight: 96,
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
    borderWidth: 1.5,
    borderColor: colours.divider,
    backgroundColor: colours.surfaceMuted,
    minHeight: 44,
    justifyContent: 'center',
  },
  typeChipSelected: {
    borderColor: colours.primary,
    backgroundColor: colours.primaryGlow,
  },
  typeChipText: {
    fontSize: typography.sm,
    color: colours.textMuted,
    fontWeight: '600',
  },
  typeChipTextSelected: {
    color: colours.primary,
    fontWeight: '700',
  },
  button: {
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    marginTop: spacing.md,
    shadowColor: colours.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: colours.white,
    fontSize: typography.md,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
