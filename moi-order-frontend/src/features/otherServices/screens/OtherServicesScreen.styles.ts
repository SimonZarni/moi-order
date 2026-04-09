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
    paddingBottom: spacing.xxl + spacing.lg,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
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
  headerTitle: {
    fontSize: typography.xxl,
    fontWeight: '900',
    color: colours.textOnDark,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: typography.sm,
    color: colours.medium,
    marginTop: spacing.xs,
  },

  // ── Body ──────────────────────────────────────────────────────────────────
  body: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -spacing.xl,
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

  // ── Service card ──────────────────────────────────────────────────────────
  serviceCard: {
    backgroundColor: colours.white,
    borderRadius: radius.xl,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: colours.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  serviceCardContent: {
    flex: 1,
  },
  serviceCardTitle: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.3,
  },
  serviceCardSubtitle: {
    fontSize: typography.sm,
    color: colours.textMuted,
    marginTop: 2,
  },
  serviceCardPrice: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.primary,
    marginTop: spacing.sm,
  },
  serviceCardArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colours.infoBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  serviceCardArrowText: {
    fontSize: typography.lg,
    color: colours.primary,
    fontWeight: '300',
  },

  // ── States ────────────────────────────────────────────────────────────────
  centered: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  errorText: {
    fontSize: typography.sm,
    color: colours.danger,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: typography.sm,
    color: colours.textMuted,
    textAlign: 'center',
  },
});
