import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colours.divider,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  title: {
    fontSize: typography.md,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.3,
  },
  loader: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
