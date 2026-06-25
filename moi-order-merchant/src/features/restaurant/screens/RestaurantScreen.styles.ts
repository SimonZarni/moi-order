import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.surfaceMuted },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colours.surfaceMuted },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xl + spacing.lg },

  pageHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colours.surface,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  pageTitle: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.4,
    lineHeight: 60,
  },

  // ── Shared card shell ──────────────────────────────────────────────────────
  card: {
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colours.divider,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  cardTitle: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnLight,
    letterSpacing: -0.2,
  },
  cardBody: {
    padding: spacing.md,
  },

  // ── Stock switch row ───────────────────────────────────────────────────────
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  switchLabel: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textMuted,
    lineHeight: 20,
  },

  // ── Min order inline edit ──────────────────────────────────────────────────
  editInlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.primaryLight,
    backgroundColor: colours.primaryBg,
  },
  editInlineBtnText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.primaryDark,
  },
  minOrderEdit: {
    gap: spacing.sm,
  },
  minOrderInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  minOrderInput: {
    flex: 1,
    backgroundColor: colours.surfaceMuted,
    borderWidth: 1,
    borderColor: colours.divider,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    fontSize: typography.sm,
    color: colours.textOnLight,
  },
  minOrderCurrency: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textMuted,
    width: 20,
  },
  minOrderActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colours.divider,
  },
  cancelBtnText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.textMuted,
  },
  saveBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colours.primary,
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.backgroundDark,
  },
  infoRow: { gap: 3 },
  infoLabel: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: typography.sm,
    color: colours.textOnLight,
  },

  // ── Action buttons ─────────────────────────────────────────────────────────
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colours.divider,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  actionBtnText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.primaryDark,
    flex: 1,
  },
});
