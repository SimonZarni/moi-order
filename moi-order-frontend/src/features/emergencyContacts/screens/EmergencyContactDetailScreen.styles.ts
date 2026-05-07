import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: colours.backgroundLight },
  scroll: { flex: 1 },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: typography.sm,
    color: colours.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },

  heroImage: {
    width: '100%',
    height: 220,
    backgroundColor: colours.backgroundDark,
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
