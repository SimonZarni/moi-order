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
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    backgroundColor: colours.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    shadowColor: colours.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  brandMarkText: {
    fontSize: typography.xxl,
    fontWeight: '900',
    color: colours.white,
    letterSpacing: -0.5,
  },
  brandName: {
    fontSize: typography.xxl,
    fontWeight: '800',
    color: colours.textOnDark,
    letterSpacing: -0.5,
  },
  brandRole: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.primary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  brandDivider: {
    width: 32,
    height: 1.5,
    backgroundColor: colours.primary + '44',
    marginVertical: spacing.xs,
  },
  brandTagline: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.45)',
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
    fontWeight: '800',
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
    backgroundColor: colours.backgroundDark,
  },
  container: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    justifyContent: 'center',
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
  },
  title: {
    fontSize: typography.xxl,
    fontWeight: '800',
    color: colours.textOnLight,
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: typography.sm,
    color: colours.textMuted,
    marginBottom: spacing.xl,
  },

  // ── Shared form elements ───────────────────────────────────────────────────
  errorBanner: {
    backgroundColor: colours.error + '15',
    color: colours.error,
    padding: spacing.md,
    borderRadius: radius.lg,
    fontSize: typography.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colours.error + '30',
  },
  input: {
    backgroundColor: colours.surfaceMuted,
    borderWidth: 1.5,
    borderColor: colours.divider,
    borderRadius: radius.lg,
    padding: spacing.md,
    fontSize: typography.md,
    color: colours.textOnLight,
    marginBottom: spacing.md,
    minHeight: 52,
  },
  button: {
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    marginBottom: spacing.md,
    shadowColor: colours.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.55,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: colours.white,
    fontSize: typography.md,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  link: {
    color: colours.primary,
    fontSize: typography.sm,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    minHeight: 44,
    textAlignVertical: 'center',
    fontWeight: '600',
  },
});
