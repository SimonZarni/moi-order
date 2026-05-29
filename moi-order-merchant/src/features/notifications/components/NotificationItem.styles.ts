import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    backgroundColor: colours.surface,
  },
  rowUnread: {
    backgroundColor: colours.primaryBg,
  },
  rowPressed: {
    backgroundColor: colours.surfaceMuted,
  },

  // Unread indicator dot
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colours.primary,
    marginTop: 6,
    flexShrink: 0,
  },
  dotRead: {
    backgroundColor: 'transparent',
  },

  // Icon badge
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // Text block
  textBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  titleRead: {
    fontWeight: '500',
    color: colours.textMuted,
  },
  body: {
    fontSize: typography.xs,
    color: colours.textMuted,
    lineHeight: 18,
  },
  time: {
    fontSize: typography.xxs,
    color: colours.textSubtle,
    marginTop: 2,
  },
});
