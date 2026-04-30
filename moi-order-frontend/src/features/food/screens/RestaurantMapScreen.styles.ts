import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  root: { flex: 1 },
  map: { flex: 1 },
  backBtn: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontSize: typography.md, color: colours.white, fontWeight: '700', marginLeft: 2 },
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
  bottomCard: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.xs,
  },
  bottomCardName: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
  },
  bottomCardAddress: {
    fontSize: typography.xs,
    color: colours.medium,
  },
  viewBtn: {
    marginTop: spacing.xs,
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
