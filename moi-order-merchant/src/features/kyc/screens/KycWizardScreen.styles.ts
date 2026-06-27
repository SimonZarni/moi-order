import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colours.surface,
  },
  stepIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colours.surface,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
    position: 'relative',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },
  logoutBtn: {
    position: 'absolute',
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.xs,
  },
  logoutBtnText: {
    fontSize: typography.xs,
    color: colours.textSubtle,
  },
  stepDot: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colours.divider,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colours.surfaceMuted,
  },
  stepDotActive: {
    borderColor: colours.primary,
    backgroundColor: colours.primary,
    shadowColor: colours.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  stepDotText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textSubtle,
  },
  stepDotTextActive: {
    color: colours.white,
  },
  errorBanner: {
    backgroundColor: colours.error + '15',
    color: colours.error,
    padding: spacing.md,
    fontSize: typography.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colours.error + '30',
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
});
