import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colours.backgroundDark },
  scroll: { flex: 1, backgroundColor: colours.backgroundLight },

  infoBlock: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.sm,
  },

  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },

  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  sectionLine: { flex: 1, height: 1, backgroundColor: 'rgba(0,0,0,0.07)' },

  variantCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.medium,
  },
  variantInfo: { flex: 1, gap: spacing.xs },
  variantQty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
