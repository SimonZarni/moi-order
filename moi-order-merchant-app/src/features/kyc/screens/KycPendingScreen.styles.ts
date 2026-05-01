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
    padding: spacing.lg,
  },
  loader: {
    marginTop: spacing.xxl,
  },
  errorBanner: {
    backgroundColor: colours.error + '1A',
    color: colours.error,
    padding: spacing.md,
    borderRadius: radius.md,
    fontSize: typography.sm,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.xxl,
    fontWeight: '700',
    color: colours.textOnLight,
    marginBottom: spacing.md,
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
    fontWeight: '600',
    color: colours.textOnLight,
  },
  businessName: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: colours.textOnLight,
    marginBottom: spacing.sm,
  },
  meta: {
    fontSize: typography.xs,
    color: colours.textMuted,
    marginBottom: spacing.lg,
  },
  infoBox: {
    backgroundColor: colours.primaryLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  infoText: {
    fontSize: typography.sm,
    color: colours.primaryDark,
    lineHeight: 20,
  },
  rejectedBox: {
    backgroundColor: colours.error + '11',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  rejectedTitle: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.error,
    marginBottom: spacing.xs,
  },
  rejectedNotes: {
    fontSize: typography.sm,
    color: colours.error,
    lineHeight: 20,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: colours.divider,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  logoutText: {
    fontSize: typography.md,
    color: colours.textMuted,
  },
});
