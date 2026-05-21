import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colours.backgroundDark,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.backgroundLight,
    gap: spacing.sm,
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  sectionGroup: {
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: typography.xxs,
    fontWeight: '800',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  empty: {
    textAlign: 'center',
    color: colours.medium,
    fontSize: typography.md,
    marginTop: spacing.xxl,
  },

  // ── Filter bar (dark, sticks to hero header) ───────────────────────────────
  filterBar: {
    backgroundColor: colours.backgroundDark,
  },

  // Tab row — pill style on dark background
  statusTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  statusTabsScroll: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  statusTab: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  statusTabActive: {
    backgroundColor: colours.primary,
    borderColor: colours.primary,
  },
  statusTabText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
  },
  statusTabTextActive: {
    color: colours.white,
    fontWeight: '700',
  },

  // ── Date navigator row ─────────────────────────────────────────────────────
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colours.backgroundMid,
  },
  dateArrow: {
    width: 30,
    height: 30,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dateLabel: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnDark,
    minWidth: 120,
    textAlign: 'center',
  },
  dateTodayBtn: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colours.primary + '22',
    borderWidth: 1,
    borderColor: colours.primary + '55',
  },
  dateTodayText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.primary,
  },
});
