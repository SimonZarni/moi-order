import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colours.surfaceMuted,
  },

  // ── Header ───────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colours.surface,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  greeting: {
    fontSize: typography.xs,
    color: colours.textMuted,
    fontWeight: '500',
    marginBottom: 2,
  },
  title: {
    fontSize: typography.display,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.8,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  date: {
    fontSize: typography.xs,
    color: colours.textMuted,
    fontWeight: '500',
  },
  pendingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colours.warning + '18',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colours.warning + '55',
  },
  pendingPillActive: {
    backgroundColor: colours.warning + '33',
    borderColor: colours.warning,
  },
  pendingDot: {
    width: 7,
    height: 7,
    borderRadius: radius.full,
    backgroundColor: colours.warning,
  },
  pendingDotActive: {
    backgroundColor: colours.warning,
  },
  pendingText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.warning,
  },
  pendingTextActive: {
    color: colours.warning,
  },

  // ── Scroll ────────────────────────────────────────────────────────────────
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  // ── Two-column desktop layout ─────────────────────────────────────────────
  twoCol: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  colLeft: {
    flex: 1.6,
  },
  colRight: {
    flex: 1,
  },

  // ── Loading skeleton ──────────────────────────────────────────────────────
  skeletonPad: {
    padding: spacing.lg,
    gap: spacing.md,
  },
});
