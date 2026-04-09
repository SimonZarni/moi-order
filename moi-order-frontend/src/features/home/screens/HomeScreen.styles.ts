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
  scroll: {
    flex: 1,
  },

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    backgroundColor: colours.backgroundDark,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl + spacing.lg,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  brandLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.tertiary,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  logoutBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.ghostBorder,
    backgroundColor: colours.ghostBg,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.textOnDark,
    letterSpacing: 0.4,
  },
  heroGreeting: {
    fontSize: typography.sm,
    color: colours.medium,
    marginBottom: spacing.xs,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: colours.textOnDark,
    letterSpacing: -0.8,
    lineHeight: 40,
  },
  heroTitleAccent: {
    color: colours.tertiary,
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
    backgroundColor: colours.primary,
    borderRadius: radius.xl,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    // Shadow
    shadowColor: colours.dark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 6,
  },
  serviceCardContent: {
    flex: 1,
  },
  serviceCardBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.full,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  serviceCardBadgeText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.white,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  serviceCardTitle: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colours.white,
    letterSpacing: -0.3,
  },
  serviceCardSubtitle: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
  },
  serviceCardTypesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing.sm,
  },
  serviceCardTypeTag: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.full,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  serviceCardTypeTagText: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  serviceCardArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  serviceCardArrowText: {
    fontSize: typography.lg,
    color: colours.white,
    fontWeight: '300',
  },

  // ── Other Services card ───────────────────────────────────────────────────
  otherServicesCard: {
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
  otherServicesBadge: {
    backgroundColor: colours.infoBg,
    borderRadius: radius.full,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  otherServicesBadgeText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.primary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  otherServicesTitle: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.3,
  },
  otherServicesSubtitle: {
    fontSize: typography.sm,
    color: colours.textMuted,
    marginTop: 2,
  },
  otherServicesArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colours.infoBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  otherServicesArrowText: {
    fontSize: typography.lg,
    color: colours.primary,
    fontWeight: '300',
  },
});
