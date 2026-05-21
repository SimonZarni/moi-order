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
    zIndex: 10,
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
    width: 42,
    height: 42,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colours.primary,
    shadowColor: colours.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  logoText: {
    color: colours.textOnDark,
    fontSize: typography.md,
    fontWeight: '800',
    letterSpacing: -0.3,
    lineHeight: 20,
  },
  logoSubText: {
    color: colours.primary,
    fontSize: typography.xxs,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    lineHeight: 14,
    fontWeight: '700',
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
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm + 4,
    borderRadius: radius.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  navItemActive: {
    backgroundColor: colours.primary + '1A',
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
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  navIcon: {
    marginRight: spacing.sm,
  },
  navLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: typography.sm,
    fontWeight: '500',
  },
  navLabelActive: {
    color: colours.primary,
    fontWeight: '700',
  },
  bottomSection: {
    marginTop: spacing.xs,
  },
  logoutLabel: {
    color: colours.error,
    fontSize: typography.sm,
    fontWeight: '600',
  },
});
