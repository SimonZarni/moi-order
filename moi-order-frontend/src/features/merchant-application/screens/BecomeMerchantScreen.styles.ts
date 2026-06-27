import { StyleSheet } from 'react-native';

import { TAB_BAR_CLEARANCE } from '@/shared/components/FloatingTabBar/FloatingTabBar.styles';
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: colours.textOnDark,
    letterSpacing: -0.3,
    lineHeight: 51,
    includeFontPadding: false,
  },
  headerSubtitle: {
    fontSize: typography.xs,
    color: colours.tertiary,
    marginTop: 2,
    lineHeight: 33,
    includeFontPadding: false,
  },

  // ── Body sheet ────────────────────────────────────────────────────────────
  scroll: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: TAB_BAR_CLEARANCE + spacing.lg,
  },
  loadingContainer: {
    paddingVertical: spacing.xl * 2,
    alignItems: 'center',
  },

  // ── Section label ─────────────────────────────────────────────────────────
  sectionLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.textMuted,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
    lineHeight: 33,
    includeFontPadding: false,
  },

  // ── Card ──────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.light,
  },
  cardTitle: {
    fontSize: typography.md,
    fontWeight: '800',
    color: colours.textOnLight,
    marginBottom: spacing.xs,
    lineHeight: 45,
    includeFontPadding: false,
  },
  cardBody: {
    fontSize: typography.sm,
    color: colours.textOnLight,
    lineHeight: 39,
    includeFontPadding: false,
  },

  // ── Status badge ──────────────────────────────────────────────────────────
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colours.badgeBg,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  statusBadgeText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.badgeText,
    lineHeight: 33,
    includeFontPadding: false,
  },

  // ── Benefits ──────────────────────────────────────────────────────────────
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs + 2,
  },
  benefitText: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnLight,
    lineHeight: 39,
    includeFontPadding: false,
  },

  // ── Buttons ───────────────────────────────────────────────────────────────
  primaryBtn: {
    backgroundColor: colours.primary,
    borderRadius: radius.xl,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  primaryBtnText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.white,
    letterSpacing: 0.5,
    lineHeight: 39,
    includeFontPadding: false,
  },
  secondaryBtn: {
    backgroundColor: colours.infoBg,
    borderRadius: radius.xl,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colours.infoBorder,
  },
  secondaryBtnText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.primary,
    letterSpacing: 0.5,
    lineHeight: 39,
    includeFontPadding: false,
  },
  destructiveBtn: {
    borderRadius: radius.xl,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colours.destructive,
  },
  destructiveBtnText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.destructive,
    letterSpacing: 0.5,
    lineHeight: 39,
    includeFontPadding: false,
  },
  btnDisabled: {
    opacity: 0.5,
  },

  // ── Error banner ──────────────────────────────────────────────────────────
  errorBanner: {
    backgroundColor: `${colours.danger}14`,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: `${colours.danger}40`,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  errorBannerText: {
    fontSize: typography.xs,
    color: colours.danger,
    lineHeight: 33,
    includeFontPadding: false,
  },

  // ── Review notes ──────────────────────────────────────────────────────────
  notesLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.textMuted,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    lineHeight: 33,
    includeFontPadding: false,
  },
  notesBody: {
    fontSize: typography.sm,
    color: colours.textOnLight,
    backgroundColor: colours.light,
    borderRadius: radius.lg,
    padding: spacing.sm,
    lineHeight: 39,
    includeFontPadding: false,
  },
});
