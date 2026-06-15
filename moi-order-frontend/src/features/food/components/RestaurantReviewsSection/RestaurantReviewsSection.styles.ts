import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  section: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    fontSize: typography.md,
    fontWeight: '800',
    color: colours.textOnLight,
  },
  avgBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#fef3c7',
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  avgText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: '#92400e',
  },
  countText: {
    fontSize: typography.xs,
    color: colours.textMuted,
  },
  empty: {
    fontSize: typography.sm,
    color: colours.textMuted,
    paddingVertical: spacing.sm,
  },
  seeAllBtn: {
    marginTop: spacing.xs,
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: typography.xs,
    color: colours.primary,
    fontWeight: '700',
  },
});
