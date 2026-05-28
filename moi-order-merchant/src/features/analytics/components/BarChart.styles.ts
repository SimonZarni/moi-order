import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { typography } from '../../../shared/theme/typography';

export const styles = StyleSheet.create({
  root: {
    position: 'relative',
  },

  // Faint horizontal guide lines sit behind the bars
  trackArea: {
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

  // Row of bar columns — bottom-aligned so bars all grow from the same baseline
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },

  // The fixed-height slot inside which the bar grows from the bottom
  trackSlot: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  barFill: {
    width: '55%',
    minWidth: 28,
    maxWidth: 48,
  },

  // Value label — positioned absolutely just above the bar using `bottom`
  valueLabel: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: '800',
    color: colours.textOnLight,
    textAlign: 'center',
  },
  emptyBar: {
    position: 'absolute',
    fontSize: typography.xs,
    color: colours.textSubtle,
  },

  // Period label + sublabel below the bar
  barLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colours.textOnLight,
    marginTop: 6,
    textAlign: 'center',
  },
  barSublabel: {
    fontSize: 10,
    color: colours.textSubtle,
    textAlign: 'center',
    marginTop: 1,
  },

  emptyMessage: {
    textAlign: 'center',
    fontSize: typography.xs,
    color: colours.textSubtle,
    marginTop: 8,
  },
});
