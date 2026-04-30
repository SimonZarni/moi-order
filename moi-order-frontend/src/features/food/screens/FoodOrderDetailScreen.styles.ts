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
  content: { padding: spacing.md, gap: spacing.md },
  // Status timeline
  timeline: {
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    padding: spacing.md,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colours.infoBg,
    backgroundColor: colours.backgroundLight,
    marginTop: 2,
  },
  timelineDotActive: {
    borderColor: colours.primary,
    backgroundColor: colours.primary,
  },
  timelineDotDone: {
    borderColor: colours.primary,
    backgroundColor: 'transparent',
  },
  timelineLine: {
    width: 2,
    height: spacing.lg,
    backgroundColor: colours.infoBg,
    marginLeft: 9,
  },
  timelineLineActive: { backgroundColor: colours.primary },
  timelineLabel: {
    fontSize: typography.sm,
    color: colours.textMuted,
    fontWeight: '500',
    flex: 1,
    paddingBottom: spacing.md,
  },
  timelineLabelActive: {
    color: colours.textOnLight,
    fontWeight: '700',
  },
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
  // LINE Pay button
  linePayBtn: {
    backgroundColor: '#06C755',
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  linePayText: {
    fontSize: typography.md,
    fontWeight: '800',
    color: colours.white,
    letterSpacing: 0.3,
  },
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
