import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm + spacing.xs,   // 12 — tighter gap between cards
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(34,78,74,0.12)',
    shadowColor: colours.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  // ── Image ─────────────────────────────────────────────────────────────────
  imageContainer: {
    position: 'relative',
    height: 108,
  },
  image: {
    width: '100%',
    height: 108,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 108,
    backgroundColor: colours.infoBg,
  },
  // Category badge sits on the image — visually merges image and content
  badge: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + spacing.xs,  // 12
    paddingVertical: 3,
  },
  badgeText: {
    color: colours.white,
    fontSize: typography.xs,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },

  // ── Content ───────────────────────────────────────────────────────────────
  content: {
    paddingHorizontal: spacing.sm + spacing.xs,  // 12
    paddingTop: spacing.sm + spacing.xs,          // 12
    paddingBottom: spacing.sm + spacing.xs,       // 12
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  name: {
    flex: 1,
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
    letterSpacing: -0.2,
  },
  arrow: {
    fontSize: typography.lg,
    color: colours.tertiary,
    fontWeight: '300',
    marginLeft: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  city: {
    fontSize: typography.xs,
    color: colours.textMuted,
    fontWeight: '500',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colours.tertiary,
    marginHorizontal: spacing.xs,
    opacity: 0.5,
  },
  hours: {
    fontSize: typography.xs,
    color: colours.textMuted,
    flex: 1,
  },
});
