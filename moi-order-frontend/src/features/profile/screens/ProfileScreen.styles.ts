import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import { TAB_BAR_CLEARANCE } from '@/shared/components/FloatingTabBar/FloatingTabBar.styles';

export const styles = StyleSheet.create({

  // ── Scaffold ──────────────────────────────────────────────────────────────
  root: {
    flex: 1,
    backgroundColor: colours.backgroundDark,
  },
  scroll: {
    flex: 1,
  },

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    backgroundColor: colours.backgroundDark,
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl + spacing.xl, // extra so sheet overlap looks right
    overflow: 'hidden',
  },

  // Decorative orbs — same vocabulary as HomeScreen
  orbA: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colours.tertiary,
    opacity: 0.05,
    top: -100,
    right: -80,
  },
  orbB: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colours.primary,
    opacity: 0.08,
    bottom: 20,
    left: -30,
  },
  orbC: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: editorialPalette.gold,
    opacity: 0.06,
    top: spacing.xl,
    left: spacing.xl,
  },

  // Avatar ring (outer glow effect using a slightly larger circle behind)
  avatarRing: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: `${colours.tertiary}55`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colours.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: typography.xl,
    fontWeight: '900',
    color: colours.white,
    letterSpacing: 1,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarCameraOverlay: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colours.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Hero text
  heroNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 4,
  },
  heroName: {
    fontSize: typography.xl + 2,
    fontWeight: '800',
    color: colours.textOnDark,
    letterSpacing: -0.4,
    lineHeight: 36,
  },
  heroEmail: {
    fontSize: typography.sm,
    color: colours.tertiary,
    marginBottom: spacing.xs,
  },
  heroSince: {
    fontSize: typography.xxs,
    color: colours.medium,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },

  // ── Sheet body ────────────────────────────────────────────────────────────
  body: {
    backgroundColor: colours.backgroundLight,
    borderTopLeftRadius:  radius.sheet,
    borderTopRightRadius: radius.sheet,
    marginTop: -(spacing.xxl),   // pulls body up over hero
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingBottom: TAB_BAR_CLEARANCE + spacing.lg,
    minHeight: 600,
  },

  // ── Section label (same as HomeScreen pattern) ─────────────────────────
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  sectionLabel: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    lineHeight: 18,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.07)',
  },

  // ── Cards ─────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.light,
    marginBottom: spacing.xs,
  },
  emailPromptCard: {
    backgroundColor: '#fff6df',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: '#efd79a',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  emailPromptHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  emailPromptCopy: {
    flex: 1,
  },
  emailPromptTitle: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
    marginBottom: 4,
  },
  emailPromptText: {
    fontSize: typography.sm,
    lineHeight: 20,
    color: colours.medium,
  },
  emailPromptButton: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: colours.primary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  emailPromptButtonText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.white,
  },

  linkErrorCard: {
    backgroundColor: '#fff1f1',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: '#f3b2b2',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  linkErrorText: {
    flex: 1,
    fontSize: typography.sm,
    lineHeight: 20,
    color: colours.danger,
    fontWeight: '600',
  },
  linkErrorDismiss: {
    padding: 4,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Info / action rows (inside cards) ─────────────────────────────────────
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    minHeight: 56,
  },
  rowSeparator: {
    height: 1,
    backgroundColor: colours.infoBg,
    marginHorizontal: spacing.md,
  },

  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  linkCopy: {
    flex: 1,
    paddingRight: spacing.xs,
  },
  linkTitle: {
    fontSize: typography.md,
    color: colours.textOnLight,
    fontWeight: '700',
    lineHeight: 22,
  },
  linkSubtitle: {
    fontSize: typography.xs,
    color: colours.medium,
    lineHeight: 18,
    marginTop: 2,
  },
  linkBtn: {
    minWidth: 92,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkBtnPrimary: {
    backgroundColor: colours.primary,
  },
  linkBtnConnected: {
    backgroundColor: `${colours.primary}14`,
  },
  linkBtnDisabled: {
    opacity: 0.45,
  },
  linkBtnText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.white,
    letterSpacing: 0.3,
  },
  linkBtnTextConnected: {
    color: colours.primary,
  },
  linkActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  unlinkBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Icon badge — small coloured square, left of each row
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 2,
  },
  iconBadgeAmber:  { backgroundColor: `${editorialPalette.amber}22` },
  iconBadgeSlate:  { backgroundColor: `${editorialPalette.slate}22` },
  iconBadgeTeal:   { backgroundColor: `${editorialPalette.teal}22`  },
  iconBadgePrimary:{ backgroundColor: `${colours.primary}14`        },
  iconBadgeDanger: { backgroundColor: `${colours.destructive}14`    },

  iconEmoji: {
    fontSize: 16,
  },

  // Row text
  rowLabel: {
    flex: 1,
    fontSize: typography.md,
    color: colours.textOnLight,
    fontWeight: '500',
    lineHeight: 28,
  },
  rowLabelBold: {
    fontWeight: '700',
  },
  iconBadgeFacebook: { backgroundColor: '#1877F214' },
  iconBadgeLine:     { backgroundColor: '#06C75514' },
  rowDisabled: {
    opacity: 0.45,
  },
  rowLabelDisabled: {
    color: colours.textMuted,
  },
  rowValue: {
    fontSize: typography.sm,
    color: colours.medium,
    maxWidth: 160,
  },
  rowArrow: {
    fontSize: typography.md,
    color: colours.medium,
    marginLeft: spacing.xs,
  },
  rowChevron: {
    fontSize: 18,
    color: colours.textMuted,
    marginLeft: spacing.xs,
  },

  // ── Edit icon button (absolute — adds no vertical space) ──────────────────
  editIconBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    zIndex: 1,
    width: 30,
    height: 30,
    borderRadius: radius.full,
    backgroundColor: `${colours.primary}14`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIconText: {
    fontSize: 15,
    color: colours.primary,
    lineHeight: 18,
  },

  // ── Read-only info rows ────────────────────────────────────────────────────
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  infoValue: {
    flex: 1,
    fontSize: typography.md,
    color: colours.textOnLight,
    fontWeight: '500',
    lineHeight: 24,
  },
  infoPlaceholder: {
    color: colours.textMuted,
  },

  // ── Profile form inputs ────────────────────────────────────────────────────
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  inputField: {
    flex: 1,
    fontSize: typography.md,
    color: colours.textOnLight,
    fontWeight: '500',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colours.infoBg,
    marginBottom: 0,
  },
  inputFieldFocused: {
    borderBottomColor: colours.primary,
  },
  inputError: {
    borderBottomColor: colours.danger,
  },
  errorText: {
    fontSize: typography.xs,
    color: colours.danger,
    marginLeft: spacing.md,
    marginBottom: spacing.xs,
    marginTop: 2,
  },

  // DOB row (pressable, looks like an input row)
  dobValue: {
    flex: 1,
    fontSize: typography.md,
    color: colours.textOnLight,
    fontWeight: '500',
    lineHeight: 26,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colours.infoBg,
  },
  dobPlaceholder: {
    color: colours.textMuted,
  },

  // Save button — appears only when form is dirty
  saveBtn: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    backgroundColor: colours.primary,
    borderRadius: radius.xl,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.white,
    letterSpacing: 0.5,
    lineHeight: 26,
  },

  // ── Expanded change-password form ──────────────────────────────────────────
  passwordForm: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colours.infoBg,
  },
  passwordInput: {
    fontSize: typography.sm,
    color: colours.textOnLight,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colours.infoBg,
    marginTop: spacing.sm,
  },
  passwordInputError: {
    borderBottomColor: colours.danger,
  },
  passwordErrorText: {
    fontSize: typography.xs,
    color: colours.danger,
    marginTop: 2,
    marginBottom: spacing.xs,
  },
  updatePasswordBtn: {
    marginTop: spacing.md,
    backgroundColor: colours.secondary,
    borderRadius: radius.xl,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
  },
  updatePasswordBtnText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.white,
    letterSpacing: 0.4,
    lineHeight: 26,
  },

  // ── Language switcher ─────────────────────────────────────────────────────
  langRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  langBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.xl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colours.infoBg,
    backgroundColor: 'transparent',
  },
  langBtnActive: {
    borderColor: colours.primary,
    backgroundColor: `${colours.primary}14`,
  },
  langBtnText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textMuted,
    lineHeight: 26,
  },
  langBtnTextActive: {
    color: colours.primary,
  },

  // ── Sign out ───────────────────────────────────────────────────────────────
  signOutBtn: {
    marginTop: spacing.sm,
    borderRadius: radius.xl,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: `${colours.destructive}55`,
    backgroundColor: `${colours.destructive}08`,
  },
  signOutText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.destructive,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },

  // ── Delete account ─────────────────────────────────────────────────────────
  deleteAccountBtn: {
    marginTop: spacing.sm,
    borderRadius: radius.xl,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
  },
  deleteAccountText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.textMuted,
    letterSpacing: 0.4,
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
});
