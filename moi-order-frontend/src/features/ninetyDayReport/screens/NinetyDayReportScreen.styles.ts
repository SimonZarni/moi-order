import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colours.backgroundDark,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
    minHeight: 44,
  },
  backArrow: {
    fontSize: typography.xl,
    color: colours.tertiary,
    marginRight: spacing.xs,
  },
  backLabel: {
    fontSize: typography.sm,
    color: colours.tertiary,
    fontWeight: '600',
  },
  headerTitleTh: {
    fontSize: typography.sm,
    color: colours.medium,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.xxl + 4,
    fontWeight: '900',
    color: colours.textOnDark,
    letterSpacing: -0.8,
  },
  headerSubtitle: {
    fontSize: typography.sm,
    color: colours.medium,
    marginTop: spacing.xs,
    lineHeight: 20,
  },

  // ── Body ──────────────────────────────────────────────────────────────────
  body: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  sectionLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },

  // ── States ────────────────────────────────────────────────────────────────
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  errorText: {
    fontSize: typography.md,
    color: colours.danger,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: typography.md,
    color: colours.textMuted,
    textAlign: 'center',
  },
});
