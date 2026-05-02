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
    borderRightWidth: 1,
    borderRightColor: colours.dividerDark,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colours.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMarkText: {
    color: colours.white,
    fontSize: typography.lg,
    fontWeight: '800',
  },
  logoText: {
    color: colours.textOnDark,
    fontSize: typography.md,
    fontWeight: '700',
    lineHeight: 20,
  },
  logoSubText: {
    color: colours.textSubtle,
    fontSize: typography.xxs,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    lineHeight: 14,
  },
  divider: {
    height: 1,
    backgroundColor: colours.dividerDark,
    marginVertical: spacing.sm,
  },
  navItems: {
    flex: 1,
    gap: spacing.xs / 2,
    marginTop: spacing.sm,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    position: 'relative',
    overflow: 'hidden',
  },
  navItemActive: {
    backgroundColor: colours.primaryDark + '26',
  },
  navItemPressed: {
    backgroundColor: colours.dividerDark,
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 3,
    backgroundColor: colours.primary,
    borderRadius: 2,
  },
  navIcon: {
    marginRight: spacing.sm,
  },
  navLabel: {
    color: colours.textSubtle,
    fontSize: typography.sm,
    fontWeight: '500',
  },
  navLabelActive: {
    color: colours.primary,
    fontWeight: '600',
  },
  bottomSection: {
    marginTop: spacing.sm,
  },
  logoutLabel: {
    color: colours.error,
    fontSize: typography.sm,
    fontWeight: '500',
  },
});
