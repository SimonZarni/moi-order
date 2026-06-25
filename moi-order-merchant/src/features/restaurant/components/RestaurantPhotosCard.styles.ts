import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colours.divider,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  cardHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  cardTitle: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textOnLight,
    letterSpacing: -0.2,
  },
  section: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  sectionLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colours.divider,
  },
  photoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  photoPreview: {
    width: 100,
    height: 60,
    borderRadius: radius.md,
    backgroundColor: colours.surfaceMuted,
  },
  logoPreview: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colours.surfaceMuted,
  },
  photoActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  photoBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.primary + '66',
    backgroundColor: colours.primaryBg,
    minWidth: 60,
    alignItems: 'center',
  },
  photoBtnDanger: {
    borderColor: colours.error + '55',
    backgroundColor: colours.errorBg,
  },
  photoBtnText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.primaryDark,
  },
  photoBtnTextDanger: {
    color: colours.error,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colours.primary + '55',
    borderStyle: 'dashed',
    backgroundColor: colours.primaryBg,
  },
  uploadBtnText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.primaryDark,
  },
  galleryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  galleryItem: {
    gap: spacing.xs,
  },
  galleryPreview: {
    width: 90,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colours.surfaceMuted,
  },
  galleryActions: {
    flexDirection: 'row',
    gap: 3,
    justifyContent: 'center',
  },
  galleryBtn: {
    width: 26,
    height: 26,
    borderRadius: radius.full,
    backgroundColor: colours.surfaceMuted,
    borderWidth: 1,
    borderColor: colours.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryBtnDanger: {
    backgroundColor: colours.errorBg,
    borderColor: colours.error + '55',
  },
  galleryMax: {
    fontSize: typography.xs,
    color: colours.textSubtle,
    fontStyle: 'italic',
  },
});
