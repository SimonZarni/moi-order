import { StyleSheet } from 'react-native';
import { MAP_COLORS } from '@/shared/theme/mapTheme';

export const styles = StyleSheet.create({
  btn: {
    position: 'absolute', bottom: 160, right: 16,
    width: 48, height: 48, borderRadius: 9999,
    backgroundColor: MAP_COLORS.surface, alignItems: 'center', justifyContent: 'center',
    shadowColor: MAP_COLORS.black, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
  },
  btnPressed: { opacity: 0.75 },
  icon:       { fontSize: 22, color: MAP_COLORS.primary },
});
