import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.backgroundLight },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.backgroundDark,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colours.dividerDark,
  },
  backBtn: {
    padding: spacing.xs,
    minWidth: 36,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colours.textOnDark,
    letterSpacing: -0.3,
  },

  container: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colours.primary + '12',
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colours.primary + '30',
  },
  infoText: { flex: 1, fontSize: typography.sm, color: colours.textMuted, lineHeight: 20 },
  infoEmail: { fontWeight: '700', color: colours.primary },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    backgroundColor: colours.error + '10',
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colours.error + '30',
  },
  errorText: { flex: 1, color: colours.error, fontSize: typography.sm },

  field: { gap: 6 },
  fieldLabel: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: colours.surface,
    borderWidth: 1,
    borderColor: colours.divider,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.sm,
    color: colours.textOnLight,
    minHeight: 44,
  },
  otpInput: { textAlign: 'center', fontSize: typography.xl, fontWeight: '800', letterSpacing: 8 },
  resendHint: { fontSize: typography.xs, color: colours.textMuted, marginTop: 4 },

  primaryBtn: {
    backgroundColor: colours.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xl,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnText: { color: colours.white, fontSize: typography.sm, fontWeight: '700' },

  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.xs },
  loadingText: { color: colours.textMuted, fontSize: typography.sm },

  doneContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, gap: spacing.lg },
  doneIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colours.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneTitle: { fontSize: typography.xl, fontWeight: '800', color: colours.textOnLight, letterSpacing: -0.5 },
  doneSubtitle: { fontSize: typography.sm, color: colours.textMuted, textAlign: 'center', lineHeight: 22 },
});
