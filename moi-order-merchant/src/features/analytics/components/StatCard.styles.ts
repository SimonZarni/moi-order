import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colours.divider,
    gap: 3,
  },
  cardHighlight: {
    borderColor: colours.primary + '55',
    backgroundColor: colours.primaryBg,
  },
  cardPressed: {
    opacity: 0.85,
  },
  accentBadge: {
    width: 28,
    height: 28,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  accentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  value: {
    fontSize: typography.xl,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: colours.textOnLight,
  },
  sub: {
    fontSize: typography.xxs,
    color: colours.textSubtle,
    marginTop: 1,
  },
});
