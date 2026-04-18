import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import { TAB_BAR_CLEARANCE } from '@/shared/components/FloatingTabBar/FloatingTabBar.styles';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colours.backgroundDark },
  flatList: { backgroundColor: colours.backgroundLight },

  bodyGap: {
    height: spacing.xl,
    backgroundColor: colours.backgroundLight,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    marginTop: -spacing.xl,
  },

  list: {
    paddingBottom: TAB_BAR_CLEARANCE,
    backgroundColor: colours.backgroundLight,
  },

  cardsContainer: {
    paddingHorizontal: spacing.lg,
  },

  // ── Ticket card ───────────────────────────────────────────────────────────
  cardWrap: {
    marginBottom: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colours.card,
    overflow: 'hidden',
    ...shadows.medium,
  },
  cardImage: {
    width: '100%',
    height: 140,
    backgroundColor: colours.backgroundDark,
  },
  cardBody: {
    padding: spacing.md,
  },
  cardName: {
    fontSize: typography.md,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  cardHighlight: {
    fontSize: typography.xs,
    color: colours.textMuted,
    marginBottom: spacing.sm,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLocation: {
    fontSize: typography.xs,
    color: colours.medium,
  },
  cardPrice: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: editorialPalette.gold,
  },

  // ── Empty / Error ─────────────────────────────────────────────────────────
  stateBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: TAB_BAR_CLEARANCE,
    backgroundColor: colours.backgroundLight,
  },
  stateIcon:     { fontSize: 36, marginBottom: spacing.sm, opacity: 0.5 },
  stateTitle:    { fontSize: typography.md, fontWeight: '700', color: colours.textOnLight, marginBottom: 4 },
  stateSubtitle: { fontSize: typography.sm, color: colours.textMuted },
  spinner:       { color: colours.tertiary } as unknown as { color: string },
  listFooter:    { paddingVertical: spacing.lg },
});
