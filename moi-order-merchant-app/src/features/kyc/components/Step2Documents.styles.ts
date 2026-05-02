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
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colours.textOnLight,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sm,
    color: colours.textMuted,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colours.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colours.divider,
  },
  cardUploaded: {
    borderColor: colours.success,
    backgroundColor: colours.infoBg,
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
    fontWeight: '600',
    color: colours.textOnLight,
    marginBottom: spacing.xs,
  },
  cardDesc: {
    fontSize: typography.xs,
    color: colours.textMuted,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: colours.primary,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  uploadButtonDone: {
    borderColor: colours.success,
  },
  uploadButtonText: {
    color: colours.primary,
    fontSize: typography.sm,
    fontWeight: '600',
  },
  uploadButtonTextDone: {
    color: colours.success,
  },
  submitButton: {
    backgroundColor: colours.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitButtonText: {
    color: colours.white,
    fontSize: typography.md,
    fontWeight: '600',
  },
});
