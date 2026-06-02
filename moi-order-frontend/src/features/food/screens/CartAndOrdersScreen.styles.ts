import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colours.backgroundDark },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colours.backgroundDark,
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: colours.textOnDark,
    flex: 1,
  },
  scroll: { flex: 1, backgroundColor: colours.backgroundLight },
  content: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xxl },
  sectionLabel: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  ordersSectionLabel: { marginTop: spacing.lg },
  loader:     { marginVertical: spacing.md },
  errorText:  { fontSize: typography.sm, color: colours.textMuted, textAlign: 'center', paddingVertical: spacing.md },
  emptyOrders: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.xs,
  },
  emptyText: {
    fontSize: typography.sm,
    color: colours.textMuted,
    fontWeight: '500',
  },
});
