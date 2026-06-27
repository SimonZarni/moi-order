import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colours.surface,
  },
  container: {
    padding: spacing.lg,
    backgroundColor: colours.surface,
    flex: 1,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  loader: {
    marginTop: spacing.xxl,
  },
  errorBanner: {
    backgroundColor: colours.error + '18',
    color: colours.error,
    padding: spacing.md,
    borderRadius: radius.lg,
    fontSize: typography.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colours.error + '33',
  },
  title: {
    fontSize: typography.xxl,
    fontWeight: '800',
    color: colours.textOnLight,
    marginBottom: spacing.md,
    letterSpacing: -0.5,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginBottom: spacing.md,
  },
  badgeText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  businessName: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colours.textOnLight,
    marginBottom: spacing.xs,
    letterSpacing: -0.3,
  },
  meta: {
    fontSize: typography.xs,
    color: colours.textMuted,
    marginBottom: spacing.lg,
  },
  infoBox: {
    backgroundColor: colours.primary + '18',
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colours.primary + '33',
  },
  infoText: {
    fontSize: typography.sm,
    color: colours.textMuted,
    lineHeight: 22,
    fontWeight: '500',
  },
  rejectedBox: {
    backgroundColor: colours.error + '12',
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colours.error + '33',
  },
  rejectedTitle: {
    fontSize: typography.sm,
    fontWeight: '800',
    color: colours.error,
    marginBottom: spacing.xs,
  },
  rejectedNotes: {
    fontSize: typography.sm,
    color: colours.error,
    lineHeight: 20,
  },
  rejectedHelp: {
    fontSize: typography.sm,
    color: colours.textMuted,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  resubmitButton: {
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  resubmitButtonText: {
    color: colours.backgroundDark,
    fontSize: typography.md,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  contactButton: {
    borderWidth: 1.5,
    borderColor: colours.primary,
    borderRadius: radius.full,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    marginBottom: spacing.lg,
    backgroundColor: colours.primary + '12',
  },
  contactButtonText: {
    color: colours.primary,
    fontSize: typography.md,
    fontWeight: '700',
  },
  logoutButton: {
    borderWidth: 1.5,
    borderColor: colours.divider,
    borderRadius: radius.full,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  logoutText: {
    fontSize: typography.md,
    color: colours.textMuted,
    fontWeight: '600',
  },
});
