import { StyleSheet } from 'react-native';
import { MAP_COLORS } from '@/shared/theme/mapTheme';

export const styles = StyleSheet.create({
  sheetContainer: {
    zIndex: 100,
    elevation: 100,
  },
  sheetBg: {
    backgroundColor: MAP_COLORS.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    shadowColor: MAP_COLORS.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12, shadowRadius: 16, elevation: 20,
  },
  handle: { backgroundColor: MAP_COLORS.border, width: 36 },
  peekRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 8, gap: 8, minHeight: 52,
  },
  peekThumb: {
    width: 40, height: 40, borderRadius: 20, overflow: 'hidden',
    backgroundColor: MAP_COLORS.primaryLight, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: MAP_COLORS.border,
  },
  peekThumbImg:   { width: '100%', height: '100%' },
  peekThumbEmoji: { fontSize: 18 },
  peekCenter:     { flex: 1, gap: 3 },
  peekName:       { fontSize: 15, fontWeight: '700', color: MAP_COLORS.textPrimary },
  peekPills:      { flexDirection: 'row', gap: 4, flexWrap: 'wrap' },
  peekPill: {
    backgroundColor: MAP_COLORS.primaryLight, borderRadius: 9999,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  peekPillWalk: { backgroundColor: MAP_COLORS.surfaceAlt },
  peekPillText: { fontSize: 11, color: MAP_COLORS.textPrimary, fontWeight: '600' },
  dismissBtn: {
    width: 32, height: 32, borderRadius: 9999,
    backgroundColor: MAP_COLORS.surfaceAlt, alignItems: 'center', justifyContent: 'center',
  },
  dismissText: { fontSize: 13, color: MAP_COLORS.textSecondary, fontWeight: '600' },
  scroll:           { paddingBottom: 48 },

  // ── Photo slideshow ────────────────────────────────────────────────────────
  slideWrap:  { width: '100%', height: 160, position: 'relative' },
  slideImage: { height: 160 },
  slideDots:  {
    position: 'absolute', bottom: 6, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4,
  },
  slideDot: {
    width: 5, height: 5, borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  slideDotActive: {
    width: 14,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },

  cover:            { width: '100%', height: 160 },
  coverPlaceholder: { backgroundColor: MAP_COLORS.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  coverPlaceholderText: { fontSize: 40 },
  content:   { padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  headerLeft:{ flex: 1 },
  headerRight: { justifyContent: 'flex-start', paddingTop: 2 },
  readMoreTag: {
    backgroundColor: MAP_COLORS.primaryLight,
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: MAP_COLORS.primary,
  },
  readMoreText: { fontSize: 11, color: MAP_COLORS.primary, fontWeight: '700' },
  name:      { fontSize: 18, fontWeight: '700', color: MAP_COLORS.textPrimary, marginBottom: 4 },
  categoryBadge: {
    alignSelf: 'flex-start', backgroundColor: MAP_COLORS.primaryLight,
    borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 2,
  },
  categoryText: { fontSize: 11, color: MAP_COLORS.primary, fontWeight: '600' },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, gap: 4 },
  infoIcon: { fontSize: 13, marginTop: 1 },
  infoText: { flex: 1, fontSize: 13, color: MAP_COLORS.textSecondary, lineHeight: 19 },
  loader:   { marginVertical: 16 },
  tagsRow:  { marginBottom: 12 },
  tag: {
    backgroundColor: MAP_COLORS.surfaceAlt, borderRadius: 9999,
    paddingHorizontal: 8, paddingVertical: 4, marginRight: 4,
  },
  tagText: { fontSize: 11, color: MAP_COLORS.textSecondary, fontWeight: '500' },
  directionsSection: { marginTop: 8, gap: 8 },
  routeCards: { flexDirection: 'row', gap: 8 },
  routeCard: {
    flex: 1, borderRadius: 16, padding: 12,
    alignItems: 'center', gap: 2, borderWidth: 1,
  },
  routeCardDrive: { backgroundColor: MAP_COLORS.primaryLight, borderColor: MAP_COLORS.primary },
  routeCardWalk:  { backgroundColor: MAP_COLORS.surfaceAlt, borderColor: MAP_COLORS.border },
  routeCardIcon:  { fontSize: 22 },
  routeCardTime:  { fontSize: 16, fontWeight: '700', color: MAP_COLORS.textPrimary },
  routeCardDist:  { fontSize: 11, color: MAP_COLORS.textSecondary },
  directionsBtn: {
    backgroundColor: MAP_COLORS.primary, borderRadius: 10,
    paddingVertical: 12, alignItems: 'center', minHeight: 48,
  },
  directionsBtnText: { color: MAP_COLORS.white, fontSize: 16, fontWeight: '700' },
  navigateBtn: {
    backgroundColor: MAP_COLORS.success, borderRadius: 10,
    paddingVertical: 12, alignItems: 'center', minHeight: 48,
  },
  navigateBtnText: { color: MAP_COLORS.white, fontSize: 16, fontWeight: '700' },
  secondaryActions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  secBtn: {
    flex: 1, borderRadius: 10, borderWidth: 1, borderColor: MAP_COLORS.border,
    paddingVertical: 8, alignItems: 'center', minHeight: 44, justifyContent: 'center',
  },
  secBtnText: { color: MAP_COLORS.textPrimary, fontSize: 13, fontWeight: '500' },
});
