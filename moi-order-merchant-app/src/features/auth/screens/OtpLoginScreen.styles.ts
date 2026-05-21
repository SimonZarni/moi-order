import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  // ── Web ──────────────────────────────────────────────────────────────────────
  screen: { flex: 1, flexDirection: 'row' },
  leftPanel: { width: '42%', backgroundColor: colours.backgroundDark, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, gap: spacing.md },
  rightPanel: { flex: 1, backgroundColor: colours.backgroundLight, alignItems: 'center', justifyContent: 'center' },
  formScroll: { flex: 1, width: '100%' },
  formCard: { flexGrow: 1, justifyContent: 'center', maxWidth: 420, width: '100%', alignSelf: 'center', padding: spacing.xxl },
  formTitle: { fontSize: typography.xxl, fontWeight: '800', color: colours.textOnLight, marginBottom: spacing.xs, letterSpacing: -0.5 },
  formSubtitle: { fontSize: typography.sm, color: colours.textMuted, marginBottom: spacing.xl },

  // ── Mobile ────────────────────────────────────────────────────────────────────
  safe: { flex: 1, backgroundColor: colours.backgroundDark },
  brandPanel: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, paddingTop: spacing.md },
  stepIconWrap: { width: 48, height: 48, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  formSheet: { flex: 1, backgroundColor: colours.backgroundLight, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet },
  formSheetContent: { padding: spacing.lg, paddingTop: spacing.xl, flexGrow: 1 },
  title: { fontSize: typography.xxl, fontWeight: '800', color: colours.textOnLight, marginBottom: spacing.xs, letterSpacing: -0.5 },
  subtitle: { fontSize: typography.sm, color: colours.textMuted, marginBottom: spacing.xl },

  // ── Brand ─────────────────────────────────────────────────────────────────────
  brandMark: { width: 48, height: 48, borderRadius: radius.lg, backgroundColor: colours.primary, alignItems: 'center', justifyContent: 'center', shadowColor: colours.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  brandMarkText: { fontSize: typography.xl, fontWeight: '900', color: colours.white, letterSpacing: -0.5 },
  brandName: { fontSize: typography.lg, fontWeight: '800', color: colours.textOnDark, letterSpacing: -0.3 },
  brandRole: { fontSize: typography.xxs, fontWeight: '700', color: colours.primary, textTransform: 'uppercase', letterSpacing: 1.6 },
  brandDivider: { width: 32, height: 1.5, backgroundColor: colours.primary + '44', marginVertical: spacing.xs },
  brandTagline: { fontSize: typography.sm, color: 'rgba(255,255,255,0.45)', textAlign: 'center', lineHeight: 22, maxWidth: 260 },

  // ── Form elements ─────────────────────────────────────────────────────────────
  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colours.error + '12', padding: spacing.md, borderRadius: radius.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colours.error + '30' },
  errorBannerText: { flex: 1, color: colours.error, fontSize: typography.sm },
  inputGroup: { gap: spacing.xs, marginBottom: spacing.md },
  inputLabel: { fontSize: typography.xs, fontWeight: '700', color: colours.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 },
  input: { backgroundColor: colours.surface, borderWidth: 1.5, borderColor: colours.divider, borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 4, fontSize: typography.md, color: colours.textOnLight, minHeight: 52 },
  pinInput: { letterSpacing: 6, fontSize: typography.xl, fontWeight: '700', textAlign: 'center' },
  otpHint: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colours.primaryGlow, borderRadius: radius.lg, padding: spacing.sm + 4, marginBottom: spacing.md, borderWidth: 1, borderColor: colours.primary + '33' },
  otpHintText: { flex: 1, fontSize: typography.xs, color: colours.primaryDark, fontWeight: '500' },
  button: { backgroundColor: colours.primary, borderRadius: radius.full, padding: spacing.md, alignItems: 'center', minHeight: 54, justifyContent: 'center', marginTop: spacing.xs, shadowColor: colours.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 6 },
  buttonDisabled: { opacity: 0.55, shadowOpacity: 0, elevation: 0 },
  buttonText: { color: colours.white, fontSize: typography.md, fontWeight: '800', letterSpacing: 0.3 },

  // kept for type compat
  container: { flex: 1, padding: spacing.lg, justifyContent: 'center' },
});
