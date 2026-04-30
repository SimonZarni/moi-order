import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    ...shadows.light,
  },
  cover: {
    width: '100%',
    height: 140,
    backgroundColor: colours.infoBg,
  },
  body: {
    padding: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colours.infoBg,
    marginRight: spacing.sm,
  },
  nameBlock: {
    flex: 1,
  },
  name: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
    lineHeight: 22,
  },
  address: {
    fontSize: typography.xs,
    color: colours.medium,
    lineHeight: 16,
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
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
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: typography.xs,
    color: colours.medium,
  },
});
