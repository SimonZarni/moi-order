import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colours.backgroundDark },
  scroll: { flex: 1, backgroundColor: colours.backgroundDark },
  backBtn: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBlock: {
    backgroundColor: colours.card,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  restaurantName: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.3,
    lineHeight: 60,
    marginBottom: 4,
  },
  description: {
    fontSize: typography.sm,
    color: colours.medium,
    lineHeight: 20,
    marginBottom: 4,
  },
  address: {
    fontSize: typography.sm,
    color: colours.medium,
    lineHeight: 20,
  },
  closingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  closingText: {
    fontSize: typography.xs,
    color: colours.medium,
    fontWeight: '500',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  statusText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  categoryHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colours.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  categoryName: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  itemsCard: {
    backgroundColor: colours.card,
    marginBottom: 1,
  },
  emptyMenu: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyMenuText: {
    fontSize: typography.sm,
    color: colours.textMuted,
  },
  cartBarSpace: {
    height: 200,
    backgroundColor: colours.backgroundLight,
  },
  stateBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  stateText: {
    fontSize: typography.md,
    color: colours.textMuted,
    textAlign: 'center',
  },
});
