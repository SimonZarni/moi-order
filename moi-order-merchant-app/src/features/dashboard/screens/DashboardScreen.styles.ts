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
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  header: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.xxl,
    fontWeight: '700',
    color: colours.textOnLight,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: typography.sm,
    color: colours.textMuted,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: 148,
    backgroundColor: colours.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colours.divider,
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  statIconBg: {
    width: 34,
    height: 34,
    borderRadius: radius.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: typography.xs,
    color: colours.textMuted,
    fontWeight: '600',
    flex: 1,
  },
  statValue: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colours.textOnLight,
    letterSpacing: -0.5,
  },
  statSub: {
    fontSize: typography.xs,
    color: colours.textMuted,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: colours.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colours.divider,
    overflow: 'hidden',
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
  pendingBadge: {
    backgroundColor: colours.warningBg,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colours.warning + '33',
  },
  pendingBadgeText: {
    fontSize: typography.xs,
    color: colours.warning,
    fontWeight: '600',
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: typography.sm,
    color: colours.textMuted,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.backgroundLight,
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: typography.sm,
    color: colours.textMuted,
  },
});
