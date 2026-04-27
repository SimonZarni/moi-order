import { StyleSheet } from 'react-native';
import { MAP_COLORS } from '@/shared/theme/mapTheme';

export const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: MAP_COLORS.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 16, paddingBottom: 48, paddingTop: 8,
  },
  handle: {
    width: 40, height: 4, borderRadius: 9999,
    backgroundColor: MAP_COLORS.border, alignSelf: 'center', marginBottom: 16,
  },
  title:    { fontSize: 22, fontWeight: '700', color: MAP_COLORS.textPrimary, marginBottom: 4 },
  subtitle: { fontSize: 13, color: MAP_COLORS.textSecondary, marginBottom: 20, lineHeight: 19 },
  option: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, gap: 12, minHeight: 64,
  },
  optionDisabled: { opacity: 0.4 },
  optionIcon: {
    width: 48, height: 48, borderRadius: 10,
    backgroundColor: MAP_COLORS.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  optionIconMap: { backgroundColor: MAP_COLORS.surfaceAlt },
  optionEmoji:   { fontSize: 24 },
  optionText:    { flex: 1 },
  optionTitle:   { fontSize: 16, fontWeight: '600', color: MAP_COLORS.textPrimary, marginBottom: 2 },
  optionSub:     { fontSize: 13, color: MAP_COLORS.textSecondary, lineHeight: 18 },
  optionArrow:   { fontSize: 22, color: MAP_COLORS.textMuted, fontWeight: '300' },
  divider:       { height: 1, backgroundColor: MAP_COLORS.border, marginVertical: 4 },
  cancelBtn: {
    marginTop: 12, paddingVertical: 12, alignItems: 'center',
    borderRadius: 10, backgroundColor: MAP_COLORS.surfaceAlt, minHeight: 48,
  },
  cancelText: { fontSize: 16, fontWeight: '600', color: MAP_COLORS.textSecondary },
});
