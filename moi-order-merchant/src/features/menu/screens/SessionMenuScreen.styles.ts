import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: colours.backgroundLight },
  scroll:        { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  centered:      { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText:     { fontSize: typography.sm, color: colours.error, textAlign: 'center', padding: spacing.lg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  backBtnText: { fontSize: typography.sm, color: colours.primary },
  title:        { fontSize: typography.xl, fontWeight: '700', lineHeight: 60 },

  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  addBtn: {
    flex: 1,
    backgroundColor: colours.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  addBtnText:     { fontSize: typography.sm, color: colours.surface, fontWeight: '600' },
  importBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colours.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  importBtnText:  { fontSize: typography.sm, color: colours.primary, fontWeight: '600' },

  categoryCard: {
    backgroundColor: colours.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryName:  { fontSize: typography.md, fontWeight: '600', lineHeight: 44, flex: 1 },
  categoryMeta:  { fontSize: typography.xs, color: colours.textSubtle, lineHeight: 32 },
  cardActions:   { flexDirection: 'row', gap: spacing.sm },
  iconBtn:       { padding: spacing.xs, minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' },

  emptyCard: {
    backgroundColor: colours.surface,
    borderRadius: radius.md,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyText:    { fontSize: typography.sm, color: colours.textSubtle, textAlign: 'center' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colours.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  modalTitle:    { fontSize: typography.lg, fontWeight: '700', lineHeight: 50, marginBottom: spacing.md },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colours.surfaceMuted,
    gap: spacing.sm,
  },
  modalItemName: { fontSize: typography.md, flex: 1, lineHeight: 44 },
  modalConfirmBtn: {
    marginTop: spacing.md,
    backgroundColor: colours.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  modalConfirmBtnDisabled: { backgroundColor: colours.medium },
  modalConfirmText: { fontSize: typography.md, color: colours.surface, fontWeight: '600' },
  modalCancelBtn: { marginTop: spacing.sm, alignItems: 'center', paddingVertical: spacing.sm },
  modalCancelText: { fontSize: typography.sm, color: colours.textSubtle },

  addCategoryInput: {
    borderWidth: 1,
    borderColor: colours.surfaceMuted,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.md,
    marginBottom: spacing.sm,
  },
});
