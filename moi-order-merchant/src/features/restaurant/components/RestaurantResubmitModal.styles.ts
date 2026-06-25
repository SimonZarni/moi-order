import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colours.backgroundDark,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingBottom: spacing.xl,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: colours.textOnDark,
    flex: 1,
    lineHeight: 50,
  },
  body: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  note: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 22,
  },
  noteCenter: { textAlign: 'center' },
  label: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    fontSize: typography.sm,
    color: colours.textOnDark,
  },
  inputMultiline: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  primaryBtn: {
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.full,
    backgroundColor: colours.primary,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  primaryBtnText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.backgroundDark,
  },
  disabled: { opacity: 0.4 },
  docsScroll: { maxHeight: 480 },
  docsBody: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  useExistingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.primary + '55',
    backgroundColor: colours.primary + '15',
  },
  useExistingText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.primary,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.xs,
  },
  orLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.12)' },
  orText: {
    fontSize: typography.xxs,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: 6,
  },
  docLabel: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnDark,
    fontWeight: '500',
  },
  docReady: {
    fontSize: typography.xxs,
    color: colours.success,
    fontWeight: '700',
  },
  docBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.primary + '55',
    backgroundColor: colours.primary + '15',
  },
  docBtnText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.primary,
  },
  docProgress: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    fontWeight: '600',
  },
  doneIcon: {
    alignSelf: 'center',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
});
