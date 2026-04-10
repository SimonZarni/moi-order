import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import { TAB_BAR_CLEARANCE } from '@/shared/components/FloatingTabBar/FloatingTabBar.styles';

// Accent matches the teal card variant used on the Home screen for Other Services
const TEAL = '#6b9e94';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    backgroundColor: colours.backgroundDark,
    paddingHorizontal: spacing.xl + spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    overflow: 'hidden',
    minHeight: 180,
  },

  // Decorative orbs
  orbLarge: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: TEAL,
    opacity: 0.07,
    top: -70,
    right: -50,
  },
  orbSmall: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colours.primary,
    opacity: 0.06,
    bottom: 10,
    left: -20,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.38)',
    borderRadius: radius.full,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    minHeight: 36,
    marginBottom: spacing.md,
  },
  backArrow: {
    fontSize: 22,
    color: colours.tertiary,
    lineHeight: 26,
    fontWeight: '300',
  },
  backLabel: {
    fontSize: typography.sm,
    color: colours.tertiary,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  headerEyebrow: {
    fontSize: 9,
    fontWeight: '700',
    color: TEAL,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: colours.textOnDark,
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  headerSubtitle: {
    fontSize: typography.xs,
    color: colours.medium,
    marginTop: 4,
    lineHeight: 18,
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
