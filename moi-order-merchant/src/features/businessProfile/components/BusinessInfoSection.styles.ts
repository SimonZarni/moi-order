import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
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
  card: {
    backgroundColor: colours.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colours.divider,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    minHeight: 44,
  },
  infoLabel: {
    fontSize: typography.sm,
    color: colours.textMuted,
    flex: 1,
  },
  infoValue: {
    fontSize: typography.sm,
    color: colours.textOnLight,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colours.divider,
    marginHorizontal: spacing.md,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },
  phoneInput: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnLight,
    borderWidth: 1,
    borderColor: colours.divider,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minHeight: 36,
    textAlign: 'right',
  },
  phoneInputError: {
    borderColor: colours.error,
  },
  editAction: {
    padding: spacing.xs,
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldError: {
    fontSize: typography.xs,
    color: colours.error,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    lineHeight: 16,
  },
  notesCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.sm,
    backgroundColor: colours.warningBg,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colours.warning + '44',
  },
  notesText: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.warning,
    lineHeight: 20,
  },
});
