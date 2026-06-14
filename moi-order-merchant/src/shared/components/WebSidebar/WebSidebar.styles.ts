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
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRightWidth: 1,
    borderRightColor: colours.dividerDark,
    zIndex: 10,
  },
  // ── Logo block ───────────────────────────────────────────────────────────────
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xs,
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colours.primary,
    overflow: 'hidden',   // clips the image to the rounded corners
  },
  logoImage: {
    width: '100%',
    height: '100%',
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
    letterSpacing: 1.4,
    lineHeight: 14,
    fontWeight: '700',
  },

  // ── Section headers ───────────────────────────────────────────────────────────
  sectionHeader: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },

  divider: {
    height: 1,
    backgroundColor: colours.dividerDark,
    marginVertical: spacing.sm,
  },
  navItems: {
    flex: 1,
    gap: 2,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  navItemActive: {
    backgroundColor: colours.primary + '25',
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
  navIcon: {},
  navLabel: {
    flex: 1,
    color: 'rgba(255,255,255,0.5)',
    fontSize: typography.sm,
    fontWeight: '500',
  },
  navLabelActive: {
    color: colours.textOnDark,
    fontWeight: '700',
  },
  // Badge on nav item
  navBadge: {
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  navBadgeText: {
    fontSize: typography.xxs,
    fontWeight: '800',
    color: colours.backgroundDark,
  },
  bottomSection: {
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colours.dividerDark,
    paddingTop: spacing.sm,
  },
  logoutLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: typography.sm,
    fontWeight: '500',
  },
  alarmLabelActive: {
    color: colours.primary,
    fontWeight: '600',
  },
});
