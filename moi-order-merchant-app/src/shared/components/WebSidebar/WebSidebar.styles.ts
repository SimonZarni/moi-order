import { StyleSheet } from 'react-native';
import { colours } from '../../theme/colours';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import { WEB_SIDEBAR_WIDTH } from '../../constants/config';

export const styles = StyleSheet.create({
  sidebar: {
    width: WEB_SIDEBAR_WIDTH,
    backgroundColor: colours.backgroundDark,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  logoContainer: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  logoText: {
    color: colours.primary,
    fontSize: typography.xl,
    fontWeight: '700',
  },
  logoSubText: {
    color: colours.medium,
    fontSize: typography.xs,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  navItems: {
    flex: 1,
    gap: spacing.xs,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  navItemActive: {
    backgroundColor: colours.primaryDark + '33',
  },
  navIcon: {
    marginRight: spacing.sm,
  },
  navLabel: {
    color: colours.medium,
    fontSize: typography.sm,
    fontWeight: '500',
  },
  navLabelActive: {
    color: colours.primary,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.md,
  },
  logoutLabel: {
    color: colours.medium,
    fontSize: typography.sm,
    fontWeight: '500',
  },
});
