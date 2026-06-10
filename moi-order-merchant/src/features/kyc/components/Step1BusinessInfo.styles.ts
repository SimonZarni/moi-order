import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colours.textOnDark,
    marginBottom: spacing.lg,
    letterSpacing: -0.4,
  },
  label: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  labelOptional: {
    fontWeight: '500',
    color: 'rgba(255,255,255,0.25)',
    fontSize: typography.xs,
    textTransform: 'none',
    letterSpacing: 0,
  },
  input: {
    backgroundColor: colours.backgroundDark,
    borderWidth: 1,
    borderColor: colours.dividerDark,
    borderRadius: radius.lg,
    padding: spacing.md,
    fontSize: typography.md,
    color: colours.textOnDark,
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
    borderWidth: 1,
    borderColor: colours.dividerDark,
    backgroundColor: colours.backgroundDark,
    minHeight: 44,
    justifyContent: 'center',
  },
  typeChipSelected: {
    borderColor: colours.primary,
    backgroundColor: colours.primary + '18',
  },
  typeChipText: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.4)',
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
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colours.backgroundDark,
    fontSize: typography.md,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
