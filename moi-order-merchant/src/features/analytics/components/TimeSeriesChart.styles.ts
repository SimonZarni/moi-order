import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

export const styles = StyleSheet.create({
  root: {
    gap: spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.xs,
    alignItems: 'flex-end',
    gap: 2,
  },

  // Guide lines behind bars
  guideContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  guideLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colours.divider,
  },

  // Each bar column
  barCol: {
    alignItems: 'center',
    gap: 4,
    minWidth: 28,
  },

  // The track slot that sizes the bar + value label
  trackSlot: {
    width: '100%',
    justifyContent: 'flex-end',
    position: 'relative',
  },

  barFill: {
    width: '75%',
    alignSelf: 'center',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    minHeight: 2,
  },

  valueLabel: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    fontWeight: '700',
    color: colours.textMuted,
  },

  barLabel: {
    fontSize: 9,
    color: colours.textSubtle,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Section label (Revenue / Orders)
  sectionLabel: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  emptyMessage: {
    fontSize: typography.xs,
    color: colours.textSubtle,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
