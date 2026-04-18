import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colours.backgroundDark,
    paddingHorizontal: spacing.xl + spacing.sm, // 40
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    overflow: 'hidden',
    minHeight: 180,
  },

  // Decorative orbs — backgroundColor applied inline via accentColor prop
  orbLarge: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: radius.orbLarge,
    opacity: 0.07,
    top: -60,
    right: -40,
  },
  orbSmall: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: radius.orbSmall,
    backgroundColor: colours.tertiary,
    opacity: 0.05,
    bottom: 10,
    left: -20,
  },

  // Spacer used when hideBack=true — preserves text position
  backPlaceholder: {
    height: 36,
    marginBottom: spacing.sm,
  },

  // Pill back button
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.38)',
    borderRadius: radius.full,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    minHeight: 36,
    marginBottom: spacing.sm,
  },
  backArrow: {
    fontSize: 22,
    color: colours.tertiary,
    lineHeight: 26,
    fontWeight: '300',
  },
  backLabel: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.tertiary,
    letterSpacing: 0.2,
  },

  textBlock: {
    marginTop: spacing.xs,
  },
  // eyebrow color applied inline via accentColor prop
  eyebrow: {
    fontSize: typography.xxs,
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: typography.hero,
    fontWeight: '900',
    color: colours.textOnDark,
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: typography.xs,
    color: colours.medium,
    marginTop: 4,
    lineHeight: 18,
  },
});
