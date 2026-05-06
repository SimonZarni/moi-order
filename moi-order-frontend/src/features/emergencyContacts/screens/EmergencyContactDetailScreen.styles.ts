import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colours.backgroundLight },
  scroll: { flex: 1 },

  heroImage: {
    width: '100%',
    height: 240,
    backgroundColor: colours.backgroundDark,
  },
  heroDark: {
    width: '100%',
    height: 240,
    backgroundColor: colours.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroPlaceholderText: {
    fontSize: typography.sm,
    color: colours.textOnDark,
    opacity: 0.5,
  },

  body: {
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colours.textOnLight,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.sm,
    color: colours.textMuted,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },

  infoSection: {
    backgroundColor: colours.card,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colours.backgroundLight,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoText: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnLight,
  },
  infoTextLink: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.primary,
  },
});
