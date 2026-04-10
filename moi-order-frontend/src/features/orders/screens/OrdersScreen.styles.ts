import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import { TAB_BAR_CLEARANCE } from '@/shared/components/FloatingTabBar/FloatingTabBar.styles';

// Orders accent — amber, distinct from Places gold and Home sage
const AMBER = '#c4813b';

// Status → left-border accent colour mapping
export const STATUS_COLOURS: Record<string, string> = {
  pending:    '#c4813b',
  processing: '#6b9e94',
  completed:  colours.success,
  rejected:   colours.danger,
  cancelled:  colours.medium,
};

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
  },

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    backgroundColor: colours.backgroundDark,
    paddingHorizontal: spacing.xl + spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    overflow: 'hidden',
    minHeight: 180,
  },
  orbLarge: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: AMBER,
    opacity: 0.07,
    top: -60,
    right: -40,
  },
  orbSmall: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colours.tertiary,
    opacity: 0.05,
    bottom: 8,
    left: -16,
  },
  // Back button — pill shape, consistent with PlacesScreen
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.38)',
    borderRadius: radius.full,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    minHeight: 36,
    marginBottom: spacing.sm,
  },
  backArrow: {
    fontSize: 22,
    color: colours.tertiary,
    lineHeight: 26,
    fontWeight: '300',
  },
  backLabel: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.tertiary,
    letterSpacing: 0.2,
  },

  heroTextBlock: {
    marginTop: spacing.xs,
  },
  heroEyebrow: {
    fontSize: 9,
    fontWeight: '700',
    color: AMBER,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: colours.textOnDark,
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  heroSubtitle: {
    fontSize: typography.xs,
    color: colours.medium,
    marginTop: 4,
  },

  // Light spacer rendered inside ListHeaderComponent — creates breathing room
  // between the dark hero and the first card on the light background
  bodyGap: {
    height: spacing.xl,
    backgroundColor: colours.backgroundLight,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -spacing.xl,
  },

  // ── List ──────────────────────────────────────────────────────────────────
  list: {
    paddingBottom: TAB_BAR_CLEARANCE,
    backgroundColor: colours.backgroundLight,
  },

  // ── Order card ────────────────────────────────────────────────────────────
  cardWrap: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colours.card,
    shadowColor: colours.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  card: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  cardAccentBar: {
    width: 3,
    backgroundColor: AMBER, // overridden per status via inline style
  },
  cardBody: {
    flex: 1,
    padding: spacing.md,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  cardServiceName: {
    flex: 1,
    fontSize: typography.md,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.2,
    marginRight: spacing.sm,
  },
  statusPill: {
    borderRadius: radius.full,
    paddingVertical: 3,
    paddingHorizontal: 8,
    backgroundColor: colours.infoBg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colours.medium, // overridden per status inline
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardDate: {
    fontSize: typography.xs,
    color: colours.medium,
  },
  cardMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: AMBER,
    opacity: 0.5,
  },
  cardPrice: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: AMBER,
  },

  // ── Guest state ────────────────────────────────────────────────────────────
  guestWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: TAB_BAR_CLEARANCE,
    backgroundColor: colours.backgroundLight,
  },
  guestIcon: {
    fontSize: 44,
    marginBottom: spacing.md,
    opacity: 0.35,
  },
  guestTitle: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: colours.textOnLight,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  guestSubtitle: {
    fontSize: typography.sm,
    color: colours.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  guestBtn: {
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.xl,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestBtnText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.white,
    letterSpacing: 0.3,
  },

  // ── States ────────────────────────────────────────────────────────────────
  stateBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: TAB_BAR_CLEARANCE,
    backgroundColor: colours.backgroundLight,
  },
  stateIcon: {
    fontSize: 36,
    marginBottom: spacing.sm,
    opacity: 0.5,
  },
  stateTitle: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
    marginBottom: 4,
  },
  stateSubtitle: {
    fontSize: typography.sm,
    color: colours.textMuted,
  },
  spinner: {
    color: colours.tertiary,
  } as unknown as { color: string },

  listFooter: {
    paddingVertical: spacing.lg,
  },
});
