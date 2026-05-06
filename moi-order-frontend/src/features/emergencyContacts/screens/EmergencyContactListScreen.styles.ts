import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  root:  { flex: 1, backgroundColor: colours.backgroundLight },
  list:  { flex: 1 },
  contentContainer: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl + spacing.lg },

  card: {
    backgroundColor: colours.card,
    borderRadius: radius.md,
    marginTop: spacing.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardPressed: { opacity: 0.88 },

  coverImage: {
    width: '100%',
    height: 140,
    backgroundColor: colours.backgroundDark,
  },
  cardBody: {
    padding: spacing.md,
  },
  cardTitle: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
    marginBottom: spacing.xs,
  },
  cardLocation: {
    fontSize: typography.sm,
    color: colours.textMuted,
    marginBottom: spacing.xs,
  },
  cardPhone: {
    fontSize: typography.sm,
    color: colours.primary,
  },
  cardChevron: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
  },

  empty: {
    marginTop: spacing.xxl,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    fontSize: typography.md,
    color: colours.textMuted,
    textAlign: 'center',
  },

  footer: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.sm,
    color: colours.textMuted,
  },
});
