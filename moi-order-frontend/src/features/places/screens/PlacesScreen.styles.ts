import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  headerContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colours.backgroundLight,
  },
  headerSub: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.tertiary,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: typography.xxl,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.5,
  },

  // ── List ──────────────────────────────────────────────────────────────────
  list: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },

  // ── States ────────────────────────────────────────────────────────────────
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colours.backgroundLight,
  },
  errorText: {
    fontSize: typography.md,
    color: colours.danger,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
});
