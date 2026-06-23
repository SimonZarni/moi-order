import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.backgroundLight },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  backBtnText: {
    fontSize: typography.sm,
    color: colours.primary,
    fontWeight: '600',
  },

  title: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.5,
    lineHeight: 60,
    marginBottom: spacing.md,
  },

  // ── Day card ──────────────────────────────────────────────────────────────
  dayCard: {
    backgroundColor: colours.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colours.divider,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colours.surfaceMuted,
  },
  dayName: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  dayHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  closedBadge: {
    fontSize: typography.xxs,
    fontWeight: '600',
    color: colours.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ── Sessions ──────────────────────────────────────────────────────────────
  sessionsContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  sessionRow: {
    marginBottom: spacing.sm,
  },
  sessionLabel: {
    marginBottom: spacing.xs,
  },
  sessionLabelText: {
    fontSize: typography.xxs,
    fontWeight: '600',
    color: colours.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sessionInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  timeInput: {
    flex: 1,
    backgroundColor: colours.surfaceMuted,
    borderWidth: 1,
    borderColor: colours.divider,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: typography.sm,
    color: colours.textOnLight,
    minHeight: 40,
    textAlign: 'center',
  },
  timeSep: {
    fontSize: typography.sm,
    color: colours.textSubtle,
    fontWeight: '600',
    paddingHorizontal: spacing.xs,
  },
  removeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sessionMenuRow: {
    marginTop: spacing.xs,
  },
  sessionMenuToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  sessionMenuToggleLabel: {
    flex: 1,
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.textOnLight,
  },
  sessionMenuToggleDisabledHint: {
    fontSize: typography.xxs,
    color: colours.textSubtle,
    marginBottom: spacing.xs,
    marginLeft: 22,
  },

  editMenuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colours.primary,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  editMenuBtnText: {
    fontSize: typography.xs,
    color: colours.primary,
    fontWeight: '600',
  },
  editMenuCount: {
    fontSize: typography.xxs,
    color: colours.textSubtle,
    marginLeft: spacing.xs,
  },

  addSessionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  addSessionText: {
    fontSize: typography.sm,
    color: colours.primary,
    fontWeight: '600',
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  errorBanner: {
    backgroundColor: colours.errorBg,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colours.error + '33',
  },
  errorText: {
    fontSize: typography.sm,
    color: colours.error,
  },
  saveBtn: {
    backgroundColor: colours.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.white,
  },
});
