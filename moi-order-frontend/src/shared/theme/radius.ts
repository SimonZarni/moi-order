export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
  // Decorative background orbs (borderRadius = width / 2 of the orb)
  orbLarge: 100, // 200 × 200 orb
  orbSmall: 40,  // 80 × 80 orb
  // Bottom-sheet / card top-corner curve (used wherever body overlaps hero)
  sheet: 28,
} as const;
