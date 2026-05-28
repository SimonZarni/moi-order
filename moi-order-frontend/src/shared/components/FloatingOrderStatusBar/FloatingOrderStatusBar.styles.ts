import { StyleSheet } from 'react-native';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const STATUS_DOT_COLOURS: Record<string, string> = {
  order_placed:          '#f59e0b',
  waiting_for_payment:   '#f59e0b',
  payment_confirmed:     '#f59e0b',
  preparing_food:        '#f97316',
  waiting_for_delivery:  '#06b6d4',
  delivery_on_the_way:   '#10b981',
  delivered:             '#10b981',
};

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left:     spacing.md,
    right:    spacing.md,
    // bottom is set dynamically in the component to account for safe area insets
    zIndex:   999,
  },
  bar: {
    flexDirection:    'row',
    alignItems:       'center',
    backgroundColor:  'rgba(18, 24, 28, 0.96)',
    borderRadius:     radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical:  spacing.sm,
    gap:              spacing.sm,
    shadowColor:      '#000',
    shadowOffset:     { width: 0, height: 4 },
    shadowOpacity:    0.35,
    shadowRadius:     12,
    elevation:        12,
    borderWidth:      1,
    borderColor:      'rgba(255,255,255,0.08)',
  },
  dot: {
    width:        10,
    height:       10,
    borderRadius: 5,
  },
  textGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing.xs,
    overflow:      'hidden',
  },
  statusLabel: {
    fontSize:   typography.sm,
    fontWeight: '700',
    color:      '#ffffff',
    flexShrink: 0,
  },
  separator: {
    fontSize:   typography.sm,
    color:      'rgba(255,255,255,0.35)',
    flexShrink: 0,
  },
  restaurantName: {
    fontSize:   typography.sm,
    color:      'rgba(255,255,255,0.55)',
    flexShrink: 1,
  },
});
