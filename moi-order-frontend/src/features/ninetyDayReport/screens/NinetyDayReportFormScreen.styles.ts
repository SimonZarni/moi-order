import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
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
    marginBottom: spacing.md,
    minHeight: 44,
  },
  backArrow: {
    fontSize: typography.xl,
    color: colours.tertiary,
    marginRight: spacing.xs,
  },
  backLabel: {
    fontSize: typography.sm,
    color: colours.tertiary,
    fontWeight: '600',
  },
  headerTypeName: {
    fontSize: typography.sm,
    color: colours.medium,
    fontWeight: '500',
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
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: 120, // space for sticky submit
  },

  // ── Section ───────────────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },

  // ── Banner ────────────────────────────────────────────────────────────────
  banner: {
    backgroundColor: 'rgba(197,0,15,0.08)',
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  bannerText: {
    fontSize: typography.sm,
    color: colours.danger,
    fontWeight: '500',
  },

  // ── Field ─────────────────────────────────────────────────────────────────
  fieldGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.secondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    backgroundColor: colours.white,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colours.inputBorder,
    paddingHorizontal: spacing.md,
    height: 52,
    justifyContent: 'center',
  },
  inputWrapperError: {
    borderColor: colours.danger,
  },
  input: {
    fontSize: typography.md,
    color: colours.textOnLight,
    paddingVertical: 0,
  },
  fieldError: {
    fontSize: typography.xs,
    color: colours.danger,
    marginTop: 4,
    marginLeft: spacing.xs,
  },

  // ── Document picker ───────────────────────────────────────────────────────
  docPicker: {
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colours.inputBorder,
    backgroundColor: colours.infoBg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 72,
  },
  docPickerError: {
    borderColor: colours.danger,
    backgroundColor: 'rgba(197,0,15,0.04)',
  },
  docPickerUploaded: {
    borderStyle: 'solid',
    borderColor: colours.success,
    backgroundColor: 'rgba(45,213,91,0.06)',
  },
  docPickerIconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colours.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  docPickerIconBoxUploaded: {
    backgroundColor: colours.success,
  },
  docPickerIcon: {
    fontSize: typography.lg,
    color: colours.white,
  },
  docPickerTextCol: {
    flex: 1,
  },
  docPickerTitle: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textOnLight,
  },
  docPickerHint: {
    fontSize: typography.xs,
    color: colours.textMuted,
    marginTop: 2,
  },
  docPickerHintUploaded: {
    color: colours.success,
  },

  // ── Success ───────────────────────────────────────────────────────────────
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    backgroundColor: colours.backgroundLight,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  successIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(45,213,91,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  successIcon: {
    fontSize: 40,
    color: colours.success,
  },
  successTitle: {
    fontSize: typography.xxl,
    fontWeight: '900',
    color: colours.textOnLight,
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  successSubtitle: {
    fontSize: typography.md,
    color: colours.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  successBtn: {
    marginTop: spacing.xxl,
    backgroundColor: colours.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    minWidth: 180,
    alignItems: 'center',
  },
  successBtnText: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.white,
  },

  // ── Sticky submit ─────────────────────────────────────────────────────────
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
    shadowColor: colours.dark,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
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
