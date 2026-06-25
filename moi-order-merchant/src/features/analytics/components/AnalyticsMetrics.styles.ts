import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tile: {
    flex: 1,
    minWidth: 100,
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colours.divider,
    padding: spacing.md,
    gap: 3,
  },
  tilePending: {
    borderColor: colours.warning + '55',
    backgroundColor: colours.warningBg,
  },
  pendingDot: {
    width: 7,
    height: 7,
    borderRadius: radius.full,
    backgroundColor: colours.warning,
    marginBottom: 4,
  },
  tileValue: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.5,
  },
  tileLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tileSub: {
    fontSize: typography.xxs,
    color: colours.textSubtle,
  },
});
