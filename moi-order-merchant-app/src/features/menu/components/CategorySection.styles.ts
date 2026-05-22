import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  // ── Category header ───────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  categoryAvatar: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colours.dividerDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 44,
  },
  title: {
    fontSize: typography.xs,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  count: {
    fontSize: typography.xxs,
    color: 'rgba(255,255,255,0.35)',
    backgroundColor: colours.dividerDark,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontWeight: '600',
  },
  deleteButton: {
    padding: spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // ── Items container ───────────────────────────────────────────────────────────
  items: {
    backgroundColor: colours.backgroundMid,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colours.dividerDark,
  },
  empty: {
    borderWidth: 1,
    borderColor: colours.dividerDark,
    borderStyle: 'dashed',
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.25)',
    textAlign: 'center',
    lineHeight: 20,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
    minHeight: 44,
  },
  addItemText: {
    fontSize: typography.sm,
    color: colours.primary,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  renameRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  renameInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colours.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    fontSize: typography.sm,
    color: colours.textOnDark,
    backgroundColor: colours.backgroundDark,
    minHeight: 36,
  },
  renameAction: {
    padding: spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
