import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  sheet: {
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 360,
    gap: spacing.md,
  },
  title: {
    fontSize: typography.md,
    fontWeight: '800',
    color: colours.textOnLight,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.xs,
    color: colours.textMuted,
    textAlign: 'center',
    marginTop: -spacing.xs,
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  preset: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colours.divider,
    backgroundColor: colours.surfaceMuted,
    minWidth: 68,
    alignItems: 'center',
  },
  presetActive: {
    borderColor: colours.primary,
    backgroundColor: colours.primaryBg,
  },
  presetText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textMuted,
  },
  presetTextActive: {
    color: colours.primary,
    fontWeight: '800',
  },
  confirmBtn: {
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  confirmBtnText: {
    fontSize: typography.sm,
    fontWeight: '800',
    color: colours.surface,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  cancelBtnText: {
    fontSize: typography.sm,
    color: colours.textMuted,
  },
});
