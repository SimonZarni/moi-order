import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.xxl,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    backgroundColor: colours.primary,
    borderRadius: radius.md,
  },
  editButtonText: {
    color: colours.white,
    fontSize: typography.sm,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colours.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs / 2,
  },
  divider: {
    height: 1,
    backgroundColor: colours.divider,
  },
  infoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs / 2,
  },
  infoLabel: {
    width: 90,
    fontSize: typography.sm,
    color: colours.textMuted,
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnLight,
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  statusChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full ?? 100,
    borderWidth: 1.5,
    borderColor: colours.divider,
  },
  statusChipActive: {
    borderColor: 'transparent',
  },
  statusChipText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textMuted,
  },
  inputLabel: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs / 2,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colours.divider,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.sm,
    fontSize: typography.sm,
    color: colours.textOnLight,
    backgroundColor: colours.surfaceMuted,
  },
  inputMultiline: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colours.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: colours.white,
    fontSize: typography.sm,
    fontWeight: '700',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colours.divider,
  },
  cancelButtonText: {
    color: colours.textMuted,
    fontSize: typography.sm,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.backgroundLight,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontSize: typography.sm,
    color: colours.textOnLight,
    fontWeight: '500',
  },
  toggleSub: {
    fontSize: typography.xs,
    color: colours.textMuted,
    marginTop: 2,
  },
});
