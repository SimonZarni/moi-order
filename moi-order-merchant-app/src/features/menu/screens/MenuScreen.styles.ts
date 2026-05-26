import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.backgroundLight },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colours.backgroundLight },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colours.surface,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  pageTitle: {
    fontSize: typography.xxl,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.6,
  },
  addCategoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    backgroundColor: colours.primary,
    minHeight: 36,
    justifyContent: 'center',
  },
  addCategoryBtnText: {
    color: colours.backgroundDark,
    fontSize: typography.xs,
    fontWeight: '700',
  },

  // ── Search bar ────────────────────────────────────────────────────────────
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colours.divider,
    paddingHorizontal: spacing.md,
    minHeight: 44,
  },
  searchIcon: { marginRight: spacing.sm },
  searchInput: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnLight,
    paddingVertical: spacing.sm,
  },

  // ── Category tabs ─────────────────────────────────────────────────────────
  tabs: {
    backgroundColor: colours.surface,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  tabsContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colours.divider,
    backgroundColor: colours.surface,
    minHeight: 36,
  },
  tabActive: {
    borderColor: colours.primary,
    backgroundColor: colours.primaryBg,
  },
  tabText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.textMuted,
  },
  tabTextActive: {
    color: colours.primaryDark,
    fontWeight: '700',
  },
  tabCount: {
    backgroundColor: colours.surfaceMuted,
    borderRadius: radius.full,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 20,
    alignItems: 'center',
  },
  tabCountActive: {
    backgroundColor: colours.primary,
  },
  tabCountText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textMuted,
  },
  tabCountTextActive: {
    color: colours.backgroundDark,
  },

  // ── Warning banner ────────────────────────────────────────────────────────
  warnBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colours.warningBg,
    borderBottomWidth: 1,
    borderBottomColor: colours.warning + '44',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  warnText: {
    flex: 1,
    fontSize: typography.xs,
    color: colours.warning,
    lineHeight: 18,
    fontWeight: '600',
  },

  // ── Items grid ────────────────────────────────────────────────────────────
  grid: {
    padding: spacing.sm,
    paddingBottom: spacing.xxl + spacing.lg, // extra room for FAB
  },
  columnWrapper: {
    gap: 0,         // gaps handled by card's marginHorizontal
    marginBottom: 0,
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    paddingTop: spacing.xxl + spacing.xl,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colours.textOnLight,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: typography.sm,
    color: colours.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },

  // ── FAB (Add Item) ────────────────────────────────────────────────────────
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 48,
    // iOS shadow
    shadowColor: colours.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: {
    fontSize: typography.sm,
    fontWeight: '800',
    color: colours.backgroundDark,
  },

  // ── Modals (dark sheet — unchanged from original design) ──────────────────
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalScrollView: { maxHeight: '90%' },
  modalCard: {
    backgroundColor: colours.backgroundMid,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    padding: spacing.lg,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colours.textOnDark,
    marginBottom: spacing.md,
    letterSpacing: -0.4,
  },
  modalInput: {
    backgroundColor: colours.backgroundDark,
    borderWidth: 1,
    borderColor: colours.dividerDark,
    borderRadius: radius.lg,
    padding: spacing.md,
    fontSize: typography.md,
    color: colours.textOnDark,
    marginBottom: spacing.md,
    minHeight: 48,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-end',
    marginTop: spacing.xs,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: colours.dividerDark,
    borderRadius: radius.full,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    minHeight: 40,
    justifyContent: 'center',
  },
  cancelText: { color: 'rgba(255,255,255,0.5)', fontSize: typography.sm, fontWeight: '600' },
  confirmButton: {
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    minHeight: 40,
    justifyContent: 'center',
  },
  confirmText: { color: colours.backgroundDark, fontSize: typography.sm, fontWeight: '700' },

  // ── Item form: price row ──────────────────────────────────────────────────
  priceRow: { flexDirection: 'row', gap: spacing.sm },
  priceLabel: { fontSize: typography.xs, color: 'rgba(255,255,255,0.45)', fontWeight: '600', marginBottom: 4 },
  discountBadge: { fontSize: typography.xs, color: colours.success, fontWeight: '700', marginBottom: spacing.sm },

  // ── Item form: option groups ──────────────────────────────────────────────
  sectionDivider: { height: 1, backgroundColor: colours.dividerDark, marginVertical: spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  sectionTitle: { fontSize: typography.sm, fontWeight: '700', color: colours.textOnDark },
  sectionHint: { fontSize: typography.xxs, color: 'rgba(255,255,255,0.35)', marginBottom: spacing.sm },
  addSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.primary,
    backgroundColor: colours.primary + '18',
  },
  addSmallBtnText: { fontSize: typography.xs, color: colours.primary, fontWeight: '700' },
  optionGroupCard: {
    borderWidth: 1,
    borderColor: colours.dividerDark,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colours.backgroundDark,
  },
  optionGroupHeader: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.xs },
  optionGroupMeta: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.sm, alignItems: 'center' },
  toggleRowSmall: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  toggleLabelSmall: { fontSize: typography.xs, color: 'rgba(255,255,255,0.45)' },
  smallNumInput: {
    borderWidth: 1,
    borderColor: colours.dividerDark,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: typography.sm,
    color: colours.textOnDark,
    width: 44,
    textAlign: 'center',
    backgroundColor: colours.backgroundDark,
  },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  addOptionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, alignSelf: 'flex-start' },
  addOptionBtnText: { fontSize: typography.xs, color: colours.primary, fontWeight: '700' },

  // ── Photo preview ─────────────────────────────────────────────────────────
  photoPreviewWrap: { position: 'relative', marginBottom: spacing.sm, borderRadius: radius.md, overflow: 'hidden' },
  photoPreview: { width: '100%', height: 160, borderRadius: radius.md, backgroundColor: colours.backgroundDark },
  photoNewBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  photoNewBadgeText: { fontSize: typography.xxs, color: colours.backgroundDark, fontWeight: '800' },
  photoErrorState: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.backgroundDark,
    borderWidth: 1,
    borderColor: colours.dividerDark,
    borderStyle: 'dashed',
    gap: 6,
    borderRadius: radius.md,
  },
  photoErrorText: { fontSize: typography.xs, color: 'rgba(255,255,255,0.3)' },
  photoChangeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colours.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
    minHeight: 44,
    backgroundColor: colours.primary + '18',
  },
  photoChangeBtnText: { fontSize: typography.sm, color: colours.primary, fontWeight: '700' },
});
