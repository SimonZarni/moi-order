import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colours.backgroundDark },
  bottomFill: {
    position: 'absolute', top: '30%', left: 0, right: 0, bottom: 0,
    backgroundColor: colours.backgroundLight,
  },
  keyboardAvoiding: { flex: 1 },
  scroll: { flexGrow: 1 },

  hero: {
    paddingTop: spacing.xxl + spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  heroLabel: {
    fontSize: typography.xs, fontWeight: '700', color: colours.tertiary,
    letterSpacing: 4, textTransform: 'uppercase', marginBottom: spacing.sm,
  },
  heroTitle: { fontSize: typography.xl, fontWeight: '800', color: colours.textOnDark },

  card: {
    flex: 1, backgroundColor: colours.backgroundLight,
    borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
    padding: spacing.lg, paddingTop: spacing.xl,
  },

  label: { fontSize: typography.sm, fontWeight: '600', color: colours.textOnLight, marginBottom: spacing.xs },
  hint:  { fontSize: typography.sm, color: colours.textMuted, marginBottom: spacing.lg, lineHeight: 20 },

  input: {
    backgroundColor: colours.card,
    borderWidth: 1, borderColor: colours.textMuted,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2,
    fontSize: typography.md, color: colours.textOnLight,
    marginBottom: spacing.xs,
  },
  inputError: { borderColor: colours.danger },

  errorText: { fontSize: typography.xs, color: colours.danger, marginBottom: spacing.sm },

  sendBtn: {
    backgroundColor: colours.primary, borderRadius: radius.md,
    paddingVertical: spacing.md, alignItems: 'center',
    marginTop: spacing.md, marginBottom: spacing.lg,
  },
  sendBtnDisabled: { opacity: 0.6 },
  sendBtnText: { color: colours.textOnDark, fontSize: typography.md, fontWeight: '700' },

  expiryText: {
    fontSize: typography.xs, color: colours.tertiary,
    marginBottom: spacing.lg, textAlign: 'center',
  },

  otpSection: { marginTop: spacing.sm },
  otpLabel: { fontSize: typography.sm, fontWeight: '600', color: colours.textOnLight, marginBottom: spacing.xs },
  otpHint: { fontSize: typography.sm, color: colours.textMuted, marginBottom: spacing.md, lineHeight: 20 },

  confirmBtn: {
    backgroundColor: colours.primary, borderRadius: radius.md,
    paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.sm,
  },
  confirmBtnDisabled: { opacity: 0.6 },
  confirmBtnText: { color: colours.textOnDark, fontSize: typography.md, fontWeight: '700' },

  banner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: '#fff1f2', borderRadius: radius.sm,
    padding: spacing.sm, marginBottom: spacing.md,
  },
  bannerText: { flex: 1, fontSize: typography.sm, color: colours.danger },

  backRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.md },
  backLink: { fontSize: typography.sm, color: colours.textMuted },
});
