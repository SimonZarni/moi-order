import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colours.backgroundDark },
  safeTop: { backgroundColor: colours.backgroundDark },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: colours.textOnDark,
  },
  map: { flex: 1 },
  markerContainer: {
    backgroundColor: colours.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: colours.white,
  },
  markerText: {
    fontSize: typography.xxs,
    fontWeight: '800',
    color: colours.white,
    maxWidth: 80,
  },
  // ── Bottom preview card ──────────────────────────────────────────────────
  bottomCard: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  cardThumb: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colours.infoBg,
  },
  cardMeta: { flex: 1, gap: 2 },
  cardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  cardName: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
    flexShrink: 1,
  },
  statusBadge: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: typography.xxs,
    fontWeight: '700',
  },
  cardDescription: {
    fontSize: typography.xs,
    color: colours.medium,
    lineHeight: 16,
  },
  closingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  closingText: {
    fontSize: typography.xs,
    color: colours.medium,
  },
  cardAddress: {
    fontSize: typography.xs,
    color: colours.medium,
    marginTop: 2,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colours.infoBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: typography.md,
    color: colours.textOnLight,
    lineHeight: 18,
    fontWeight: '600',
  },
  viewBtn: {
    marginTop: spacing.sm,
    backgroundColor: colours.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  viewBtnText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.white,
  },
});
