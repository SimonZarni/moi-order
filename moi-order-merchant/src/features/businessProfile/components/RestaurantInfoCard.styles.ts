import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colours.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colours.divider,
    overflow: 'hidden',
    paddingBottom: spacing.sm,
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  restaurantName: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: typography.xs,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colours.divider,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  detailLabel: {
    fontSize: typography.sm,
    color: colours.textMuted,
    width: 70,
  },
  detailValue: {
    fontSize: typography.sm,
    color: colours.textOnLight,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colours.surfaceMuted,
    borderWidth: 1,
    borderColor: colours.divider,
  },
  optionChipActive: {
    backgroundColor: colours.primaryBg,
    borderColor: colours.primary + '55',
  },
  optionText: {
    fontSize: typography.xs,
    color: colours.textSubtle,
    fontWeight: '500',
  },
  optionTextActive: {
    color: colours.primary,
  },
  editHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  editHintText: {
    fontSize: typography.xs,
    color: colours.textSubtle,
    lineHeight: 16,
  },
});
