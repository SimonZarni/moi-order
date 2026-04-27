import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { typography } from '@/shared/theme/typography';

export const TAB_BAR_CLEARANCE     = 100;
export const TAB_BAR_BOTTOM_OFFSET = 14;

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: colours.white,
    borderRadius: 36,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: colours.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },

  // Inner row — layout measurement target + host for absolute pill + flex tabs.
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  // Animated pill — liquid glass indicator that slides between tabs.
  pill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 28,
    backgroundColor: colours.infoBg,
    borderWidth: 1,
    borderColor: colours.infoBorder,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 28,
    gap: 3,
  },

  tabLabel: {
    fontSize: typography.xxs,
    fontWeight: '600',
    color: colours.textMuted,
    letterSpacing: 0.4,
    lineHeight: 16,
  },

  tabLabelActive: {
    color: colours.primary,
    fontWeight: '800',
  },

  tabDisabled: {
    opacity: 0.35,
  },
});
