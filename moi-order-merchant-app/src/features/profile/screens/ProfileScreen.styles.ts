import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.backgroundLight,
  },
  container: {
    paddingBottom: spacing.xl,
  },
  coverPhotoContainer: {
    width: '100%',
    height: 180,
    backgroundColor: colours.divider,
  },
  coverPhoto: {
    width: '100%',
    height: 180,
  },
  coverPhotoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  uploadHint: {
    fontSize: typography.xs,
    color: colours.medium,
  },
  logoContainer: {
    marginTop: -40,
    marginLeft: spacing.lg,
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: colours.white,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: radius.lg,
    backgroundColor: colours.backgroundLight,
    borderWidth: 3,
    borderColor: colours.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  restaurantName: {
    fontSize: typography.xxl,
    fontWeight: '700',
    color: colours.textOnLight,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.sm,
    color: colours.textMuted,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  address: {
    fontSize: typography.sm,
    color: colours.textMuted,
    marginBottom: spacing.sm,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colours.success + '22',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  statusText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.success,
    textTransform: 'capitalize',
  },
  accountSection: {
    backgroundColor: colours.card,
    marginHorizontal: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  accountName: {
    fontSize: typography.md,
    fontWeight: '600',
    color: colours.textOnLight,
    marginBottom: spacing.xs,
  },
  accountEmail: {
    fontSize: typography.sm,
    color: colours.textMuted,
    marginBottom: spacing.xs,
  },
  accountPhone: {
    fontSize: typography.sm,
    color: colours.textMuted,
  },
  logoutButton: {
    marginHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colours.error,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  logoutText: {
    color: colours.error,
    fontSize: typography.md,
    fontWeight: '600',
  },
});
