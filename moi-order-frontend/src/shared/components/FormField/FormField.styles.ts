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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.white,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colours.inputBorder,
    paddingHorizontal: spacing.md,
    height: 52,
  },
  inputWrapperError: {
    borderColor: colours.danger,
  },
  input: {
    flex: 1,
    fontSize: typography.md,
    color: colours.textOnLight,
    paddingVertical: 0,
  },
  fieldError: {
    fontSize: typography.xs,
    color: colours.danger,
    marginTop: 4,
    marginLeft: spacing.xs,
  },
});
