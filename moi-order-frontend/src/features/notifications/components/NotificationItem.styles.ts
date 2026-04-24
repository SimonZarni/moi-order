import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
    backgroundColor: colours.card,
  },

  rowUnread: {
    backgroundColor: colours.infoBg,
  },

  indicator: {
    width: 20,
    alignItems: 'center',
    paddingTop: 4,
    marginRight: spacing.sm,
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colours.tertiary,
  },

  content: {
    flex: 1,
    marginRight: spacing.sm,
  },

  title: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textOnLight,
    marginBottom: 3,
    lineHeight: 20,
  },

  titleUnread: {
    fontWeight: '700',
    color: colours.primary,
  },

  body: {
    fontSize: typography.xs,
    color: colours.medium,
    lineHeight: 18,
    marginBottom: 4,
  },

  time: {
    fontSize: typography.xxs,
    color: colours.textMuted,
    lineHeight: 16,
  },

  deleteBtn: {
    paddingTop: 2,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
