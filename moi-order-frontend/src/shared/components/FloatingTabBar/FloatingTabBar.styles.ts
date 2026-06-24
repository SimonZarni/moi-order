import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { typography } from '@/shared/theme/typography';

export const TAB_BAR_CLEARANCE     = 100;
export const TAB_BAR_BOTTOM_OFFSET = 14;
// blurWrap paddingVertical(6×2) + tab paddingVertical(8×2) + icon(20) + gap(3) + label(16)
export const TAB_BAR_HEIGHT        = 67;

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

  // Android fallback — solid background replaces BlurView (no real blur on Android)
  androidWrap: {
    backgroundColor: 'rgba(248, 248, 250, 0.98)',
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

  iconWrap: {
    position: 'relative',
  },

  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colours.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },

  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 11,
  },
});
