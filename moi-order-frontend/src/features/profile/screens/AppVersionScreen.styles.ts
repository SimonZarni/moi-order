import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { shadows } from '@/shared/theme/shadows';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';
import { TAB_BAR_CLEARANCE } from '@/shared/components/FloatingTabBar/FloatingTabBar.styles';

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
    lineHeight: 26,
    includeFontPadding: false,
  },
  headerSubtitle: {
    fontSize: typography.xs,
    color: colours.tertiary,
    marginTop: 2,
    lineHeight: 18,
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

  // ── Section label ─────────────────────────────────────────────────────────
  sectionLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.textMuted,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    lineHeight: 20,
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

  // ── Version hero ─────────────────────────────────────────────────────────
  versionHero: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  versionNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: colours.textOnLight,
    letterSpacing: -1,
    lineHeight: 42,
    includeFontPadding: false,
  },
  versionLabel: {
    fontSize: typography.sm,
    color: colours.textMuted,
    lineHeight: 20,
    includeFontPadding: false,
  },

  // ── Status badge ─────────────────────────────────────────────────────────
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginTop: 4,
  },
  statusBadgeText: {
    fontSize: typography.xs,
    fontWeight: '700',
    lineHeight: 18,
    includeFontPadding: false,
  },

  // ── Buttons ───────────────────────────────────────────────────────────────
  btnPrimary: {
    backgroundColor: colours.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    minHeight: 48,
  },
  btnPrimaryText: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnDark,
    lineHeight: 22,
    includeFontPadding: false,
  },
  btnOutlined: {
    borderRadius: radius.lg,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    minHeight: 48,
    borderWidth: 1.5,
    borderColor: colours.primary,
  },
  btnOutlinedText: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.primary,
    lineHeight: 22,
    includeFontPadding: false,
  },

  // ── Changelog items ──────────────────────────────────────────────────────
  changelogRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.xs + 2,
  },
  changelogDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colours.primary,
    marginTop: 8,
    flexShrink: 0,
  },
  changelogText: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnLight,
    lineHeight: 22,
    includeFontPadding: false,
  },
  changelogDivider: {
    height: 1,
    backgroundColor: colours.divider,
    marginHorizontal: -spacing.md,
  },

  // ── Coming version label ──────────────────────────────────────────────────
  comingVersion: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.primary,
    marginBottom: spacing.xs,
    lineHeight: 18,
    includeFontPadding: false,
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyText: {
    fontSize: typography.sm,
    color: colours.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.md,
    lineHeight: 22,
    includeFontPadding: false,
  },
});
