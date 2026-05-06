import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colours.backgroundDark },
  bottomFill: {
    position: 'absolute', top: '35%', left: 0, right: 0, bottom: 0,
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
  title: { fontSize: typography.lg, fontWeight: '700', color: colours.textOnLight, marginBottom: spacing.xs },
  hint: { fontSize: typography.sm, color: colours.textMuted, marginBottom: spacing.lg, lineHeight: 20 },
  emailHighlight: { fontWeight: '600', color: colours.textOnLight },

  verifyBtn: {
    backgroundColor: colours.primary, borderRadius: radius.md,
    paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.sm,
  },
  verifyBtnDisabled: { opacity: 0.6 },
  verifyText: { color: colours.textOnDark, fontSize: typography.md, fontWeight: '700' },

  resendRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.md },
  resendText: { fontSize: typography.sm, color: colours.textMuted },
  resendLink: { fontSize: typography.sm, color: colours.primary, fontWeight: '600', marginLeft: spacing.xs },
  resendDisabled: { color: colours.textMuted },

  backRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.sm },
  backLink: { fontSize: typography.sm, color: colours.textMuted },
});
