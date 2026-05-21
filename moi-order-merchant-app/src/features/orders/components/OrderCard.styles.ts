import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colours.surface,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  cardContent: {
    flexDirection: 'row',
  },
  // Left colored status strip
  statusStrip: {
    width: 4,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  // Customer avatar
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: typography.xs,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  middleBlock: {
    flex: 1,
    gap: 2,
  },
  orderNumber: {
    fontSize: typography.sm,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.2,
  },
  customer: {
    fontSize: typography.xs,
    fontWeight: '500',
    color: colours.textMuted,
  },
  rightBlock: {
    alignItems: 'flex-end',
    gap: 4,
    flexShrink: 0,
  },
  total: {
    fontSize: typography.md,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.3,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  statusText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  items: {
    fontSize: typography.xs,
    color: colours.textMuted,
    flex: 1,
  },
  date: {
    fontSize: typography.xxs,
    color: colours.textMuted,
    flexShrink: 0,
  },
  // unused but kept for type compat
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  meta: { fontSize: typography.xs, color: colours.textMuted },
  footer: { flexDirection: 'row', justifyContent: 'space-between' },

  // ── Action button ──────────────────────────────────────────────────────────
  actionRow: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: 0,
  },
  actionRowDesktop: { alignItems: 'flex-end' },
  actionButton: {
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
    shadowColor: colours.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  actionButtonDesktop: {
    paddingHorizontal: spacing.xl,
    minHeight: 32,
  },
  actionButtonText: {
    color: colours.white,
    fontSize: typography.xs,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
