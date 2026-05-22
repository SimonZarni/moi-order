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
    color: colours.textOnDark,
    marginBottom: spacing.xs,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colours.backgroundMid,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colours.dividerDark,
  },
  cardUploaded: {
    borderWidth: 1.5,
    borderColor: colours.success + '55',
    backgroundColor: colours.success + '0f',
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
    color: colours.textOnDark,
    marginBottom: spacing.xs,
  },
  cardDesc: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 18,
  },
  preview: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    backgroundColor: colours.backgroundDark,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: colours.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
    backgroundColor: colours.primary + '18',
  },
  uploadButtonDone: {
    borderColor: colours.success,
    backgroundColor: colours.success + '15',
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
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitButtonText: {
    color: colours.backgroundDark,
    fontSize: typography.md,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
