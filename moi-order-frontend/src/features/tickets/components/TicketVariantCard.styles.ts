import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    padding: spacing.md,
    ...shadows.medium,
  },

  // ── Single-price layout ────────────────────────────────────────────────────
  variantInfo: { flex: 1 },
  variantName: { fontSize: typography.sm, fontWeight: '700', color: colours.textOnLight, marginBottom: 2 },
  variantDesc: { fontSize: typography.xs, color: colours.textMuted, lineHeight: 16 },
  variantPrice: {
    fontSize: typography.sm,
    fontWeight: '800',
    color: editorialPalette.gold,
    marginTop: 4,
  },
  qtyControl: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colours.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnDisabled: { backgroundColor: colours.medium, opacity: 0.4 },
  qtyBtnText: { color: colours.white, fontSize: 18, fontWeight: '700', lineHeight: 22 },
  qtyValue: { fontSize: typography.md, fontWeight: '800', color: colours.textOnLight, minWidth: 20, textAlign: 'center' },

  // ── Split adult/child layout ────────────────────────────────────────────────
  headerBlock: { marginBottom: spacing.sm },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  priceRowLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  personLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    minWidth: 40,
  },
  rowDivider: { height: 1, backgroundColor: 'rgba(0,0,0,0.06)', marginVertical: 2 },
});
