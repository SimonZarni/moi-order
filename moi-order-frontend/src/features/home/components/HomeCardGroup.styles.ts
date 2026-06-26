import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    borderTopWidth: 2.5,
    borderTopColor: colours.tertiary,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.medium,
  },

  groupIcon: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    opacity: 0.75,
  },

  cardTag: {
    fontSize: typography.xxs,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
    lineHeight: 16,
  },

  cardTitle: {
    fontSize: typography.lg,
    fontWeight: '800',
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

  tileRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  tile: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    minHeight: 100,
  },

  tileDimmed: {
    opacity: 0.40,
  },

  tileIconWrap: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },

  tileLabel: {
    fontSize: typography.xxs,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 16,
    letterSpacing: 0.1,
  },

  soonPill: {
    marginTop: 4,
    backgroundColor: colours.infoBg,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    paddingVertical: 2,
    paddingHorizontal: 6,
  },

  soonText: {
    fontSize: 7,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // ── Myanmar (mm) locale overrides ─────────────────────────────────────────
  // Any letterSpacing > 0 splits Myanmar glyph clusters (base + stacked diacritics).
  mmCardTag: {
    letterSpacing: 0,
    lineHeight: 18,       // typography.xxs (9) × 2.0
  },
  mmCardTitle: {
    letterSpacing: 0,
    lineHeight: 32,       // typography.lg (17) × 1.9
    writingDirection: 'ltr',
  },
  mmCardSubtitle: {
    letterSpacing: 0,
    lineHeight: 22,       // typography.xs (11) × 2.0
    writingDirection: 'ltr',
  },
  mmTileLabel: {
    letterSpacing: 0,
    lineHeight: 18,       // typography.xxs (9) × 2.0
    writingDirection: 'ltr',
  },
});
