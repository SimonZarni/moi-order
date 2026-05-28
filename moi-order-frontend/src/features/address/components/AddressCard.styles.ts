import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: colours.primary,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colours.infoBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 2,
  },
  labelChip: {
    backgroundColor: colours.infoBg,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  labelText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.primary,
    letterSpacing: 1,
  },
  defaultBadge: {
    backgroundColor: colours.success + '22',
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  defaultText: {
    fontSize: typography.xxs,
    fontWeight: '600',
    color: colours.success,
  },
  address: {
    fontSize: typography.sm,
    fontWeight: '500',
    color: colours.textOnLight,
    lineHeight: 18,
  },
  secondary: {
    fontSize: typography.xs,
    color: colours.textMuted,
    lineHeight: 16,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colours.divider,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
    marginTop: 8,
  },
  radioSelected: {
    borderColor: colours.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colours.primary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginLeft: spacing.sm,
    marginTop: 4,
  },
  actionBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minHeight: 44,
    justifyContent: 'center',
  },
  actionEdit: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.primary,
  },
  actionDelete: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.destructive,
  },
});
