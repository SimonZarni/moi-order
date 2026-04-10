import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { typography } from '@/shared/theme/typography';

// Amount of bottom padding screens need to clear the floating bar
export const TAB_BAR_CLEARANCE = 100;

export const styles = StyleSheet.create({
  // Outer pill — light background, floating
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.white,
    borderRadius: 36,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    // Softer shadow befitting a light surface
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },

  // Individual tab
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 28,
    gap: 3,
  },
  tabActive: {
    backgroundColor: 'rgba(34,78,74,0.08)',   // primary teal tint
    borderWidth: 1,
    borderColor: 'rgba(34,78,74,0.16)',
  },

  // Icon — muted at rest, full opacity when active (emoji intrinsic colour)
  tabIcon: {
    fontSize: 18,
    opacity: 0.3,
  },
  tabIconActive: {
    opacity: 1,
  },

  // Label — dark on light background
  tabLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: colours.textMuted,
    letterSpacing: 0.4,
  },
  tabLabelActive: {
    color: colours.primary,
    fontWeight: '800',
  },

  // Profile — disabled until screen exists
  tabDisabled: {
    opacity: 0.35,
  },
});
