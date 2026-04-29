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
    overflow: 'hidden',
    marginBottom: spacing.sm,
    ...shadows.light,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#fff6df',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: '#efd79a',
  },
  warningText: {
    flex: 1,
    fontSize: typography.xs,
    color: colours.secondary,
    lineHeight: 16,
  },
  cardBody: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  thumbnail: {
    width: 90,
    height: 110,
    borderRadius: radius.md,
    backgroundColor: colours.infoBg,
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  subtypeLabel: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  deleteBtn: {
    padding: spacing.xs,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    fontSize: typography.xs,
    color: colours.medium,
    marginBottom: spacing.xs,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  dateLabel: {
    fontSize: typography.xs,
    color: colours.textMuted,
  },
  dateValue: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.textOnLight,
  },
  dateValueAccent: {
    color: colours.primary,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: 2,
  },
  fieldLabel: {
    fontSize: typography.xxs,
    color: colours.textMuted,
    letterSpacing: 0.5,
    minWidth: 70,
  },
  fieldValue: {
    flex: 1,
    fontSize: typography.xxs,
    color: colours.textOnLight,
    fontWeight: '500',
  },
  uploadedAt: {
    fontSize: typography.xxs,
    color: colours.textMuted,
    marginTop: spacing.xs,
  },
});
