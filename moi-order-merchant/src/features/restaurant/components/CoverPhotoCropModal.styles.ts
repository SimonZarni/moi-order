import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.md,
    fontWeight: '600',
    color: colours.white,
  },
  headerSpacer: {
    width: 40,
  },
  hint: {
    textAlign: 'center',
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.45)',
    marginBottom: spacing.md,
  },
  viewportWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewport: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    minHeight: 48,
  },
  cancelText: {
    fontSize: typography.md,
    fontWeight: '600',
    color: colours.white,
  },
  cropBtn: {
    flex: 2,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colours.primary,
    minHeight: 48,
  },
  cropBtnDisabled: {
    opacity: 0.55,
  },
  cropText: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.white,
  },
});
