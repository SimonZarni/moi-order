import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colours.divider,
    padding: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  preview: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colours.surfaceMuted,
  },
  thumbnail: {
    width: 56,
    height: 56,
  },
  viewOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: 3,
    borderTopLeftRadius: radius.sm,
  },
  placeholder: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colours.surfaceMuted,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colours.divider,
    borderStyle: 'dashed',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  docLabel: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textOnLight,
    lineHeight: 20,
  },
  uploadDate: {
    fontSize: typography.xs,
    color: colours.textMuted,
    lineHeight: 16,
  },
  missingText: {
    fontSize: typography.xs,
    color: colours.textSubtle,
    lineHeight: 16,
  },
  replaceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colours.primary + '66',
    backgroundColor: colours.primaryBg,
    minWidth: 80,
    minHeight: 36,
    justifyContent: 'center',
  },
  replaceBtnEmpty: {
    borderColor: colours.divider,
    backgroundColor: colours.surfaceMuted,
  },
  replaceBtnText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.primary,
  },
  replaceBtnTextEmpty: {
    color: colours.textMuted,
  },
});
