import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colours.backgroundDark,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colours.dividerDark,
  },
  eyebrow: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.primary,
    letterSpacing: 1.5,
    lineHeight: 16,
  },
  title: {
    fontSize: typography.xxl,
    fontWeight: '800',
    color: colours.textOnDark,
    lineHeight: 60,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  qrBanner: {
    backgroundColor: colours.backgroundMid,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,165,0,0.3)',
  },
  qrBannerText: {
    flex: 1,
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
  },
  qrBannerBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    backgroundColor: colours.primary,
    borderRadius: 8,
  },
  qrBannerBtnText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.backgroundDark,
    lineHeight: 16,
  },
  qrBannerBtnDisabled: {
    opacity: 0.5,
  },
  sectionLabel: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
    lineHeight: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.backgroundDark,
  },
  emptyText: {
    fontSize: typography.sm,
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
    lineHeight: 22,
  },
  loadMoreBtn: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  loadMoreText: {
    fontSize: typography.xs,
    color: colours.primary,
    fontWeight: '600',
    lineHeight: 20,
  },
});
