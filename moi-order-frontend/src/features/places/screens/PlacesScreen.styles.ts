import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import { TAB_BAR_CLEARANCE } from '@/shared/components/FloatingTabBar/FloatingTabBar.styles';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colours.backgroundDark,
  },

  // Light spacer that creates the rounded sheet transition below the hero
  bodyGap: {
    height: spacing.xl,
    backgroundColor: colours.backgroundLight,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    marginTop: -spacing.xl,
  },

  // ── Sticky section (tab row, never scrolls) ──────────────────────────────
  stickyTabBar: {
    backgroundColor: colours.backgroundLight,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
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

  // ── List ──────────────────────────────────────────────────────────────────
  list: {
    paddingBottom: TAB_BAR_CLEARANCE,
    backgroundColor: colours.backgroundLight,
  },

  ticketCardsContainer: {
    paddingHorizontal: spacing.lg,
  },

  // ── State views ───────────────────────────────────────────────────────────
  stateBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
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
