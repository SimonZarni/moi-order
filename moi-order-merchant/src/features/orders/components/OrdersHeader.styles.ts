import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colours.surface,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
    zIndex: 100,
    overflow: 'visible',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.display,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.8,
  },
  pendingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colours.warning + '18',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colours.warning + '55',
  },
  pendingDot: {
    width: 7,
    height: 7,
    borderRadius: radius.full,
    backgroundColor: colours.warning,
  },
  pendingText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.warning,
  },
  overflowWrapper: {
    position: 'relative',
    zIndex: 101,
  },
  overflowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colours.surfaceMuted,
    borderWidth: 1,
    borderColor: colours.divider,
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: colours.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colours.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 24,
    minWidth: 190,
    overflow: 'hidden',
    zIndex: 102,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
  },
  dropdownDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colours.divider,
  },
  dropdownText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textOnLight,
  },
});
