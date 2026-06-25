import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colours.surfaceMuted,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
    backgroundColor: colours.surface,
  },
  eyebrow: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textSubtle,
    letterSpacing: 1.5,
    lineHeight: 16,
  },
  title: {
    fontSize: typography.display,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.8,
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
    backgroundColor: '#fff8e1',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.4)',
  },
  qrBannerText: {
    flex: 1,
    fontSize: typography.xs,
    color: '#92400e',
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
    color: colours.surface,
    lineHeight: 16,
  },
  qrBannerBtnDisabled: {
    opacity: 0.5,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  sectionLabel: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textSubtle,
    letterSpacing: 1.2,
    lineHeight: 16,
  },
  replaceQrBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colours.primary,
  },
  replaceQrBtnSuccess: {
    borderColor: colours.success,
    backgroundColor: colours.successBg,
  },
  replaceQrBtnText: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.primary,
    lineHeight: 16,
  },
  replaceQrBtnTextSuccess: {
    color: colours.success,
  },
  uploadError: {
    fontSize: typography.xs,
    color: colours.error,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  historySectionLabel: {
    marginTop: spacing.lg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.surfaceMuted,
  },
  emptyText: {
    fontSize: typography.sm,
    color: colours.textSubtle,
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
  periodRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colours.surface,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  periodTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colours.divider,
  },
  periodTabActive: {
    backgroundColor: colours.primary,
    borderColor: colours.primary,
  },
  periodTabText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colours.textSubtle,
    lineHeight: 20,
  },
  periodTabTextActive: {
    color: colours.surface,
  },
  summaryCard: {
    backgroundColor: colours.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colours.divider,
    gap: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: typography.xs,
    color: colours.textSubtle,
    lineHeight: 20,
  },
  summaryValue: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnLight,
    lineHeight: 22,
  },
  summaryValueAccent: {
    color: colours.primary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colours.divider,
    marginVertical: spacing.xs,
  },
  summaryDateRange: {
    fontSize: typography.xxs,
    color: colours.textSubtle,
    letterSpacing: 0.5,
    lineHeight: 16,
    marginBottom: spacing.xs,
  },
});
