import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.xxl,
    fontWeight: '700',
    color: colours.textOnLight,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  body: {
    fontSize: typography.md,
    color: colours.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colours.primaryLight,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  infoText: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.primaryDark,
    lineHeight: 20,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: colours.divider,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    minHeight: 44,
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: typography.md,
    color: colours.textMuted,
  },
});
