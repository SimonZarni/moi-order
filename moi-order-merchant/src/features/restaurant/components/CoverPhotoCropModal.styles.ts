import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#111',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
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
    color: 'rgba(255,255,255,0.4)',
    marginBottom: spacing.sm,
  },
  imageContainer: {
    flex: 1,
  },
  dim: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  cropBorder: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  ruleV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  ruleH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  handle: {
    position: 'absolute',
    width: 14,
    height: 14,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  cancelBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cancelText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.white,
  },
  cropBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colours.primary,
  },
  cropBtnDisabled: {
    opacity: 0.55,
  },
  cropText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.white,
  },
});
