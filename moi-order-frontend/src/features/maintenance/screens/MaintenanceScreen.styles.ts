import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import { radius } from '@/shared/theme/radius';

const BG       = '#0d1f1d';
const CARD_BG  = 'rgba(255,255,255,0.06)';
const BORDER   = 'rgba(255,255,255,0.10)';
const RING     = colours.primary;

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Animated pulse rings ─────────────────────────────────────────────────────
  ringOuter: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: RING,
    opacity: 0.08,
  },
  ringInner: {
    position: 'absolute',
    width: 152,
    height: 152,
    borderRadius: 76,
    backgroundColor: RING,
    opacity: 0.14,
  },
  iconCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: colours.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },

  // ── Text block ────────────────────────────────────────────────────────────────
  textBlock: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colours.white,
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.md,
    fontWeight: '600',
    color: colours.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  details: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    lineHeight: 22,
  },

  // ── Timer card ────────────────────────────────────────────────────────────────
  timerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: 32,
  },
  timerText: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.6)',
  },
  timerValue: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.white,
  },

  // ── Retry button ─────────────────────────────────────────────────────────────
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colours.primary,
    borderRadius: radius.xl,
    paddingHorizontal: 32,
    paddingVertical: 14,
    marginBottom: 48,
  },
  retryBtnText: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.white,
    letterSpacing: 0.3,
  },

  // ── Bottom branding ───────────────────────────────────────────────────────────
  branding: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
    gap: 4,
  },
  brandingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colours.primary,
    marginBottom: 4,
  },
  brandingName: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.25)',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  brandingSub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.15)',
    letterSpacing: 1,
  },
});
