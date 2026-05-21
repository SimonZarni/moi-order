import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.lg,
    alignSelf: 'flex-start',
    minHeight: 44,
  },
  backText: {
    fontSize: typography.sm,
    color: colours.primary,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colours.textOnLight,
    marginBottom: spacing.xs,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: typography.sm,
    color: colours.textMuted,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardUploaded: {
    borderWidth: 1.5,
    borderColor: colours.success + '55',
    backgroundColor: colours.successBg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
    marginBottom: spacing.xs,
  },
  cardDesc: {
    fontSize: typography.xs,
    color: colours.textMuted,
    lineHeight: 18,
  },
  preview: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    backgroundColor: colours.surfaceMuted,
  },
  uploadButton: {
    borderWidth: 1.5,
    borderColor: colours.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
    backgroundColor: colours.primaryGlow,
  },
  uploadButtonDone: {
    borderColor: colours.success,
    backgroundColor: colours.successBg,
  },
  uploadButtonText: {
    color: colours.primary,
    fontSize: typography.sm,
    fontWeight: '700',
  },
  uploadButtonTextDone: {
    color: colours.success,
  },
  submitButton: {
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
  submitButtonDisabled: {
    opacity: 0.4,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: colours.white,
    fontSize: typography.md,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
