// ── Editorial accent palette ──────────────────────────────────────────────────
// These colours complement the core brand teal without appearing in colours.ts.
// They are used for card accent borders, eyebrow labels, and decorative orbs.
// Each screen / feature has its own assigned accent — do not mix them.
//
//   sage  → 90-Day Report screen + Home "90-Day" card  (same value as colours.tertiary)
//   slate → Home "Tickets" card
//   gold  → Places screen + Home "Places" card + PlaceCard meta dot
//   teal  → Other Services screen + Home "Other Services" card
//   amber → Orders screen + Order Detail screen
// ─────────────────────────────────────────────────────────────────────────────
export const editorialPalette = {
  sage:  '#52796f',
  slate: '#64748b',
  gold:  '#b08d57',
  teal:  '#6b9e94',
  amber: '#c4813b',
  rose:  '#8b4353',
  sky:   '#4a7fa5',
} as const;
