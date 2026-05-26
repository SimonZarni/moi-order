import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colours.backgroundLight },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colours.backgroundLight },

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
  },
  pageTitle: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.4,
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

  // ── Search bar ────────────────────────────────────────────────────────────
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colours.divider,
    paddingHorizontal: spacing.md,
    height: 38,
  },
  searchIcon: { marginRight: spacing.xs },
  searchInput: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnLight,
    paddingVertical: 0,
  },

  // ── Category tabs ─────────────────────────────────────────────────────────
  tabs: {
    backgroundColor: colours.surface,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  tabsContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1,
    gap: spacing.xs,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colours.divider,
    backgroundColor: colours.surface,
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
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  tabCountActive: { backgroundColor: colours.primary },
  tabCountText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textMuted,
  },
  tabCountTextActive: { color: colours.backgroundDark },

  // ── Warning banner ────────────────────────────────────────────────────────
  warnBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colours.warningBg,
    borderBottomWidth: 1,
    borderBottomColor: colours.warning + '44',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    gap: spacing.xs,
  },
  warnText: {
    flex: 1,
    fontSize: typography.xs,
    color: colours.warning,
    lineHeight: 16,
    fontWeight: '600',
  },

  // ── Scrollable items area ─────────────────────────────────────────────────
  scroll: { flex: 1 },

  // ── Grid container — flexWrap so CSS percentage widths distribute columns ─
  // This is more reliable on Expo Web than FlatList numColumns.
  grid: {
    padding: spacing.xs + 2,
    paddingBottom: spacing.xxl + spacing.xl, // room for FAB
  },
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  // Each item gets an inline width={itemWidthPct} from MenuScreen; this
  // just adds uniform padding around each cell.
  gridItem: {
    padding: 4,
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    paddingTop: spacing.xxl + spacing.xl,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: typography.md,
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
    bottom: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    // Shadow
    shadowColor: colours.primaryDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    fontSize: typography.xs,
    fontWeight: '800',
    color: colours.backgroundDark,
  },

  // ── Modals ────────────────────────────────────────────────────────────────
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

  // ── Item form: price row ──────────────────────────────────────────────────
  priceRow:     { flexDirection: 'row', gap: spacing.sm },
  priceLabel:   { fontSize: typography.xs, color: 'rgba(255,255,255,0.45)', fontWeight: '600', marginBottom: 3 },
  discountBadge:{ fontSize: typography.xs, color: colours.success, fontWeight: '700', marginBottom: spacing.sm },

  // ── Item form: option groups ──────────────────────────────────────────────
  sectionDivider:  { height: 1, backgroundColor: colours.dividerDark, marginVertical: spacing.sm },
  sectionHeader:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 },
  sectionTitle:    { fontSize: typography.sm, fontWeight: '700', color: colours.textOnDark },
  sectionHint:     { fontSize: typography.xxs, color: 'rgba(255,255,255,0.35)', marginBottom: spacing.sm },
  addSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
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
  optionGroupMeta:   { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.sm, alignItems: 'center' },
  toggleRowSmall:    { flexDirection: 'row', alignItems: 'center', gap: 5 },
  toggleLabelSmall:  { fontSize: typography.xs, color: 'rgba(255,255,255,0.45)' },
  smallNumInput: {
    borderWidth: 1,
    borderColor: colours.dividerDark,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 3,
    fontSize: typography.sm,
    color: colours.textOnDark,
    width: 40,
    textAlign: 'center',
    backgroundColor: colours.backgroundDark,
  },
  optionRow:       { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 5 },
  addOptionBtn:    { flexDirection: 'row', alignItems: 'center', gap: 3, paddingVertical: 3, alignSelf: 'flex-start' },
  addOptionBtnText:{ fontSize: typography.xs, color: colours.primary, fontWeight: '700' },

  // ── Photo preview ─────────────────────────────────────────────────────────
  photoPreviewWrap: { position: 'relative', marginBottom: spacing.sm, borderRadius: radius.md, overflow: 'hidden' },
  photoPreview:     { width: '100%', height: 140, borderRadius: radius.md, backgroundColor: colours.backgroundDark },
  photoNewBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  photoNewBadgeText:  { fontSize: typography.xxs, color: colours.backgroundDark, fontWeight: '800' },
  photoErrorState:    {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.backgroundDark,
    borderWidth: 1,
    borderColor: colours.dividerDark,
    borderStyle: 'dashed',
    gap: 5,
    borderRadius: radius.md,
  },
  photoErrorText:   { fontSize: typography.xs, color: 'rgba(255,255,255,0.3)' },
  photoChangeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: colours.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.xs + 2,
    marginTop: spacing.xs,
    minHeight: 36,
    backgroundColor: colours.primary + '18',
  },
  photoChangeBtnText: { fontSize: typography.xs, color: colours.primary, fontWeight: '700' },
});
