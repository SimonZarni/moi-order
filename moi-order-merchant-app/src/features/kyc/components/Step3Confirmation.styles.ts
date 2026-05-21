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
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: colours.primaryGlow,
    borderWidth: 2,
    borderColor: colours.primary + '44',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.xxl,
    fontWeight: '800',
    color: colours.textOnLight,
    textAlign: 'center',
    marginBottom: spacing.md,
    letterSpacing: -0.5,
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
    backgroundColor: colours.primaryGlow,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colours.primary + '33',
    width: '100%',
  },
  infoText: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.primaryDark,
    lineHeight: 20,
    fontWeight: '500',
  },
  logoutButton: {
    borderWidth: 1.5,
    borderColor: colours.divider,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: typography.md,
    color: colours.textMuted,
    fontWeight: '600',
  },
});
