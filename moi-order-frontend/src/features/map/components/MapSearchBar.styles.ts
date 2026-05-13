import { StyleSheet } from 'react-native';
import { MAP_COLORS } from '@/shared/theme/mapTheme';

export const SEARCH_HEIGHT = 52;

export const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute', top: 60, left: 16, right: 16, zIndex: 10, gap: 6,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  // ── Search pill ────────────────────────────────────────────────────────────
  pill: {
    flex:              1,
    flexDirection:     'row',
    alignItems:        'center',
    height:            SEARCH_HEIGHT,
    backgroundColor:   'rgba(255,255,255,0.97)',
    borderRadius:      16,
    paddingHorizontal: 14,
    borderWidth:       1,
    borderColor:       MAP_COLORS.border,
    shadowColor:       MAP_COLORS.black,
    shadowOffset:      { width: 0, height: 4 },
    shadowOpacity:     0.10,
    shadowRadius:      14,
    elevation:         8,
  },
  pillFocused: {
    borderColor:   MAP_COLORS.primary,
    shadowOpacity: 0.18,
    shadowRadius:  18,
    elevation:     12,
  },
  searchIconWrap: {
    width: 28, height: 28, alignItems: 'center', justifyContent: 'center',
  },
  searchIcon: { fontSize: 16, color: MAP_COLORS.textMuted },
  searchIconActive: { color: MAP_COLORS.primary },
  input: {
    flex:         1,
    fontSize:     16,
    color:        MAP_COLORS.textPrimary,
    paddingVertical: 0,
    marginLeft:   6,
  },
  clearBtn: {
    width: 26, height: 26, borderRadius: 9999,
    backgroundColor: MAP_COLORS.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: 4,
  },
  clearText: { fontSize: 10, color: MAP_COLORS.textSecondary, fontWeight: '700' },
  // ── Filter button ──────────────────────────────────────────────────────────
  filterBtn: {
    width:           SEARCH_HEIGHT,
    height:          SEARCH_HEIGHT,
    borderRadius:    16,
    backgroundColor: 'rgba(255,255,255,0.97)',
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     1,
    borderColor:     MAP_COLORS.border,
    shadowColor:     MAP_COLORS.black,
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.10,
    shadowRadius:    14,
    elevation:       8,
  },
  filterBtnActive: {
    backgroundColor: MAP_COLORS.primary,
    borderColor:     MAP_COLORS.primary,
  },
  filterIcon: { fontSize: 18 },
  filterBadge: {
    position:        'absolute',
    top:             6,
    right:           6,
    width:           16,
    height:          16,
    borderRadius:    9999,
    backgroundColor: MAP_COLORS.primary,
    alignItems:      'center',
    justifyContent:  'center',
  },
  filterBadgeActive: { backgroundColor: MAP_COLORS.white },
  filterBadgeText: {
    fontSize:   9,
    fontWeight: '800',
    color:      MAP_COLORS.white,
  },
  filterBadgeTextActive: { color: MAP_COLORS.primary },
  // ── Category tabs ──────────────────────────────────────────────────────────
  tabsRow: {
    paddingHorizontal: 2, paddingVertical: 2, gap: 6, flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 9999,
    backgroundColor:   'rgba(255,255,255,0.97)',
    borderWidth:       1.5, borderColor: MAP_COLORS.border,
    shadowColor:       MAP_COLORS.black, shadowOffset: { width: 0, height: 2 },
    shadowOpacity:     0.08, shadowRadius: 6, elevation: 3,
    minHeight:         36, justifyContent: 'center', alignItems: 'center',
  },
  tabActive: {
    backgroundColor: MAP_COLORS.primary, borderColor: MAP_COLORS.primary,
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
  },
  tabText:       { fontSize: 13, fontWeight: '600', color: MAP_COLORS.textSecondary },
  tabTextActive: { color: MAP_COLORS.white },
  // ── Dropdown ───────────────────────────────────────────────────────────────
  dropdown: {
    backgroundColor:  'rgba(255,255,255,0.98)',
    borderRadius:     18,
    shadowColor:      MAP_COLORS.black,
    shadowOffset:     { width: 0, height: 6 },
    shadowOpacity:    0.14,
    shadowRadius:     18,
    elevation:        12,
    overflow:         'hidden',
    borderWidth:      1,
    borderColor:      MAP_COLORS.border,
  },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 6, backgroundColor: MAP_COLORS.surfaceAlt,
  },
  sectionHeaderBorderTop: { borderTopWidth: 1, borderTopColor: MAP_COLORS.border },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: MAP_COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.6,
  },
  loadingDot:  { fontSize: 13, color: MAP_COLORS.textMuted },
  suggestionRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10, minHeight: 58, gap: 10,
  },
  rowBorder:   { borderBottomWidth: 1, borderBottomColor: MAP_COLORS.border },
  thumbCircle: {
    width: 42, height: 42, borderRadius: 21, overflow: 'hidden',
    backgroundColor: MAP_COLORS.primaryLight, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: MAP_COLORS.border,
  },
  thumbGeo:    { backgroundColor: MAP_COLORS.surfaceAlt },
  thumbImage:  { width: '100%', height: '100%' },
  thumbEmoji:  { fontSize: 18 },
  rowText:     { flex: 1 },
  rowName:     { fontSize: 15, fontWeight: '600', color: MAP_COLORS.textPrimary },
  rowSub:      { fontSize: 11, color: MAP_COLORS.textSecondary, marginTop: 2 },
  appBadge:    {
    backgroundColor: MAP_COLORS.primaryLight, borderRadius: 9999,
    paddingHorizontal: 7, paddingVertical: 3,
  },
  appBadgeText:  { fontSize: 10, fontWeight: '700', color: MAP_COLORS.primary },
  // ── Google Places ──────────────────────────────────────────────────────────
  thumbGoogle: {
    backgroundColor: '#e8f0fe',
  },
  thumbGoogleText: {
    fontSize: 15, fontWeight: '800', color: '#4285F4',
  },
  googleBadge: {
    backgroundColor: '#e8f0fe', borderRadius: 9999,
    paddingHorizontal: 7, paddingVertical: 3,
  },
  googleBadgeText: { fontSize: 10, fontWeight: '700', color: '#4285F4' },
  emptyRow:  { padding: 14, alignItems: 'center' },
  emptyText: { fontSize: 13, color: MAP_COLORS.textMuted },
  placeholder: { color: MAP_COLORS.textMuted },
});
