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
  subtitle: { fontSize: typography.sm, color: colours.textMuted, marginBottom: spacing.lg, lineHeight: 20 },

  lockedEmailRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colours.card,
    borderWidth: 1, borderColor: colours.textMuted,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2,
    marginBottom: spacing.md,
    opacity: 0.7,
  },
  lockedEmailText: {
    flex: 1, fontSize: typography.md, color: colours.textMuted,
  },

  submitBtn: {
    backgroundColor: colours.primary, borderRadius: radius.md,
    paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.sm,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitText: { color: colours.textOnDark, fontSize: typography.md, fontWeight: '700' },

  backRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  backLink: { fontSize: typography.sm, color: colours.textMuted },
});
