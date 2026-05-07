import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { typography } from '@/shared/theme/typography';

export const TAB_BAR_CLEARANCE     = 100;
export const TAB_BAR_BOTTOM_OFFSET = 14;

export const styles = StyleSheet.create({
  // Outer shell — shadow host only; no overflow:hidden so elevation/shadow renders
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    borderRadius: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 12,
  },

  // BlurView inner — clips frosted glass to the pill shape
  blurWrap: {
    borderRadius: 36,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    paddingVertical: 6,
    paddingHorizontal: 6,
  },

  // Inner row — layout measurement + pill host + flex tabs
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  // Animated pill — slides between active tabs
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
