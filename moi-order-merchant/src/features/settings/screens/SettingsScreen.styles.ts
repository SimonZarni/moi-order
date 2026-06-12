import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.surface },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xxl },

  header: {
    backgroundColor: colours.backgroundDark,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headerTitle: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colours.textOnDark,
    letterSpacing: -0.5,
    lineHeight: 60,
  },

  sectionHeader: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },

  card: {
    backgroundColor: colours.surface,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colours.divider,
    overflow: 'hidden',
  },

  row: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  rowLabel: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textOnLight,
    marginBottom: spacing.sm,
    lineHeight: 44,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colours.divider,
    backgroundColor: colours.surfaceMuted,
  },
  chipActive: {
    borderColor: colours.primary,
    backgroundColor: colours.primaryBg,
  },
  chipText: {
    fontSize: typography.sm,
    fontWeight: '500',
    color: colours.textMuted,
    lineHeight: 44,
  },
  chipTextActive: {
    color: colours.primary,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: colours.divider,
    marginLeft: spacing.md,
  },

  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 52,
  },
  navRowLabel: {
    flex: 1,
    fontSize: typography.sm,
    fontWeight: '500',
    color: colours.textOnLight,
    lineHeight: 44,
  },
});
