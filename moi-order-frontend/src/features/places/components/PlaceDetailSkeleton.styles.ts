import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
  },
  scroll: {
    paddingBottom: spacing.xxl,
  },

  // ── Identity card — mirrors PlaceDetailScreen.styles identityCard ─────────
  identityCard: {
    marginHorizontal: spacing.md,
    marginTop: -spacing.xl, // overlaps hero bottom, same as real screen
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.heavy,
  },

  // ── Section card — mirrors sectionCard ───────────────────────────────────
  sectionCard: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.light,
  },
  sectionRows: {
    gap: spacing.sm,
  },
});
