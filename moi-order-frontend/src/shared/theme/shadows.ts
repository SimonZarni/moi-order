// ── Shadow presets ────────────────────────────────────────────────────────────
// All shadow colours use '#000'. Spread into StyleSheet.create entries:
//   cardWrap: { ...shadows.medium, backgroundColor: colours.card, ... }
//
// Tiers:
//   light    — subtle inline cards (info rows, section cards)
//   medium   — standard list cards (order cards, home grid cards)
//   heavy    — prominent overlay cards (identity card over hero image)
//   floating — fixed floating elements (tab bar)
//   top      — sticky bars that cast shadow upward (submit bar)
// ─────────────────────────────────────────────────────────────────────────────
export const shadows = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  heavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.13,
    shadowRadius: 16,
    elevation: 7,
  },
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  top: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
};
