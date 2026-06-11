import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.backgroundDark },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colours.dividerDark },
  backBtn: { padding: spacing.xs, marginRight: spacing.sm },
  headerTitle: { fontSize: typography.lg, fontWeight: '700', color: colours.textOnDark },
  container: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },

  infoBox: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colours.primary + '18', padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colours.primary + '33' },
  infoText: { flex: 1, fontSize: typography.sm, color: 'rgba(255,255,255,0.7)', lineHeight: 20 },
  infoEmail: { fontWeight: '700', color: colours.textOnDark },

  errorBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs, backgroundColor: colours.error + '18', padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colours.error + '33' },
  errorText: { flex: 1, color: colours.error, fontSize: typography.sm },

  field: { gap: 6 },
  fieldLabel: { fontSize: typography.xxs, fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 },
  input: { backgroundColor: colours.backgroundMid, borderWidth: 1, borderColor: colours.dividerDark, borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 4, fontSize: typography.md, color: colours.textOnDark, minHeight: 52 },
  otpInput: { textAlign: 'center', fontSize: typography.xxl, fontWeight: '800', letterSpacing: 8 },
  resendHint: { fontSize: typography.xs, color: 'rgba(255,255,255,0.3)', marginTop: 4 },

  primaryBtn: { backgroundColor: colours.primary, borderRadius: radius.full, padding: spacing.md, alignItems: 'center', minHeight: 52, justifyContent: 'center' },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnText: { color: colours.backgroundDark, fontSize: typography.md, fontWeight: '800', letterSpacing: 0.3 },

  loadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.md },
  loadingText: { color: 'rgba(255,255,255,0.5)', fontSize: typography.sm },

  doneContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, gap: spacing.lg },
  doneIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: colours.primary + '18', alignItems: 'center', justifyContent: 'center' },
  doneTitle: { fontSize: typography.xxl, fontWeight: '800', color: colours.textOnDark, letterSpacing: -0.5 },
  doneSubtitle: { fontSize: typography.sm, color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 22 },
});
