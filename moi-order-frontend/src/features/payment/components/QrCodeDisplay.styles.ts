import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import { radius } from '@/shared/theme/radius';

export const styles = StyleSheet.create({
  // ── Card shell ────────────────────────────────────────────────────────────
  card: {
    width: '100%',
    backgroundColor: colours.white,
    borderRadius: radius.xl,
    overflow: 'hidden',
    shadowColor: colours.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 6,
    alignItems: 'center',
  },

  // ── PromptPay header strip ────────────────────────────────────────────────
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
  },
  headerBrand: {
    color: colours.white,
    fontSize: typography.md,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  headerApp: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: typography.sm,
    fontWeight: '500',
  },

  // ── Amount ────────────────────────────────────────────────────────────────
  amountRow: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  amountLabel: {
    color: colours.textMuted,
    fontSize: typography.xs,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  amountValue: {
    color: colours.textOnLight,
    fontSize: typography.xxl,
    fontWeight: '700',
    letterSpacing: -0.5,
  },

  // ── QR wrapper ────────────────────────────────────────────────────────────
  qrWrapper: {
    backgroundColor: colours.white,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoOverlay: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: colours.white,
    padding: 2,
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  qrImage: {
    width: 220,
    height: 220,
  },
  qrPlaceholder: {
    width: 220,
    height: 220,
    backgroundColor: colours.inputBg,
    borderRadius: radius.md,
  },

  // ── Hint ──────────────────────────────────────────────────────────────────
  hint: {
    color: colours.textMuted,
    fontSize: typography.sm,
    textAlign: 'center',
    lineHeight: 20,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },

  // ── Countdown ─────────────────────────────────────────────────────────────
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  countdown: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textMuted,
    letterSpacing: 0.3,
  },
  countdownWarning: {
    color: colours.warning,
  },
  countdownCritical: {
    color: colours.danger,
  },

  // ── Bank info section (PromptPay image modes) ────────────────────────────
  bankInfoSection: {
    width: '100%',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.xs,
  },
  bankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  bankLabel: {
    color: colours.textMuted,
    fontSize: typography.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  bankValue: {
    color: colours.textOnLight,
    fontSize: typography.sm,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: spacing.md,
  },

  // ── Divider + actions ────────────────────────────────────────────────────
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colours.divider,
    marginTop: spacing.lg,
  },
  notifyBtn: {
    backgroundColor: colours.primary,
    borderRadius: radius.xl,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xl,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
    width: '85%',
  },
  notifyBtnDone: {
    backgroundColor: colours.success,
  },
  notifyBtnText: {
    color: colours.white,
    fontSize: typography.sm,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  downloadBtnText: {
    color: colours.textMuted,
    fontSize: typography.sm,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
