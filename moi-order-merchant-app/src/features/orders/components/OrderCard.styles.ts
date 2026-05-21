import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colours.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  inner: {
    flexDirection: 'row',
  },
  // 6px coloured left strip
  strip: {
    width: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: 6,
  },

  // Row 1
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 38,
    height: 38,
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
  nameBlock: { flex: 1, gap: 2 },
  customerName: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  orderNum: {
    fontSize: typography.xxs,
    color: colours.textMuted,
    fontWeight: '600',
  },
  amount: {
    fontSize: typography.md,
    fontWeight: '900',
    color: colours.textOnLight,
    letterSpacing: -0.3,
    flexShrink: 0,
  },

  // Row 2
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  items: {
    flex: 1,
    fontSize: typography.xs,
    color: colours.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    flexShrink: 0,
  },
  statusText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Row 3
  time: {
    fontSize: typography.xxs,
    color: colours.textMuted,
  },

  // Action button
  actionWrap: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.xs,
  },
  actionWrapDesktop: { alignItems: 'flex-end' },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 40,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionBtnDesktop: { paddingHorizontal: spacing.xl, minHeight: 36 },
  actionBtnText: {
    color: colours.white,
    fontSize: typography.xs,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  // legacy compat keys
  card2: { backgroundColor: colours.surface },
  cardContent: { flexDirection: 'row' },
  statusStrip: { width: 6 },
  cardBody: { flex: 1, padding: spacing.md },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  middleBlock: { flex: 1 },
  rightBlock: { alignItems: 'flex-end' },
  total: { fontSize: typography.md, fontWeight: '900', color: colours.textOnLight },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  customer: { fontSize: typography.sm, fontWeight: '700', color: colours.textOnLight },
  meta: { fontSize: typography.xs, color: colours.textMuted },
  footer: { flexDirection: 'row', justifyContent: 'space-between' },
  date: { fontSize: typography.xxs, color: colours.textMuted },
  actionRow: { paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  actionRowDesktop: { alignItems: 'flex-end' },
  actionButton: { backgroundColor: colours.primary, borderRadius: radius.full, paddingVertical: spacing.sm, alignItems: 'center' },
  actionButtonDesktop: { paddingHorizontal: spacing.xl },
  actionButtonText: { color: colours.white, fontSize: typography.xs, fontWeight: '800' },
});
