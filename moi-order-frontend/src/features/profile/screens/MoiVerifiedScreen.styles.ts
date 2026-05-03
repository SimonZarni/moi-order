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
  },
  headerSubtitle: {
    fontSize: typography.xs,
    color: colours.tertiary,
    marginTop: 1,
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
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },

  // ── Card ──────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.light,
  },

  // ── Advantages ────────────────────────────────────────────────────────────
  advantageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs + 2,
  },
  advantageText: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnLight,
    lineHeight: 20,
  },

  // ── Requirements ─────────────────────────────────────────────────────────
  reqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
  },
  reqLabel: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnLight,
    lineHeight: 20,
  },
  reqDivider: {
    height: 1,
    backgroundColor: colours.divider,
    marginHorizontal: -spacing.md,
  },

  // ── Verified badge ────────────────────────────────────────────────────────
  verifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: `${colours.success}18`,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: `${colours.success}40`,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  verifiedBannerText: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.success,
  },
});
