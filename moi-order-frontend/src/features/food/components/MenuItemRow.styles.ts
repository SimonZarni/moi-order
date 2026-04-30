import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  photo: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    backgroundColor: colours.infoBg,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: typography.md,
    fontWeight: '600',
    color: colours.textOnLight,
    lineHeight: 22,
  },
  description: {
    fontSize: typography.xs,
    color: colours.medium,
    lineHeight: 17,
    marginTop: 2,
  },
  price: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.primary,
    marginTop: spacing.xs,
  },
  unavailable: {
    opacity: 0.45,
  },
  unavailableLabel: {
    fontSize: typography.xxs,
    color: colours.textMuted,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  controlBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colours.primary,
  },
  controlBtnMinus: {
    backgroundColor: colours.infoBg,
  },
  controlBtnText: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colours.white,
    lineHeight: 22,
  },
  controlBtnTextMinus: {
    color: colours.primary,
  },
  quantity: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
    minWidth: 20,
    textAlign: 'center',
  },
});
