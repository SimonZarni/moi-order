import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import { TAB_BAR_CLEARANCE } from '@/shared/components/FloatingTabBar/FloatingTabBar.styles';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
  },

  // ── Body (overlaps HeroHeader bottom via negative marginTop) ───────────────
  body: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    marginTop: -spacing.xl,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingBottom: TAB_BAR_CLEARANCE,
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
    ...shadows.light,
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
