import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  fieldGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.secondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  picker: {
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colours.inputBorder,
    backgroundColor: colours.infoBg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 72,
  },
  pickerError: {
    borderColor: colours.danger,
    backgroundColor: 'rgba(197,0,15,0.04)',
  },
  pickerUploaded: {
    borderStyle: 'solid',
    borderColor: colours.success,
    backgroundColor: 'rgba(45,213,91,0.06)',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colours.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconBoxUploaded: {
    backgroundColor: colours.success,
  },
  iconText: {
    fontSize: typography.lg,
    color: colours.white,
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textOnLight,
  },
  hint: {
    fontSize: typography.xs,
    color: colours.textMuted,
    marginTop: 2,
  },
  hintUploaded: {
    color: colours.success,
  },
  fieldError: {
    fontSize: typography.xs,
    color: colours.danger,
    marginTop: 4,
    marginLeft: spacing.xs,
  },
});
