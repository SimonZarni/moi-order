import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colours.backgroundDark },
  bottomFill: {
    position: 'absolute', top: '25%', left: 0, right: 0, bottom: 0,
    backgroundColor: colours.backgroundLight,
  },
  keyboardAvoiding: { flex: 1 },
  scroll:   { flexGrow: 1 },
  scrollBg: { backgroundColor: colours.backgroundDark },

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

  // ── Current email status ──────────────────────────────────────────────────
  currentRow: {
    flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap',
    gap: spacing.sm, marginBottom: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1, borderBottomColor: colours.border,
  },
  currentLabel: { fontSize: typography.xs, color: colours.textMuted, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  currentEmail: { fontSize: typography.md, color: colours.textOnLight, fontWeight: '600', flex: 1 },
  currentNone:  { fontSize: typography.md, color: colours.textMuted, fontStyle: 'italic' },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(16,185,129,0.12)',
    borderRadius: radius.full, paddingVertical: 3, paddingHorizontal: 8,
  },
  verifiedBadgeText: { fontSize: typography.xxs, fontWeight: '700', color: '#059669' },
  unverifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(245,158,11,0.12)',
    borderRadius: radius.full, paddingVertical: 3, paddingHorizontal: 8,
  },
  unverifiedBadgeText: { fontSize: typography.xxs, fontWeight: '700', color: '#b45309' },

  // ── Section shells ────────────────────────────────────────────────────────
  section: { marginBottom: spacing.xl },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs,
  },
  sectionDot: {
    width: 8, height: 8, borderRadius: 4,
  },
  sectionTitle: { fontSize: typography.sm, fontWeight: '700' },
  sectionHint:  { fontSize: typography.sm, color: colours.textMuted, lineHeight: 20, marginBottom: spacing.md },

  // Section accent colours
  verifyDot:   { backgroundColor: '#10b981' },
  verifyTitle: { color: '#065f46' },
  updateDot:   { backgroundColor: colours.primary },
  updateTitle: { color: colours.textOnLight },
  removeDot:   { backgroundColor: colours.danger },
  removeTitle: { color: colours.danger },

  // ── Shared form elements ──────────────────────────────────────────────────
  label: { fontSize: typography.sm, fontWeight: '600', color: colours.textOnLight, marginBottom: spacing.xs },

  input: {
    backgroundColor: colours.card,
    borderWidth: 1, borderColor: colours.textMuted,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2,
    fontSize: typography.md, color: colours.textOnLight,
    marginBottom: spacing.xs,
  },
  inputError: { borderColor: colours.danger },
  errorText:  { fontSize: typography.xs, color: colours.danger, marginBottom: spacing.sm },

  expiryText: {
    fontSize: typography.xs, color: colours.tertiary,
    marginBottom: spacing.md, textAlign: 'center',
  },

  // ── Verify section buttons ────────────────────────────────────────────────
  verifyBtn: {
    backgroundColor: '#10b981', borderRadius: radius.md,
    paddingVertical: spacing.md, alignItems: 'center',
  },
  verifyBtnDisabled: { opacity: 0.6 },
  verifyBtnText:     { color: '#fff', fontSize: typography.md, fontWeight: '700' },

  verifyConfirmBtn: {
    backgroundColor: '#10b981', borderRadius: radius.md,
    paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.sm,
  },
  verifyConfirmBtnDisabled: { opacity: 0.6 },
  verifyConfirmBtnText:     { color: '#fff', fontSize: typography.md, fontWeight: '700' },

  // ── Update section buttons ────────────────────────────────────────────────
  sendBtn: {
    backgroundColor: colours.primary, borderRadius: radius.md,
    paddingVertical: spacing.md, alignItems: 'center',
    marginTop: spacing.sm, marginBottom: spacing.md,
  },
  sendBtnDisabled: { opacity: 0.6 },
  sendBtnText:     { color: colours.textOnDark, fontSize: typography.md, fontWeight: '700' },

  otpSection:  { marginTop: spacing.sm },
  otpHint:     { fontSize: typography.sm, color: colours.textMuted, marginBottom: spacing.md, lineHeight: 20 },

  confirmBtn: {
    backgroundColor: colours.primary, borderRadius: radius.md,
    paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.sm,
  },
  confirmBtnDisabled: { opacity: 0.6 },
  confirmBtnText:     { color: colours.textOnDark, fontSize: typography.md, fontWeight: '700' },

  // ── Remove section buttons ────────────────────────────────────────────────
  removeBtn: {
    borderWidth: 1.5, borderColor: colours.danger, borderRadius: radius.md,
    paddingVertical: spacing.sm + 2, alignItems: 'center',
  },
  removeBtnDisabled: { opacity: 0.5 },
  removeBtnText:     { color: colours.danger, fontSize: typography.sm, fontWeight: '700' },

  removeConfirmBtn: {
    backgroundColor: colours.danger, borderRadius: radius.md,
    paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.sm,
  },
  removeConfirmBtnDisabled: { opacity: 0.6 },
  removeConfirmBtnText:     { color: colours.textOnDark, fontSize: typography.md, fontWeight: '700' },

  // ── Error banners ─────────────────────────────────────────────────────────
  banner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: '#fff1f2', borderRadius: radius.sm,
    padding: spacing.sm, marginBottom: spacing.md,
  },
  bannerText: { flex: 1, fontSize: typography.sm, color: colours.danger },

  // ── Footer ────────────────────────────────────────────────────────────────
  backRow:  { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  backLink: { fontSize: typography.sm, color: colours.textMuted },

  divider: { height: 1, backgroundColor: colours.border, marginBottom: spacing.xl },
});
