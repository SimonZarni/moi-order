import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { spacing } from '@/shared/theme/spacing';

export const styles = StyleSheet.create({
  // Dark background matches hero so the safe-area top blends with the shimmer
  container: {
    flex: 1,
    backgroundColor: colours.dark,
  },

  // ── Body — mirrors PlaceDetailScreen.styles.ts body ──────────────────────
  body: {
    backgroundColor: colours.white,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  infoChipsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colours.divider,
    marginVertical: spacing.md,
  },
  descRows: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  galleryHeader: {
    marginBottom: spacing.sm,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
