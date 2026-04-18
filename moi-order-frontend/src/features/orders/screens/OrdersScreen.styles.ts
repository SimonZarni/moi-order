import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import { TAB_BAR_CLEARANCE } from '@/shared/components/FloatingTabBar/FloatingTabBar.styles';

// Status → left-border accent colour mapping
export const STATUS_COLOURS: Record<string, string> = {
  pending:    editorialPalette.amber,
  processing: editorialPalette.teal,
  completed:  colours.success,
  rejected:   colours.danger,
  cancelled:  colours.medium,
};

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colours.backgroundDark,
  },

  flatList: { flex: 1, backgroundColor: colours.backgroundLight },

  // Light spacer between HeroHeader and the first card
  bodyGap: {
    height: spacing.xl,
    backgroundColor: colours.backgroundLight,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    marginTop: -spacing.xl,
  },

  // ── Tabs ──────────────────────────────────────────────────────────────────
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: radius.full,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.full,
  },
  tabActive: {
    backgroundColor: colours.card,
    ...shadows.medium,
  },
  tabText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 0.5,
    lineHeight: 20,
  },
  tabTextActive: {
    color: colours.textOnLight,
  },

  // ── Ticket order card ─────────────────────────────────────────────────────
  ticketCardDate: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: editorialPalette.gold,
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
    ...shadows.medium,
  },
  card: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  cardAccentBar: {
    width: 3,
    backgroundColor: editorialPalette.amber, // overridden per status via inline style
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
    lineHeight: 24,
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
    fontSize: typography.xxs,
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
    backgroundColor: editorialPalette.amber,
    opacity: 0.5,
  },
  cardPrice: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: editorialPalette.amber,
  },

  // ── Empty state (logged in, zero orders) ──────────────────────────────────
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl * 2,
    paddingBottom: TAB_BAR_CLEARANCE,
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: spacing.md,
    opacity: 0.35,
  },
  emptyTitle: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: colours.textOnLight,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: typography.sm,
    color: colours.textMuted,
    textAlign: 'center',
    lineHeight: 20,
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
