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
    backgroundColor: colours.primary + '18',
    borderWidth: 2,
    borderColor: colours.primary + '44',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.xxl,
    fontWeight: '800',
    color: colours.textOnDark,
    textAlign: 'center',
    marginBottom: spacing.md,
    letterSpacing: -0.5,
  },
  body: {
    fontSize: typography.md,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colours.primary + '18',
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
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 20,
    fontWeight: '500',
  },
  logoutButton: {
    borderWidth: 1.5,
    borderColor: colours.dividerDark,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: typography.md,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
  },
});
