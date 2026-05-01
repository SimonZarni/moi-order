import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colours.backgroundLight },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colours.backgroundDark,
    gap: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: colours.textOnDark,
    flex: 1,
  },
  scroll: { flex: 1 },
  content: { padding: spacing.md, gap: spacing.sm },
  // Items
  card: {
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    overflow: 'hidden',
    paddingVertical: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  itemName: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnLight,
    fontWeight: '500',
  },
  itemQty: { fontSize: typography.sm, color: colours.medium, marginRight: spacing.sm },
  itemPrice: { fontSize: typography.sm, fontWeight: '700', color: colours.textOnLight },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  totalLabel: { fontSize: typography.md, fontWeight: '700', color: colours.textOnLight },
  totalValue: { fontSize: typography.md, fontWeight: '800', color: colours.primary },
  // Notes
  notesCard: {
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    padding: spacing.md,
  },
  notesText: { fontSize: typography.sm, color: colours.medium, lineHeight: 20 },
  // State boxes
  stateBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  stateText: { fontSize: typography.md, color: colours.textMuted, textAlign: 'center', marginTop: spacing.sm },
  cancelledCard: {
    backgroundColor: '#fee2e2',
    borderRadius: radius.xl,
    padding: spacing.md,
  },
  cancelledText: { fontSize: typography.sm, color: '#b91c1c', fontWeight: '600', textAlign: 'center' },
});
