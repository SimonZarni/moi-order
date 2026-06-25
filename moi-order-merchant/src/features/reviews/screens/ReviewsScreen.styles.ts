import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colours.surfaceMuted,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
    backgroundColor: colours.surface,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  pageTitle: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colours.textOnLight,
    flex: 1,
  },
  totalBadge: {
    backgroundColor: colours.primaryBg,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  totalBadgeText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.primaryDark,
  },
  filterRowOuter: {
    height: 44,
  },
  filterRowScroll: {
    flexGrow: 0,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
  },
  filterPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colours.divider,
    backgroundColor: colours.surface,
  },
  filterPillActive: {
    backgroundColor: colours.backgroundDark,
    borderColor: colours.backgroundDark,
  },
  filterPillText: {
    fontSize: typography.xs,
    color: colours.textMuted,
    fontWeight: '500',
  },
  filterPillTextActive: {
    color: colours.textOnDark,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colours.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colours.divider,
    gap: spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  customerName: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textOnLight,
  },
  orderNumber: {
    fontSize: typography.xs,
    color: colours.textSubtle,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    fontSize: typography.sm,
    color: colours.textMuted,
    lineHeight: 20,
  },
  date: {
    fontSize: typography.xs,
    color: colours.textSubtle,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 80,
    gap: spacing.sm,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colours.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: typography.md,
    fontWeight: '600',
    color: colours.textOnLight,
  },
  emptyBody: {
    fontSize: typography.sm,
    color: colours.textSubtle,
    textAlign: 'center',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  pageBtn: {
    padding: spacing.xs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colours.divider,
    backgroundColor: colours.surface,
  },
  pageBtnDisabled: {
    opacity: 0.35,
  },
  pageLabel: {
    fontSize: typography.sm,
    color: colours.textMuted,
  },
  replyBlock: {
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colours.divider,
  },
  replyLabel: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.primaryDark,
    marginBottom: 2,
  },
  replyText: {
    fontSize: typography.sm,
    color: colours.textMuted,
    lineHeight: 20,
  },
  replyBtn: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colours.primaryDark,
  },
  replyBtnText: {
    fontSize: typography.xs,
    color: colours.primaryDark,
    fontWeight: '600',
  },
  replyInput: {
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colours.divider,
    borderRadius: 8,
    padding: spacing.sm,
    fontSize: typography.sm,
    color: colours.textOnLight,
    backgroundColor: colours.backgroundLight,
    minHeight: 72,
    textAlignVertical: 'top',
  },
  replyActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  replySubmitBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colours.primaryDark,
    alignItems: 'center',
  },
  replySubmitText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textOnDark,
  },
  replyCancelBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colours.divider,
    alignItems: 'center',
  },
  replyCancelText: {
    fontSize: typography.sm,
    color: colours.textMuted,
  },
});
