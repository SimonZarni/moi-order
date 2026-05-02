import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  header: {
    marginBottom: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.xxl,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  headerSub: {
    fontSize: typography.sm,
    color: colours.textMuted,
    marginTop: spacing.xs / 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: colours.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statIconBg: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: typography.xs,
    color: colours.textMuted,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: typography.xxl,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  statSub: {
    fontSize: typography.xs,
    color: colours.textMuted,
  },
  sectionCard: {
    backgroundColor: colours.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  sectionTitle: {
    fontSize: typography.md,
    fontWeight: '600',
    color: colours.textOnLight,
  },
  sectionAction: {
    fontSize: typography.sm,
    color: colours.primary,
    fontWeight: '600',
  },
  pendingBadge: {
    backgroundColor: colours.warningBg,
    borderRadius: radius.full ?? 100,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
  },
  pendingBadgeText: {
    fontSize: typography.xs,
    color: colours.warning,
    fontWeight: '600',
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.sm,
    color: colours.textMuted,
    marginTop: spacing.sm,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.backgroundLight,
  },
});
