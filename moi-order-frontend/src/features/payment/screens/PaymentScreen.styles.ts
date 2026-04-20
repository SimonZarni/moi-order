import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import { radius } from '@/shared/theme/radius';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colours.backgroundDark,
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.xs,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 44,
    alignSelf: 'flex-start',
  },
  backArrow: {
    color: colours.tertiary,
    fontSize: typography.xl,
    lineHeight: 26,
  },
  backLabel: {
    color: colours.tertiary,
    fontSize: typography.md,
  },
  headerTitle: {
    color: colours.textOnDark,
    fontSize: typography.xxl,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginTop: spacing.sm,
  },
  headerSubtitle: {
    color: colours.textMuted,
    fontSize: typography.md,
  },

  // ── Body ─────────────────────────────────────────────────────────────────
  body: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    marginTop: -spacing.xl,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Loading ──────────────────────────────────────────────────────────────
  loadingText: {
    color: colours.textMuted,
    fontSize: typography.md,
    marginTop: spacing.md,
  },

  // ── Waiting indicator ────────────────────────────────────────────────────
  waitingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colours.infoBg,
    borderRadius: radius.full,
  },
  waitingDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colours.tertiary,
  },
  waitingText: {
    color: colours.tertiary,
    fontSize: typography.sm,
  },

  // ── Success ──────────────────────────────────────────────────────────────
  successContainer: {
    alignItems: 'center',
    gap: spacing.md,
  },
  successIcon: {
    fontSize: 56,
  },
  successTitle: {
    color: colours.textOnLight,
    fontSize: typography.xl,
    fontWeight: '700',
    textAlign: 'center',
  },
  successSubtitle: {
    color: colours.textMuted,
    fontSize: typography.md,
    textAlign: 'center',
    lineHeight: 22,
  },

  // ── Failure ──────────────────────────────────────────────────────────────
  failureContainer: {
    alignItems: 'center',
    gap: spacing.md,
  },
  failureIcon: {
    fontSize: 56,
  },
  failureTitle: {
    color: colours.textOnLight,
    fontSize: typography.xl,
    fontWeight: '700',
    textAlign: 'center',
  },
  failureSubtitle: {
    color: colours.textMuted,
    fontSize: typography.md,
    textAlign: 'center',
    lineHeight: 22,
  },

  // ── Button ────────────────────────────────────────────────────────────────
  btn: {
    backgroundColor: colours.primary,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  btnText: {
    color: colours.textOnDark,
    fontSize: typography.md,
    fontWeight: '600',
  },

  // ── Expired QR ───────────────────────────────────────────────────────────
  expiredContainer: {
    alignItems: 'center',
    gap: spacing.md,
  },
  expiredTitle: {
    color: colours.textOnLight,
    fontSize: typography.xl,
    fontWeight: '700',
    textAlign: 'center',
  },
  expiredSubtitle: {
    color: colours.textMuted,
    fontSize: typography.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  refreshBtn: {
    backgroundColor: colours.primary,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  refreshBtnText: {
    color: colours.textOnDark,
    fontSize: typography.md,
    fontWeight: '600',
  },

  // ── Pay Later (ghost) ─────────────────────────────────────────────────────
  payLaterBtn: {
    borderWidth: 1,
    borderColor: colours.textMuted,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  payLaterBtnText: {
    color: colours.textMuted,
    fontSize: typography.md,
    fontWeight: '600',
  },
});
