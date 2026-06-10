import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    gap: spacing.sm,
    ...shadows.light,
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardClosed: {
    opacity: 0.45,
  },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: radius.lg,
    backgroundColor: colours.infoBg,
    flexShrink: 0,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    gap: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  name: {
    flex: 1,
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
    lineHeight: 20,
  },
  address: {
    fontSize: typography.xs,
    color: colours.textMuted,
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: 2,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colours.infoBg,
    borderRadius: radius.full,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  metaText: {
    fontSize: typography.xxs,
    fontWeight: '600',
    color: colours.tertiary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    flexShrink: 0,
  },
  statusBadgeOpen:   { backgroundColor: '#dcfce7' },
  statusBadgeClosed: { backgroundColor: colours.infoBg },
  statusBadgePaused: { backgroundColor: '#fef9c3' },
  statusText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusTextOpen:   { color: '#16a34a' },
  statusTextClosed: { color: colours.textMuted },
  statusTextPaused: { color: '#a16207' },
});
