import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { spacing } from '@/shared/theme/spacing';
import { radius } from '@/shared/theme/radius';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colours.white,
    borderRadius: radius.sheet,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    width: '100%',
    maxWidth: 360,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colours.textOnLight,
    letterSpacing: 0.3,
  },
  body: {
    fontSize: typography.sm,
    color: colours.textMuted,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  closeButton: {
    backgroundColor: colours.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colours.white,
    fontSize: typography.md,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
