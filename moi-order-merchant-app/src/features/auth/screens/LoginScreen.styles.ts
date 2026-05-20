import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  // ── Web: split-screen layout ───────────────────────────────────────────────
  screen: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPanel: {
    width: '42%',
    backgroundColor: colours.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.md,
  },
  brandMark: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colours.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  brandMarkText: {
    fontSize: typography.xxl,
    fontWeight: '800',
    color: colours.white,
    letterSpacing: -0.5,
  },
  brandName: {
    fontSize: typography.xxl,
    fontWeight: '700',
    color: colours.textOnDark,
    letterSpacing: -0.5,
  },
  brandRole: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  brandDivider: {
    width: 40,
    height: 1,
    backgroundColor: colours.dividerDark,
    marginVertical: spacing.xs,
  },
  brandTagline: {
    fontSize: typography.sm,
    color: colours.textSubtle,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 260,
  },
  rightPanel: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formScroll: {
    flex: 1,
    width: '100%',
  },
  formCard: {
    flexGrow: 1,
    justifyContent: 'center',
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
    padding: spacing.xxl,
  },
  formTitle: {
    fontSize: typography.xxl,
    fontWeight: '700',
    color: colours.textOnLight,
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  formSubtitle: {
    fontSize: typography.sm,
    color: colours.textMuted,
    marginBottom: spacing.xl,
  },

  // ── Mobile layout ──────────────────────────────────────────────────────────
  safe: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.xxl,
    fontWeight: '700',
    color: colours.textOnLight,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sm,
    color: colours.textMuted,
    marginBottom: spacing.xl,
  },

  // ── Shared form elements ───────────────────────────────────────────────────
  errorBanner: {
    backgroundColor: colours.error + '1A',
    color: colours.error,
    padding: spacing.md,
    borderRadius: radius.md,
    fontSize: typography.sm,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colours.card,
    borderWidth: 1,
    borderColor: colours.divider,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: typography.md,
    color: colours.textOnLight,
    marginBottom: spacing.md,
    minHeight: 44,
  },
  button: {
    backgroundColor: colours.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colours.white,
    fontSize: typography.md,
    fontWeight: '600',
  },
  link: {
    color: colours.primary,
    fontSize: typography.sm,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    minHeight: 44,
    textAlignVertical: 'center',
  },
});
