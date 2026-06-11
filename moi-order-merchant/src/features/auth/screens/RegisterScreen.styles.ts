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
  screenColumn: {
    flexDirection: 'column',
  },
  leftPanel: {
    width: '42%',
    backgroundColor: colours.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.md,
  },
  leftPanelMobile: {
    width: '100%',
    backgroundColor: colours.backgroundDark,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colours.dividerDark,
  },
  brandLogo: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    marginBottom: spacing.sm,
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
    backgroundColor: colours.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightPanelFull: {
    width: '100%',
    justifyContent: 'flex-start',
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
  formCardMobile: {
    maxWidth: 600,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    justifyContent: 'flex-start',
  },
  formTitle: {
    fontSize: typography.xxl,
    fontWeight: '800',
    color: colours.textOnDark,
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  formSubtitle: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: spacing.xl,
  },

  // ── Mobile layout ──────────────────────────────────────────────────────────
  safe: {
    flex: 1,
    backgroundColor: colours.backgroundDark,
  },
  container: {
    backgroundColor: colours.backgroundMid,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    flexGrow: 1,
  },
  title: {
    fontSize: typography.xxl,
    fontWeight: '800',
    color: colours.textOnDark,
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: spacing.xl,
  },

  // ── Shared form elements ───────────────────────────────────────────────────
  errorBanner: {
    backgroundColor: colours.error + '18',
    color: colours.error,
    padding: spacing.md,
    borderRadius: radius.lg,
    fontSize: typography.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colours.error + '33',
  },
  input: {
    backgroundColor: colours.backgroundDark,
    borderWidth: 1,
    borderColor: colours.dividerDark,
    borderRadius: radius.lg,
    padding: spacing.md,
    fontSize: typography.md,
    color: colours.textOnDark,
    marginBottom: spacing.xs,
    minHeight: 52,
  },
  inputHint: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.35)',
    marginTop: -spacing.xs + 2,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  fieldError: {
    color: colours.error,
    fontSize: typography.xs,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  button: {
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    color: colours.backgroundDark,
    fontSize: typography.md,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  note: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: typography.xs,
    textAlign: 'center',
    lineHeight: 18,
  },

  // ── OTP step ──────────────────────────────────────────────────────────────
  otpInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colours.primary + '18',
    borderWidth: 1,
    borderColor: colours.primary + '44',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  otpInfoText: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.6)',
    flex: 1,
  },
  pinInput: {
    textAlign: 'center',
    fontSize: typography.xl,
    fontWeight: '700',
    letterSpacing: 8,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  linkBtn: {
    fontSize: typography.sm,
    color: colours.primary,
    fontWeight: '600',
  },
  linkBtnMuted: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.35)',
  },
});
