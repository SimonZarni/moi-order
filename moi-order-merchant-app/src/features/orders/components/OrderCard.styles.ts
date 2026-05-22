import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: colours.dividerDark,
  },
  inner: { flexDirection: 'row' },
  // Left coloured strip
  strip: { width: 4 },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: typography.sm,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  nameBlock: { flex: 1 },
  customerName: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnDark,
  },
  orderNum: {
    fontSize: typography.xxs,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
    marginTop: 1,
  },
  rightBlock: { alignItems: 'flex-end', gap: 4 },
  amount: {
    fontSize: typography.md,
    fontWeight: '800',
    color: colours.textOnDark,
    letterSpacing: -0.3,
  },
  statusBadge: {
    paddingHorizontal: 8,
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
  row2: { marginLeft: 40 + spacing.sm },
  items: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 2,
  },
  time: {
    fontSize: typography.xxs,
    color: 'rgba(255,255,255,0.3)',
  },

  // Action button
  actionWrap: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: 0,
    paddingLeft: spacing.md + 4 + 40 + spacing.sm,
  },
  actionWrapDesktop: { paddingLeft: spacing.md, alignItems: 'flex-end' },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    minHeight: 34,
    alignSelf: 'flex-start',
    shadowColor: colours.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  actionBtnDesktop: { paddingHorizontal: spacing.xl },
  actionBtnText: {
    color: colours.backgroundDark,
    fontSize: typography.xs,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  // legacy compat
  card2: { backgroundColor: 'transparent' },
  cardContent: { flexDirection: 'row' },
  statusStrip: { width: 4 },
  cardBody: { flex: 1, padding: spacing.md },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  middleBlock: { flex: 1 },
  total: { fontSize: typography.md, fontWeight: '900', color: colours.textOnDark },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  customer: { fontSize: typography.sm, fontWeight: '700', color: colours.textOnDark },
  meta: { fontSize: typography.xs, color: 'rgba(255,255,255,0.4)' },
  footer: { flexDirection: 'row', justifyContent: 'space-between' },
  date: { fontSize: typography.xxs, color: 'rgba(255,255,255,0.3)' },
  actionRow: { paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  actionRowDesktop: { alignItems: 'flex-end' },
  actionButton: { backgroundColor: colours.primary, borderRadius: radius.full, paddingVertical: spacing.sm, alignItems: 'center' },
  actionButtonDesktop: { paddingHorizontal: spacing.xl },
  actionButtonText: { color: colours.backgroundDark, fontSize: typography.xs, fontWeight: '800' },
});
