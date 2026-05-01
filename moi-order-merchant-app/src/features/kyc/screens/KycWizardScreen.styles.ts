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
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    backgroundColor: colours.card,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colours.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    borderColor: colours.primary,
    backgroundColor: colours.primary,
  },
  stepDotText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.medium,
  },
  stepDotTextActive: {
    color: colours.white,
  },
  errorBanner: {
    backgroundColor: colours.error + '1A',
    color: colours.error,
    padding: spacing.md,
    fontSize: typography.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: radius.md,
  },
});
