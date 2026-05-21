import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 16,
  elevation: 5,
};

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.backgroundDark },
  body: { flex: 1, backgroundColor: '#f2f4f3' },
  bodyContent: { paddingBottom: spacing.xxl },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f2f4f3' },

  // ── Dark header ──────────────────────────────────────────────────────────────
  header: {
    backgroundColor: colours.backgroundDark,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 72,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerLeft: { gap: 4 },
  headerEyebrow: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  headerTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: colours.textOnDark,
    letterSpacing: -1.5,
    lineHeight: 42,
  },
  pendingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colours.warning + '22',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colours.warning + '55',
  },
  pendingDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colours.warning },
  pendingChipText: { fontSize: typography.xs, fontWeight: '700', color: colours.warning },

  // ── Period tabs (float over header) ─────────────────────────────────────────
  periodTabsCard: {
    flexDirection: 'row',
    backgroundColor: colours.surface,
    borderRadius: 16,
    marginHorizontal: spacing.md,
    marginTop: -48,
    padding: 4,
    gap: 4,
    ...shadow,
  },
  periodTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    alignItems: 'center',
  },
  periodTabActive: { backgroundColor: colours.backgroundDark },
  periodTabText: { fontSize: typography.xs, fontWeight: '700', color: colours.textMuted },
  periodTabTextActive: { color: colours.primary },

  // ── Hero revenue card ────────────────────────────────────────────────────────
  heroCard: {
    backgroundColor: colours.surface,
    borderRadius: 20,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.lg,
    gap: 4,
    ...shadow,
  },
  heroLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroRevenue: {
    fontSize: 52,
    fontWeight: '900',
    color: colours.textOnLight,
    letterSpacing: -2.5,
    lineHeight: 58,
  },
  heroMeta: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs },
  heroMetaChip: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  heroMetaText: { fontSize: typography.xs, color: colours.textMuted, fontWeight: '500' },

  // ── Comparison bars card ─────────────────────────────────────────────────────
  card: {
    backgroundColor: colours.surface,
    borderRadius: 20,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    overflow: 'hidden',
    ...shadow,
  },
  cardHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cardTitle: { fontSize: typography.sm, fontWeight: '800', color: colours.textOnLight, letterSpacing: -0.2 },
  barRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  barRowLast: { borderBottomWidth: 0 },
  barRowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  barLabel: { fontSize: typography.sm, fontWeight: '600', color: colours.textMuted },
  barLabelActive: { color: colours.textOnLight, fontWeight: '800' },
  barRevenue: { fontSize: typography.md, fontWeight: '700', color: colours.textMuted, letterSpacing: -0.3 },
  barRevenueActive: { color: colours.primary },
  barTrack: { height: 8, backgroundColor: '#f0f0f0', borderRadius: radius.full, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#e5e7eb', borderRadius: radius.full, minWidth: 4 },
  barFillActive: { backgroundColor: colours.primary },
  barMeta: { fontSize: typography.xs, color: colours.textMuted },

  // ── Grid card ────────────────────────────────────────────────────────────────
  gridCard: {
    flexDirection: 'row',
    backgroundColor: colours.surface,
    borderRadius: 20,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    overflow: 'hidden',
    ...shadow,
  },
  gridItem: { flex: 1, alignItems: 'center', paddingVertical: spacing.lg, gap: 2 },
  gridItemBorder: { borderRightWidth: 1, borderRightColor: '#f0f0f0' },
  gridValue: { fontSize: typography.xxl, fontWeight: '900', color: colours.textOnLight, letterSpacing: -0.8 },
  gridLabel: { fontSize: typography.xs, color: colours.textMuted, textAlign: 'center' },

  // legacy compat
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xxl },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  headerSub: { fontSize: typography.xs, color: 'rgba(255,255,255,0.4)' },
  pendingChipText2: { fontSize: typography.xs, fontWeight: '700', color: colours.warning },
  summaryGrid: { flexDirection: 'row' },
  summaryItem: { flex: 1, alignItems: 'center', paddingVertical: spacing.lg },
  summaryItemLast: { borderRightWidth: 0 },
  summaryValue: { fontSize: typography.xxl, fontWeight: '900', color: colours.textOnLight },
  summaryLabel: { fontSize: typography.xs, color: colours.textMuted, textAlign: 'center' },
  periodRow: { paddingHorizontal: spacing.md, paddingVertical: spacing.md, gap: 8 },
  periodLastRow: { borderBottomWidth: 0 },
  periodHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  periodLabel: { fontSize: typography.sm, fontWeight: '600', color: colours.textMuted },
  periodRevenue: { fontSize: typography.md, fontWeight: '800', color: colours.primary },
  periodMeta: { fontSize: typography.xs, color: colours.textMuted },
});
