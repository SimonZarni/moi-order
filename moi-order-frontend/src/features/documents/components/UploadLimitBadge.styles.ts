import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },

  label: {
    fontSize: typography.xs,
    color: colours.textMuted,
    fontWeight: '500',
  },
  labelRed: {
    color: colours.danger,
  },

  count: {
    fontWeight: '700',
    color: colours.textMuted,
  },
  countRed: {
    color: colours.danger,
  },

  infoBtn: {
    padding: 2,
    minWidth: 24,
    minHeight: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Tooltip modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  tooltip: {
    backgroundColor: colours.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxWidth: 260,
  },
  tooltipText: {
    fontSize: typography.sm,
    color: colours.textMuted,
    textAlign: 'center',
  },
});
