import { StyleSheet } from 'react-native';
import { MAP_COLORS } from '@/shared/theme/mapTheme';
import { colours } from '@/shared/theme/colours';

export const styles = StyleSheet.create({
  flex:      { flex: 1 },
  safe:      { flex: 1, backgroundColor: colours.backgroundDark },
  container: { flex: 1 },
  map:       { flex: 1 },

  backBtn: {
    position: 'absolute', top: 16, left: 16, zIndex: 20,
    backgroundColor: MAP_COLORS.surface, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
    shadowColor: MAP_COLORS.black, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 6, elevation: 5,
  },
  backText: { fontSize: 14, fontWeight: '600', color: MAP_COLORS.primary },

  locationBanner: {
    position: 'absolute', bottom: 80, left: 16, right: 16,
    backgroundColor: MAP_COLORS.textPrimary, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 8,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    shadowColor: MAP_COLORS.black, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 8,
  },
  locationBannerText: { color: MAP_COLORS.white, fontSize: 13, fontWeight: '600', flex: 1 },
  locationBannerHint: { color: MAP_COLORS.textMuted, fontSize: 11 },

  loadingOverlay: {
    position: 'absolute', bottom: 120, alignSelf: 'center',
    backgroundColor: MAP_COLORS.surface, borderRadius: 20,
    paddingHorizontal: 20, paddingVertical: 12,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    shadowColor: MAP_COLORS.black, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 6,
  },
  loadingText: { fontSize: 13, color: MAP_COLORS.textSecondary, fontWeight: '500' },

  errorBanner: {
    position: 'absolute', bottom: 120, left: 16, right: 16,
    backgroundColor: MAP_COLORS.errorLight, borderRadius: 10,
    padding: 12, flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: MAP_COLORS.error,
  },
  errorText:  { flex: 1, color: MAP_COLORS.error, fontSize: 13 },
  errorRetry: { color: MAP_COLORS.primary, fontWeight: '700', fontSize: 13 },
});
