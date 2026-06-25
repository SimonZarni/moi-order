import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  // ── Web ──────────────────────────────────────────────────────────────────────
  screen: { flex: 1, flexDirection: 'row', backgroundColor: colours.surface },
  screenColumn: { flexDirection: 'column' },
  leftPanel: { width: '42%', backgroundColor: colours.primaryBg, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, gap: spacing.md, borderRightWidth: 1, borderRightColor: colours.divider },
  leftPanelMobile: { width: '100%', backgroundColor: colours.surface, flexDirection: 'row', alignItems: 'center', padding: spacing.lg, gap: spacing.md, borderBottomWidth: 1, borderBottomColor: colours.divider },
  rightPanel: { flex: 1, backgroundColor: colours.surface, alignItems: 'center', justifyContent: 'center' },
  rightPanelFull: { width: '100%', justifyContent: 'flex-start' },
  webScroll: { flex: 1, width: '100%' },
  webForm: { flexGrow: 1, justifyContent: 'center', maxWidth: 440, width: '100%', alignSelf: 'center', padding: spacing.xxl },
  webFormMobile: { maxWidth: 600, padding: spacing.lg, paddingTop: spacing.xl, justifyContent: 'flex-start' },
  formTitle: { fontSize: typography.xxl, fontWeight: '800', color: colours.textOnLight, marginBottom: spacing.xs, letterSpacing: -0.5 },
  formSubtitle: { fontSize: typography.sm, color: colours.textMuted, marginBottom: spacing.xl },

  // ── Mobile ─────────────────────────────────────────────────────────────────────
  safe: { flex: 1, backgroundColor: colours.surface },
  brandArea: { backgroundColor: colours.primaryBg, paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.lg, borderBottomWidth: 1, borderBottomColor: colours.divider },
  brandAreaContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingTop: spacing.sm },
  formSheet: { flex: 1, backgroundColor: colours.surface, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, borderTopWidth: 1, borderTopColor: colours.divider },
  formSheetContent: { padding: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl, flexGrow: 1 },
  sheetTitle: { fontSize: typography.xxl, fontWeight: '800', color: colours.textOnLight, letterSpacing: -0.5, marginBottom: spacing.xs },
  sheetSubtitle: { fontSize: typography.sm, color: colours.textMuted, marginBottom: spacing.xl },
  title: { fontSize: typography.xxl, fontWeight: '800', color: colours.textOnLight, letterSpacing: -0.5, marginBottom: spacing.xs },
  subtitle: { fontSize: typography.sm, color: colours.textMuted, marginBottom: spacing.xl },
  container: { flex: 1, padding: spacing.lg, justifyContent: 'center' },

  // ── Brand ─────────────────────────────────────────────────────────────────────
  brandLogo: { width: 48, height: 48, borderRadius: radius.xl },
  brandName: { fontSize: typography.lg, fontWeight: '800', color: colours.textOnLight, letterSpacing: -0.3 },
  brandRole: { fontSize: typography.xxs, fontWeight: '700', color: colours.primary, textTransform: 'uppercase', letterSpacing: 1.6, marginTop: 2 },
  brandDivider: { width: 32, height: 1.5, backgroundColor: colours.primary + '44', marginVertical: spacing.xs },
  brandTagline: { fontSize: typography.sm, color: colours.textMuted, lineHeight: 20 },

  // ── Form ──────────────────────────────────────────────────────────────────────
  errorBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs, backgroundColor: colours.error + '18', padding: spacing.md, borderRadius: radius.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colours.error + '33' },
  errorBannerText: { flex: 1, color: colours.error, fontSize: typography.sm },
  errorText: { flex: 1, color: colours.error, fontSize: typography.sm },
  field: { gap: 6, marginBottom: spacing.md },
  fieldLabel: { fontSize: typography.xxs, fontWeight: '700', color: colours.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  input: { backgroundColor: colours.surfaceMuted, borderWidth: 1, borderColor: colours.divider, borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 4, fontSize: typography.md, color: colours.textOnLight, minHeight: 52 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colours.surfaceMuted, borderWidth: 1, borderColor: colours.divider, borderRadius: radius.lg, paddingHorizontal: spacing.md, minHeight: 52 },
  inputField: { flex: 1, paddingVertical: spacing.sm + 4, fontSize: typography.md, color: colours.textOnLight, backgroundColor: 'transparent', outlineWidth: 0, outlineStyle: 'none' },
  inputWrapFocused: { borderColor: colours.primary },
  eyeBtn: { paddingLeft: spacing.sm, paddingVertical: spacing.xs, minWidth: 36, alignItems: 'center' },
  inputGroup: { gap: spacing.xs, marginBottom: spacing.md },
  inputLabel: { fontSize: typography.xs, fontWeight: '700', color: colours.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 },
  primaryBtn: { backgroundColor: colours.primary, borderRadius: radius.full, padding: spacing.md, alignItems: 'center', minHeight: 52, justifyContent: 'center', marginTop: spacing.xs, marginBottom: spacing.md },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnText: { color: colours.backgroundDark, fontSize: typography.md, fontWeight: '800', letterSpacing: 0.3 },
  button: { backgroundColor: colours.primary, borderRadius: radius.full, padding: spacing.md, alignItems: 'center', minHeight: 52, justifyContent: 'center', marginTop: spacing.xs, marginBottom: spacing.md },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: colours.backgroundDark, fontSize: typography.md, fontWeight: '800', letterSpacing: 0.3 },
  orRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  orLine: { flex: 1, height: 1, backgroundColor: colours.divider },
  orText: { fontSize: typography.xs, color: colours.textMuted, fontWeight: '500' },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, borderWidth: 1, borderColor: colours.divider, borderRadius: radius.full, paddingVertical: spacing.sm + 4, minHeight: 52, backgroundColor: colours.surface, marginBottom: spacing.lg },
  secondaryBtnText: { color: colours.primary, fontSize: typography.sm, fontWeight: '700' },
  outlineButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, borderWidth: 1, borderColor: colours.divider, borderRadius: radius.full, paddingVertical: spacing.sm + 4, minHeight: 52, backgroundColor: colours.surface, marginBottom: spacing.lg },
  outlineButtonText: { color: colours.primary, fontSize: typography.sm, fontWeight: '700' },
  footerLink: { color: colours.textMuted, fontSize: typography.sm, textAlign: 'center', paddingVertical: spacing.sm },
  footerLinkBold: { color: colours.primary, fontWeight: '700' },
  link: { color: colours.primary, fontSize: typography.sm, textAlign: 'center', paddingVertical: spacing.sm, fontWeight: '600' },
  linkBold: { color: colours.primary, fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: colours.divider },
  dividerText: { fontSize: typography.xs, color: colours.textMuted },
  formScroll: { flex: 1, width: '100%' },
  formCard: { flexGrow: 1, justifyContent: 'center', maxWidth: 440, width: '100%', alignSelf: 'center', padding: spacing.xxl },
  errorBannerLegacy: { backgroundColor: colours.error + '18', color: colours.error, padding: spacing.md, borderRadius: radius.lg, fontSize: typography.sm, marginBottom: spacing.md },

  sheetScroll: { flex: 1, backgroundColor: colours.surface },
  sheetContent: { padding: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl, flexGrow: 1 },

  // ── Social buttons ─────────────────────────────────────────────────────────
  socialRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  socialBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderColor: colours.divider, borderRadius: radius.lg, paddingVertical: spacing.sm + 2, minHeight: 48, backgroundColor: colours.surface },
  socialBtnDisabled: { opacity: 0.5 },
  socialBtnText: { color: colours.textOnLight, fontSize: typography.sm, fontWeight: '700' },
  socialBtnLine: { color: '#06C755', fontSize: typography.sm, fontWeight: '900' },
});
