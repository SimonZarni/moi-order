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
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
  headerTitle: {
    flex: 1,
    fontSize: typography.lg,
    fontWeight: '800',
    color: colours.textOnDark,
    letterSpacing: -0.3,
    lineHeight: 51,
  },
  headerSubtitle: {
    fontSize: typography.xs,
    color: colours.tertiary,
    marginTop: 1,
    lineHeight: 33,
  },

  // ── Body sheet ────────────────────────────────────────────────────────────
  body: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
  },
  scroll: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: TAB_BAR_CLEARANCE + spacing.lg,
  },

  // ── Hint card (accepted types) ────────────────────────────────────────────
  hintCard: {
    backgroundColor: `${colours.primary}0d`,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: `${colours.primary}22`,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  hintText: {
    flex: 1,
    fontSize: typography.xs,
    color: colours.primary,
    lineHeight: 33,
    fontWeight: '500',
  },

  // ── Photo quality tip ────────────────────────────────────────────────────
  photoTipCard: {
    backgroundColor: `${colours.warning}14`,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: `${colours.warning}33`,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  photoTipText: {
    flex: 1,
    fontSize: typography.xs,
    color: colours.warning,
    lineHeight: 33,
    fontWeight: '500',
  },

  // ── Privacy notice ───────────────────────────────────────────────────────
  privacyCard: {
    backgroundColor: `${colours.medium}12`,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: `${colours.medium}28`,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  privacyText: {
    flex: 1,
    fontSize: typography.xs,
    color: colours.textMuted,
    lineHeight: 33,
  },

  // ── Upload button ─────────────────────────────────────────────────────────
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colours.primary,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    ...shadows.light,
  },
  uploadBtnDisabled: {
    opacity: 0.6,
  },
  uploadBtnText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnDark,
    letterSpacing: 0.3,
  },

  // ── Section ───────────────────────────────────────────────────────────────
  sectionLabel: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
    lineHeight: 27,
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textMuted,
  },
  emptySubtitle: {
    fontSize: typography.sm,
    color: colours.textMuted,
    textAlign: 'center',
    lineHeight: 39,
    maxWidth: 260,
  },
});
