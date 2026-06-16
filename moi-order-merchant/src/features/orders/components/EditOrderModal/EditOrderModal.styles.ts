import { StyleSheet } from 'react-native';
import { colours } from '../../../../shared/theme/colours';
import { spacing } from '../../../../shared/theme/spacing';
import { typography } from '../../../../shared/theme/typography';
import { radius } from '../../../../shared/theme/radius';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colours.backgroundMid,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    borderWidth: 1,
    borderColor: colours.dividerDark,
    maxHeight: '90%',
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colours.dividerDark,
    gap: spacing.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: typography.lg,
    fontWeight: '800',
    color: colours.textOnDark,
    letterSpacing: -0.4,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Scrollable body ───────────────────────────────────────────────────────
  body: { padding: spacing.lg, gap: spacing.lg },

  // ── Section labels ────────────────────────────────────────────────────────
  sectionLabel: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },

  // ── Item rows ─────────────────────────────────────────────────────────────
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colours.dividerDark,
    gap: spacing.sm,
  },
  itemName: {
    flex: 1,
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textOnDark,
  },
  itemPrice: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.5)',
    minWidth: 56,
    textAlign: 'right',
  },
  newBadge: {
    backgroundColor: colours.primary + '33',
    borderRadius: radius.full,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    marginRight: spacing.xs,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colours.primary,
    letterSpacing: 0.5,
  },

  // ── Quantity stepper ──────────────────────────────────────────────────────
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: colours.dividerDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: { opacity: 0.3 },
  stepBtnText: { fontSize: typography.md, color: colours.textOnDark, lineHeight: 20 },
  stepQty: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnDark,
    minWidth: 22,
    textAlign: 'center',
  },
  removeBtn: {
    width: 30,
    height: 30,
    borderRadius: radius.full,
    backgroundColor: colours.error + '22',
    borderWidth: 1,
    borderColor: colours.error + '44',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },

  // ── Search ────────────────────────────────────────────────────────────────
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colours.backgroundDark,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colours.dividerDark,
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnDark,
    paddingVertical: spacing.sm + 2,
  },
  searchResult: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colours.dividerDark,
    gap: spacing.sm,
  },
  searchResultName: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnDark,
  },
  searchResultPrice: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.45)',
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colours.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchHint: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },

  // ── Summary ───────────────────────────────────────────────────────────────
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colours.backgroundDark,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colours.dividerDark,
  },
  summaryText: { fontSize: typography.xs, color: 'rgba(255,255,255,0.5)' },
  totalOld: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.35)',
    textDecorationLine: 'line-through',
    marginRight: spacing.xs,
  },
  totalNew: { fontSize: typography.md, fontWeight: '800', color: colours.primary },
  totalUnchanged: { fontSize: typography.md, fontWeight: '800', color: colours.textOnDark },

  // ── Footer buttons ────────────────────────────────────────────────────────
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: colours.dividerDark,
  },
  discardBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colours.dividerDark,
    borderRadius: radius.full,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
  },
  discardText: { fontSize: typography.sm, fontWeight: '600', color: 'rgba(255,255,255,0.4)' },
  submitBtn: {
    flex: 2,
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitText: { fontSize: typography.sm, fontWeight: '800', color: colours.backgroundDark },
});
