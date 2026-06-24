import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
  },
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colours.backgroundLight,
  },
  errorText: {
    fontSize: typography.sm,
    color: colours.error,
    lineHeight: 20,
  },
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  accountCard: {
    backgroundColor: colours.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colours.divider,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  accountName: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
    lineHeight: 24,
  },
  accountDetail: {
    fontSize: typography.sm,
    color: colours.textMuted,
    lineHeight: 20,
  },
  accountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colours.primary + '18', paddingHorizontal: spacing.xs + 2, paddingVertical: 3, borderRadius: radius.full },
  verifiedBadgeText: { fontSize: typography.xxs, fontWeight: '700', color: colours.primary },
  unverifiedBadge: { backgroundColor: '#f59e0b18', paddingHorizontal: spacing.xs + 2, paddingVertical: 3, borderRadius: radius.full },
  unverifiedBadgeText: { fontSize: typography.xxs, fontWeight: '700', color: '#f59e0b' },
  verifyBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colours.divider },
  verifyBtnText: { fontSize: typography.sm, color: colours.primary, fontWeight: '600' },
  unverifiedBanner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: '#f59e0b18', padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: '#f59e0b33', marginBottom: spacing.sm },
  unverifiedBannerBody: { flex: 1 },
  unverifiedBannerTitle: { fontSize: typography.sm, fontWeight: '700', color: '#f59e0b' },
  unverifiedBannerSub: { fontSize: typography.xs, color: '#92400e', marginTop: 2 },

  // ── Inline email edit ────────────────────────────────────────────────────────
  accountDetailRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  editPencil: { padding: 4, minWidth: 28, minHeight: 28, alignItems: 'center', justifyContent: 'center' },
  emailEditRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flex: 1 },
  emailInput: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnLight,
    backgroundColor: colours.surfaceMuted,
    borderWidth: 1,
    borderColor: colours.divider,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    outlineWidth: 0,
    outlineStyle: 'none',
  },
  emailInputError: { borderColor: colours.error },
  emailAction: { padding: 4, minWidth: 28, minHeight: 28, alignItems: 'center', justifyContent: 'center' },
  emailFieldError: { fontSize: typography.xs, color: colours.error, marginTop: 2 },
  addEmailPrompt: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: 2 },
  addEmailPromptText: { fontSize: typography.sm, color: colours.primary, fontWeight: '500' },
  docUploadError: {
    fontSize: typography.sm,
    color: colours.error,
    fontWeight: '600',
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
});
