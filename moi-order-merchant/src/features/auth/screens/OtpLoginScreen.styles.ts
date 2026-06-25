import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.surface },
  brandArea: { backgroundColor: colours.primaryBg, paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.md, borderBottomWidth: 1, borderBottomColor: colours.divider },
  brandAreaContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingTop: spacing.sm },
  brandIcon: { width: 52, height: 52, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: colours.primary + '22' },
  formSheet: { flex: 1, backgroundColor: colours.surface, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, borderTopWidth: 1, borderTopColor: colours.divider },
  formSheetContent: { padding: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl, flexGrow: 1 },
  sheetTitle: { fontSize: typography.xxl, fontWeight: '800', color: colours.textOnLight, letterSpacing: -0.5, marginBottom: spacing.xs },
  sheetSubtitle: { fontSize: typography.sm, color: colours.textMuted, marginBottom: spacing.xl },
  title: { fontSize: typography.xxl, fontWeight: '800', color: colours.textOnLight, letterSpacing: -0.5 },
  subtitle: { fontSize: typography.sm, color: colours.textMuted },
  container: { flex: 1, padding: spacing.lg, justifyContent: 'center' },

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

  brandLogo: { width: 48, height: 48, borderRadius: radius.xl },
  brandName: { fontSize: typography.lg, fontWeight: '800', color: colours.textOnLight, letterSpacing: -0.3 },
  brandRole: { fontSize: typography.xxs, fontWeight: '700', color: colours.primary, textTransform: 'uppercase', letterSpacing: 1.6, marginTop: 2 },
  brandDivider: { width: 32, height: 1.5, backgroundColor: colours.primary + '44', marginVertical: spacing.xs },
  brandTagline: { fontSize: typography.sm, color: colours.textMuted, lineHeight: 20 },

  errorBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs, backgroundColor: colours.error + '18', padding: spacing.md, borderRadius: radius.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colours.error + '33' },
  errorBannerText: { flex: 1, color: colours.error, fontSize: typography.sm },
  errorText: { flex: 1, color: colours.error, fontSize: typography.sm },
  field: { gap: 6, marginBottom: spacing.md },
  fieldLabel: { fontSize: typography.xxs, fontWeight: '700', color: colours.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  input: { backgroundColor: colours.surfaceMuted, borderWidth: 1, borderColor: colours.divider, borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 4, fontSize: typography.md, color: colours.textOnLight, minHeight: 52 },
  pinInput: { textAlign: 'center', fontSize: typography.xxl, fontWeight: '800', letterSpacing: 8 },
  otpInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colours.primary + '18', borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colours.primary + '33' },
  otpInfoText: { flex: 1, fontSize: typography.xs, color: colours.textMuted, lineHeight: 18 },
  otpHint: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colours.primary + '18', borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colours.primary + '33' },
  otpHintText: { flex: 1, fontSize: typography.xs, color: colours.textMuted, lineHeight: 18 },
  primaryBtn: { backgroundColor: colours.primary, borderRadius: radius.full, padding: spacing.md, alignItems: 'center', minHeight: 52, justifyContent: 'center', marginTop: spacing.xs },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnText: { color: colours.backgroundDark, fontSize: typography.md, fontWeight: '800', letterSpacing: 0.3 },
  button: { backgroundColor: colours.primary, borderRadius: radius.full, padding: spacing.md, alignItems: 'center', minHeight: 52, justifyContent: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: colours.backgroundDark, fontSize: typography.md, fontWeight: '800', letterSpacing: 0.3 },
  stepIconWrap: { width: 52, height: 52, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
});
