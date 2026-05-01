import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  gridRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },

  card: {
    flex: 1,
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    borderTopWidth: 2.5,
    borderTopColor: colours.tertiary,
    padding: spacing.md,
    minHeight: 148,
    ...shadows.medium,
  },

  cardDimmed: {
    opacity: 0.45,
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

  cardIcon: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    opacity: 0.8,
  },

  customIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  customIconImage: {
    width: 34,
    height: 34,
  },

  soonPill: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colours.infoBg,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    paddingVertical: 2,
    paddingHorizontal: 7,
  },

  soonText: {
    fontSize: 8,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  skeletonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },

  skeletonCard: {
    flex: 1,
    height: 148,
    borderRadius: radius.xl,
    backgroundColor: colours.card,
    opacity: 0.6,
  },
});
