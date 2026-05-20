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
    paddingHorizontal: spacing.sm + 4,
    borderRightWidth: 1,
    borderRightColor: colours.dividerDark,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colours.dividerDark,
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  logoText: {
    color: colours.textOnDark,
    fontSize: typography.md,
    fontWeight: '800',
    letterSpacing: -0.3,
    lineHeight: 20,
  },
  logoSubText: {
    color: colours.textSubtle,
    fontSize: typography.xxs,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    lineHeight: 14,
  },
  divider: {
    height: 1,
    backgroundColor: colours.dividerDark,
    marginVertical: spacing.xs,
  },
  navItems: {
    flex: 1,
    gap: 2,
    marginTop: spacing.xs,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm + 4,
    borderRadius: radius.md,
    position: 'relative',
    overflow: 'hidden',
  },
  navItemActive: {
    backgroundColor: colours.primary + '22',
  },
  navItemPressed: {
    backgroundColor: colours.dividerDark,
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colours.primary,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
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
    marginTop: spacing.xs,
  },
  logoutLabel: {
    color: colours.error,
    fontSize: typography.sm,
    fontWeight: '500',
  },
});
