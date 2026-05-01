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
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.xxl,
    fontWeight: '700',
    color: colours.textOnLight,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sm,
    color: colours.textMuted,
    marginBottom: spacing.xl,
  },
  errorBanner: {
    backgroundColor: colours.error + '1A',
    color: colours.error,
    padding: spacing.md,
    borderRadius: radius.md,
    fontSize: typography.sm,
    marginBottom: spacing.md,
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
  button: {
    backgroundColor: colours.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colours.white,
    fontSize: typography.md,
    fontWeight: '600',
  },
  link: {
    color: colours.primary,
    fontSize: typography.sm,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    minHeight: 44,
    textAlignVertical: 'center',
  },
});
