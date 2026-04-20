import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colours.backgroundDark,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.38)',
    borderRadius: radius.full,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    minHeight: 36,
    marginBottom: spacing.md,
  },
  backLabel: {
    fontSize: typography.sm,
    color: colours.tertiary,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  headerTitle: {
    fontSize: typography.xxl,
    fontWeight: '900',
    color: colours.textOnDark,
    letterSpacing: -0.5,
  },
  headerPriceBadge: {
    backgroundColor: 'rgba(82,121,111,0.3)',
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingVertical: 4,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  headerPrice: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnDark,
  },

  // ── Body ──────────────────────────────────────────────────────────────────
  body: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },

  // ── Field ─────────────────────────────────────────────────────────────────
  fieldGroup: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textOnLight,
    marginBottom: 6,
  },
  fieldRequired: {
    color: colours.danger,
  },
  textInput: {
    backgroundColor: colours.white,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: typography.md,
    color: colours.textOnLight,
    minHeight: 44,
  },
  textInputError: {
    borderColor: colours.danger,
  },
  textInputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.sm + 2,
  },
  fieldError: {
    fontSize: typography.xs,
    color: colours.danger,
    marginTop: 4,
  },

  // ── Select options ────────────────────────────────────────────────────────
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  optionBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.tertiary,
    backgroundColor: colours.white,
    minHeight: 36,
    justifyContent: 'center',
  },
  optionBtnSelected: {
    backgroundColor: colours.primary,
    borderColor: colours.primary,
  },
  optionBtnText: {
    fontSize: typography.sm,
    color: colours.textOnLight,
    fontWeight: '500',
  },
  optionBtnTextSelected: {
    color: colours.white,
    fontWeight: '700',
  },

  // ── Boolean toggle ────────────────────────────────────────────────────────
  boolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colours.white,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
  boolLabel: {
    fontSize: typography.md,
    color: colours.textOnLight,
  },

  // ── File picker ───────────────────────────────────────────────────────────
  fileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colours.white,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    minHeight: 44,
  },
  fileBtnSelected: {
    borderColor: colours.tertiary,
    backgroundColor: 'rgba(34,78,74,0.05)',
  },
  fileBtnText: {
    fontSize: typography.sm,
    color: colours.textMuted,
    flex: 1,
  },
  fileBtnTextSelected: {
    color: colours.primary,
    fontWeight: '600',
  },

  // ── Submit bar ────────────────────────────────────────────────────────────
  submitBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colours.white,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    ...shadows.top,
  },
  submitBtn: {
    backgroundColor: colours.primary,
    borderRadius: radius.lg,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontSize: typography.md,
    fontWeight: '800',
    color: colours.white,
    letterSpacing: 0.4,
  },
});
