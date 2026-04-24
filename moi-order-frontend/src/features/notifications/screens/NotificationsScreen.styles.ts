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

  // ── Hero header ───────────────────────────────────────────────────────────
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },

  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backLabel: {
    fontSize: 22,
    color: colours.textOnDark,
    fontWeight: '600',
  },

  heroTitle: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colours.textOnDark,
    letterSpacing: -0.3,
    lineHeight: 28,
  },

  // ── Body ──────────────────────────────────────────────────────────────────
  body: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    marginTop: -spacing.xl,
    overflow: 'hidden',
  },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },

  actionText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.tertiary,
    letterSpacing: 0.2,
    lineHeight: 20,
  },

  actionDanger: {
    color: colours.danger,
  },

  emptyText: {
    textAlign: 'center',
    color: colours.textMuted,
    fontSize: typography.sm,
    marginTop: spacing.xl * 2,
    lineHeight: 22,
  },
});
