import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colours.card,
    borderTopWidth: 1,
    borderTopColor: colours.divider,
  },
  btn: {
    backgroundColor: colours.primary,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: radius.full,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: typography.xs,
    fontWeight: '800',
    color: colours.white,
    lineHeight: 16,
  },
  label: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.white,
    flex: 1,
    textAlign: 'center',
  },
  total: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.white,
  },
});
