import { StyleSheet } from "react-native";

import { colours } from "@/shared/theme/colours";
import { editorialPalette } from "@/shared/theme/editorialPalette";
import { radius } from "@/shared/theme/radius";
import { shadows } from "@/shared/theme/shadows";
import { spacing } from "@/shared/theme/spacing";
import { typography } from "@/shared/theme/typography";
import { TAB_BAR_CLEARANCE } from "@/shared/components/FloatingTabBar/FloatingTabBar.styles";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colours.backgroundDark,
  },

  scroll: {
    backgroundColor: colours.backgroundDark,
  },

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    backgroundColor: colours.backgroundDark,
    paddingHorizontal: spacing.xl + spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl + 8,
    overflow: "hidden",
    minHeight: 180,
  },

  // Decorative background orbs (pure shape, no blur — conveys depth)
  orbLarge: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: radius.orbLarge,
    backgroundColor: colours.tertiary,
    opacity: 0.07,
    top: -70,
    right: -50,
  },
  orbSmall: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: radius.orbSmall,
    backgroundColor: colours.tertiary,
    opacity: 0.05,
    bottom: 12,
    left: -20,
  },

  // Brand row
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  brandLogo: {
    width: 160,
    height: 48,
  },

  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  authBtn: {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm + 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.ghostBorder,
    backgroundColor: colours.ghostBg,
    minWidth: 44,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  authBtnText: {
    fontSize: typography.xs,
    fontWeight: "600",
    color: colours.textOnDark,
    letterSpacing: 0.4,
  },

  heroTextBlock: {
    marginTop: 0,
  },
  heroGreeting: {
    fontSize: typography.xs,
    color: colours.medium,
    lineHeight: 20,
    marginBottom: 5,
  },
  heroTitle: {
    fontSize: 23,
    fontWeight: "900",
    color: colours.textOnDark,
    letterSpacing: -0.5,
    lineHeight: 33,
  },
  heroTitleAccent: {
    color: colours.tertiary,
  },

  // ── Search bar ────────────────────────────────────────────────────────────
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    marginTop: spacing.sm,
  },
  searchIcon: { fontSize: 14 },
  searchPlaceholder: {
    fontSize: typography.xs,
    color: "rgba(255,255,255,0.55)",
    flex: 1,
  },

  // ── Body ──────────────────────────────────────────────────────────────────
  body: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    marginTop: -radius.sheet, // only the curve overlaps
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: TAB_BAR_CLEARANCE,
    minHeight: 340,
  },

  // Section label with trailing rule
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: typography.xs,
    fontWeight: "700",
    color: colours.textMuted,
    letterSpacing: 2,
    textTransform: "uppercase",
    lineHeight: 20,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(0,0,0,0.07)",
  },

  // Myanmar (mm) locale override — sectionLabel has letterSpacing:2 which
  // splits Myanmar glyph clusters; zero it out for Burmese locale.
  mmSectionLabel: {
    letterSpacing: 0,
    lineHeight: 22,  // typography.xs (11) × 2.0
  },

  // ── 2×2 Grid ──────────────────────────────────────────────────────────────
  gridRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
  },

  // ── Card base ─────────────────────────────────────────────────────────────
  card: {
    flex: 1,
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    borderTopWidth: 2.5,
    borderTopColor: editorialPalette.sage, // default; overridden per variant
    padding: spacing.md,
    minHeight: 148,
    ...shadows.medium,
  },
  cardDimmed: {
    opacity: 0.45,
  },

  // Card accent border variants
  cardAccentSage: { borderTopColor: editorialPalette.sage },
  cardAccentSlate: { borderTopColor: editorialPalette.slate },
  cardAccentGold: { borderTopColor: editorialPalette.gold },
  cardAccentTeal: { borderTopColor: editorialPalette.teal },
  cardAccentRose: { borderTopColor: editorialPalette.rose },
  cardAccentSky: { borderTopColor: editorialPalette.sky },
  cardAccentIndigo: { borderTopColor: editorialPalette.indigo },
  cardAccentCoral: { borderTopColor: editorialPalette.coral },
  cardAccentNavy: { borderTopColor: editorialPalette.navy },

  // Card text
  cardTag: {
    fontSize: typography.xxs,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: spacing.xs,
  },
  tagSage: { color: editorialPalette.sage },
  tagSlate: { color: editorialPalette.slate },
  tagGold: { color: editorialPalette.gold },
  tagTeal: { color: editorialPalette.teal },
  tagRose: { color: editorialPalette.rose },
  tagSky: { color: editorialPalette.sky },
  tagIndigo: { color: editorialPalette.indigo },
  tagCoral: { color: editorialPalette.coral },
  tagNavy: { color: editorialPalette.navy },

  cardTitle: {
    fontSize: typography.lg,
    fontWeight: "800",
    color: colours.textOnLight,
    letterSpacing: -0.2,
    lineHeight: 32,
    marginBottom: 3,
  },
  cardSubtitle: {
    fontSize: typography.xs,
    color: colours.medium,
    lineHeight: 20,
  },

  cardIcon: {
    position: "absolute",
    bottom: 6,
    right: 8,
    opacity: 0.8,
  },

  // ── Coming-soon pill ──────────────────────────────────────────────────────
  soonPill: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colours.infoBg,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    paddingVertical: 2,
    paddingHorizontal: 7,
  },
  soonText: {
    fontSize: 8,
    fontWeight: "700",
    color: colours.textMuted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
