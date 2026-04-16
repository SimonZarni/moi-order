// ── Brand palette ────────────────────────────────────────────────────────────
export const colours = {
  // Core brand roles
  primary:   '#224e4a', // Deep Teal
  secondary: '#354f52', // Slate Charcoal
  tertiary:  '#52796f', // Sage / Soft Green

  // Semantic
  success: '#2dd55b', // Vibrant Green
  warning: '#ffc409', // Amber
  danger:  '#c5000f', // Deep Red

  // Neutrals
  light:  '#f6f8fc', // Off-white
  medium: '#5f6d6c', // Neutral Slate
  dark:   '#1a2a29', // Deep Onyx

  // Page backgrounds
  backgroundDark:      '#0f1f1e', // Dark teal gradient start (auth / profile / header)
  backgroundDarkEnd:   '#142625', // Dark teal gradient end
  backgroundLight:     '#f8fafc', // Off-white (home / content areas)

  // Text
  textOnDark:    '#ffffff',
  textOnLight:   '#0f172a', // Slate
  textMuted:     '#64748b',

  // Surfaces
  card:          '#ffffff',
  inputBg:       'rgba(255,255,255,0.12)', // Translucent white on dark bg
  inputBorder:   '#224e4a',               // Teal border
  infoBg:        'rgba(34,78,74,0.08)',   // Primary teal tint (0.06–0.12)

  // Tab bar
  tabBarBg:         'rgba(82,121,111,0.55)', // Jade glass
  tabIconInactive:  '#2d5a44',               // Forest jade
  tabIconActive:    '#059669',               // Emerald

  // Buttons
  ghostBorder:      'rgba(255,255,255,0.6)',
  ghostBg:          'rgba(255,255,255,0.12)',

  // Badges
  badgeBg:          'rgba(34,78,74,0.12)',
  badgeText:        '#224e4a',
  notificationBadge: '#ef4444',

  // Social login
  googleBg:  '#ffffff',
  lineBg:    '#06C755',

  // Destructive
  destructive: '#ff4961',

  // Dividers / borders
  divider:     'rgba(0,0,0,0.07)',
  infoBorder:  'rgba(34,78,74,0.16)',

  // Utility
  white:       '#ffffff',
  transparent: 'transparent',
} as const;
