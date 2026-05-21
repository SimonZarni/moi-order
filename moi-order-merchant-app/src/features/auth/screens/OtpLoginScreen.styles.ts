import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.backgroundDark },
  brandArea: { backgroundColor: colours.backgroundDark, paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.md },
  brandAreaContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingTop: spacing.sm },
  brandIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  sheetScroll: { backgroundColor: '#f2f4f3', borderTopLeftRadius: 28, borderTopRightRadius: 28, flex: 1 },
  sheetContent: { padding: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl, flexGrow: 1 },
  sheetTitle: { fontSize: 30, fontWeight: '900', color: colours.textOnLight, letterSpacing: -1, marginBottom: spacing.xs },
  sheetSubtitle: { fontSize: typography.sm, color: colours.textMuted, marginBottom: spacing.xl },

  screen: { flex: 1, flexDirection: 'row' },
  leftPanel: { width: '42%', backgroundColor: colours.backgroundDark, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, gap: spacing.md },
  rightPanel: { flex: 1, backgroundColor: '#f2f4f3', alignItems: 'center', justifyContent: 'center' },
  webScroll: { flex: 1, width: '100%' },
  webForm: { flexGrow: 1, justifyContent: 'center', maxWidth: 440, width: '100%', alignSelf: 'center', padding: spacing.xxl },
  formTitle: { fontSize: 30, fontWeight: '900', color: colours.textOnLight, marginBottom: spacing.xs, letterSpacing: -1 },
  formSubtitle: { fontSize: typography.sm, color: colours.textMuted, marginBottom: spacing.xl },

  brandMark: { width: 52, height: 52, borderRadius: 14, backgroundColor: colours.primary, alignItems: 'center', justifyContent: 'center', shadowColor: colours.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.45, shadowRadius: 20, elevation: 10 },
  brandMarkText: { fontSize: typography.xl, fontWeight: '900', color: colours.white },
  brandName: { fontSize: typography.xl, fontWeight: '900', color: colours.textOnDark, letterSpacing: -0.5 },
  brandRole: { fontSize: typography.xxs, fontWeight: '700', color: colours.primary, textTransform: 'uppercase', letterSpacing: 1.6, marginTop: 2 },
  brandDivider: { width: 32, height: 1.5, backgroundColor: colours.primary + '44', marginVertical: spacing.xs },
  brandTagline: { fontSize: typography.sm, color: 'rgba(255,255,255,0.4)', lineHeight: 20 },

  errorBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs, backgroundColor: colours.error + '14', padding: spacing.md, borderRadius: 14, marginBottom: spacing.md, borderWidth: 1, borderColor: colours.error + '33' },
  errorText: { flex: 1, color: colours.error, fontSize: typography.sm },
  field: { gap: 6, marginBottom: spacing.md },
  fieldLabel: { fontSize: typography.xxs, fontWeight: '800', color: colours.textMuted, textTransform: 'uppercase', letterSpacing: 1.2 },
  input: { backgroundColor: colours.white, borderWidth: 1.5, borderColor: colours.divider, borderRadius: 14, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 4, fontSize: typography.md, color: colours.textOnLight, minHeight: 54 },
  pinInput: { textAlign: 'center', fontSize: typography.xxl, fontWeight: '800', letterSpacing: 8 },
  otpInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colours.primaryGlow, borderRadius: 12, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colours.primary + '33' },
  otpInfoText: { flex: 1, fontSize: typography.xs, color: colours.textMuted, lineHeight: 18 },
  primaryBtn: { backgroundColor: colours.backgroundDark, borderRadius: radius.full, paddingVertical: spacing.md, alignItems: 'center', minHeight: 56, justifyContent: 'center', marginTop: spacing.xs },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnText: { color: colours.white, fontSize: typography.md, fontWeight: '800', letterSpacing: 0.3 },

  // legacy compat
  container: { flex: 1, padding: spacing.lg, justifyContent: 'center' },
  button: { backgroundColor: colours.primary, borderRadius: radius.full, padding: spacing.md, alignItems: 'center', minHeight: 54 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: colours.white, fontSize: typography.md, fontWeight: '800' },
  stepIconWrap: { width: 48, height: 48, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  formSheet: { flex: 1, backgroundColor: '#f2f4f3', borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  formSheetContent: { padding: spacing.lg, paddingTop: spacing.xl },
  title: { fontSize: 30, fontWeight: '900', color: colours.textOnLight },
  subtitle: { fontSize: typography.sm, color: colours.textMuted },
});
