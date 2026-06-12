import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.surface },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl },

  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  backBtnText: {
    fontSize: typography.sm,
    color: colours.primary,
    fontWeight: '600',
  },

  title: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.5,
    lineHeight: 60,
    marginBottom: spacing.lg,
  },

  tableHeader: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  headerCell: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  colDay:    { width: 48 },
  colTime:   { flex: 1, paddingHorizontal: spacing.xs },
  colToggle: { width: 56, alignItems: 'center' },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
    minHeight: 48,
  },
  dayLabel: {
    width: 48,
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textOnLight,
  },
  timeInput: {
    flex: 1,
    marginHorizontal: spacing.xs,
    backgroundColor: colours.surfaceMuted,
    borderWidth: 1,
    borderColor: colours.divider,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: typography.sm,
    color: colours.textOnLight,
    minHeight: 36,
    textAlign: 'center',
  },
  timeInputDisabled: {
    opacity: 0.3,
  },
  closedLabel: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    fontSize: typography.xs,
    color: colours.textSubtle,
    textAlign: 'center',
  },
  toggleCell: {
    width: 56,
    alignItems: 'center',
  },

  errorBanner: {
    backgroundColor: colours.errorBg,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colours.error + '33',
  },
  errorText: {
    fontSize: typography.sm,
    color: colours.error,
  },

  saveBtn: {
    backgroundColor: colours.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.white,
  },
});
