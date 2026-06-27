import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  // Phase card wrappers
  phaseCard: {
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    padding: spacing.md,
  },
  phaseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  phaseTag: {
    fontSize: typography.xxs,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  phaseTagPhase1: {
    backgroundColor: colours.infoBg,
    color: colours.primary,
  },
  phaseTagPhase2: {
    backgroundColor: '#ede9fe',
    color: '#5b21b6',
  },
  phaseSpacer: { height: spacing.sm },

  // Individual step row
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  stepTrack: {
    alignItems: 'center',
    width: 22,
  },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotUpcoming: {
    borderColor: colours.infoBg,
    backgroundColor: colours.backgroundLight,
  },
  stepDotActive: {
    borderColor: colours.primary,
    backgroundColor: colours.primary,
  },
  stepDotDone: {
    borderColor: colours.primary,
    backgroundColor: 'transparent',
  },
  stepLine: {
    width: 2,
    height: spacing.lg,
  },
  stepLineUpcoming: { backgroundColor: colours.infoBg },
  stepLineActive:   { backgroundColor: colours.primary },
  stepLineDone:     { backgroundColor: colours.primary },
  stepLabel: {
    flex: 1,
    paddingBottom: spacing.md,
    paddingTop: 2,
  },
  stepLabelText: {
    fontSize: typography.sm,
    fontWeight: '500',
    color: colours.textMuted,
  },
  stepLabelTextActive: {
    color: colours.textOnLight,
    fontWeight: '700',
  },
  stepLabelTextDone: {
    color: colours.tertiary,
    fontWeight: '500',
  },
  // Copy-to-clipboard section
  copyCard: {
    backgroundColor: '#f0faf4',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#c6ecd4',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: 4,
  },
  copyHint: {
    fontSize: typography.xxs,
    color: '#2d7a4a',
    fontWeight: '500',
    lineHeight: 28,
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  copyMessageText: {
    flex: 1,
    fontSize: typography.xs,
    color: colours.textOnLight,
    fontWeight: '500',
    lineHeight: 33, // ≥3× for Burmese glyphs at fontSize 11
  },
  copyBtn: {
    padding: 4,
  },
  // LINE Pay button — LINE brand green
  promptPayBtn: {
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: '#06C755',
    marginTop: spacing.sm,
  },
  promptPayBtnPressed: {
    backgroundColor: '#05a847',
  },
  promptPayText: {
    fontSize: typography.md,
    fontWeight: '800',
    color: colours.white,
    letterSpacing: 0.3,
  },
});
