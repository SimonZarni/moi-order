import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: colours.surface },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colours.surface },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colours.surface,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
    gap: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  backBtn: {
    padding: spacing.xs,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.md,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.3,
    flex: 1,
    lineHeight: 44,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  addCategoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: colours.primary,
  },
  addCategoryBtnText: {
    color: colours.backgroundDark,
    fontSize: typography.xs,
    fontWeight: '700',
  },
  importBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colours.primary,
  },
  importBtnText: {
    color: colours.primary,
    fontSize: typography.xs,
    fontWeight: '700',
  },

  // ── Scroll ────────────────────────────────────────────────────────────────
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.md, paddingBottom: spacing.xxl },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    paddingTop: spacing.xxl + spacing.xl,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle:    { fontSize: typography.md, fontWeight: '700', color: colours.textOnLight, textAlign: 'center' },
  emptySubtitle: { fontSize: typography.sm, color: colours.textMuted, textAlign: 'center', lineHeight: 20 },

  // ── Category section ──────────────────────────────────────────────────────
  categorySection: {
    marginBottom: spacing.md,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colours.divider,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.surfaceMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  categoryName: {
    flex: 1,
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnLight,
    lineHeight: 44,
  },
  categoryCount: {
    fontSize: typography.xs,
    color: colours.textSubtle,
    fontWeight: '600',
  },
  categoryActions: { flexDirection: 'row', gap: 4 },
  catActionBtn: {
    padding: spacing.xs,
    borderRadius: radius.full,
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catRenameBtn: { backgroundColor: colours.primaryBg },
  catDeleteBtn:  { backgroundColor: colours.errorBg },

  // ── Modals (matching MenuScreen dark sheet style) ─────────────────────────
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: colours.backgroundMid,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    padding: spacing.lg,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
  },
  modalScrollView: { maxHeight: '90%' },
  modalTitle: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: colours.textOnDark,
    marginBottom: spacing.md,
    letterSpacing: -0.3,
  },
  modalInput: {
    backgroundColor: colours.backgroundDark,
    borderWidth: 1,
    borderColor: colours.dividerDark,
    borderRadius: radius.lg,
    padding: spacing.sm,
    fontSize: typography.sm,
    color: colours.textOnDark,
    marginBottom: spacing.sm,
    minHeight: 44,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-end',
    marginTop: spacing.xs,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colours.dividerDark,
    borderRadius: radius.full,
    paddingVertical: 7,
    paddingHorizontal: spacing.md,
    minHeight: 36,
    justifyContent: 'center',
  },
  cancelText: { color: 'rgba(255,255,255,0.5)', fontSize: typography.xs, fontWeight: '600' },
  confirmButton: {
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    paddingVertical: 7,
    paddingHorizontal: spacing.md,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: { color: colours.backgroundDark, fontSize: typography.xs, fontWeight: '700' },
  deleteConfirmBody: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  deleteConfirmBtn: {
    backgroundColor: colours.error,
    borderRadius: radius.full,
    paddingVertical: 7,
    paddingHorizontal: spacing.md,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteConfirmText: { color: '#fff', fontSize: typography.xs, fontWeight: '700' },

  // ── Import modal ──────────────────────────────────────────────────────────
  importModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colours.dividerDark,
    gap: spacing.sm,
  },
  importModalItemName: { fontSize: typography.sm, color: colours.textOnDark, flex: 1 },
  importModalItemCount: { fontSize: typography.xs, color: 'rgba(255,255,255,0.4)' },
  importConfirmBtn: {
    marginTop: spacing.md,
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  importConfirmBtnDisabled: { opacity: 0.4 },
  importConfirmText: { fontSize: typography.sm, color: colours.backgroundDark, fontWeight: '700' },
});
