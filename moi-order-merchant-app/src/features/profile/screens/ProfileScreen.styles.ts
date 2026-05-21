import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colours.backgroundDark,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.backgroundLight,
  },
  container: {
    paddingBottom: spacing.xxl,
    maxWidth: 860,
    alignSelf: 'center',
    width: '100%',
  },

  // ── Dark hero cover ─────────────────────────────────────────────────────────
  coverPhotoContainer: {
    width: '100%',
    height: 200,
    backgroundColor: colours.backgroundMid,
  },
  coverPhoto: {
    width: '100%',
    height: 200,
  },
  coverPhotoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colours.backgroundMid,
  },
  uploadHint: {
    fontSize: typography.xs,
    color: 'rgba(255,255,255,0.35)',
    fontWeight: '500',
  },

  // ── Logo overlapping hero ───────────────────────────────────────────────────
  logoContainer: {
    marginTop: -44,
    marginLeft: spacing.lg,
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: radius.xl,
    borderWidth: 3,
    borderColor: colours.backgroundDark,
  },
  logoPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: radius.xl,
    backgroundColor: colours.backgroundMid,
    borderWidth: 3,
    borderColor: colours.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Info section (light bg starts here) ────────────────────────────────────
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colours.backgroundLight,
  },
  restaurantName: {
    fontSize: typography.xxl,
    fontWeight: '800',
    color: colours.textOnLight,
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
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
    backgroundColor: colours.primary + '18',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.primary + '44',
  },
  statusText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colours.primary,
    textTransform: 'capitalize',
  },

  // ── Account card ────────────────────────────────────────────────────────────
  accountSection: {
    backgroundColor: colours.surface,
    marginHorizontal: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: typography.xxs,
    fontWeight: '800',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
  },
  accountName: {
    fontSize: typography.md,
    fontWeight: '700',
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

  // ── Logout ──────────────────────────────────────────────────────────────────
  logoutButton: {
    marginHorizontal: spacing.md,
    backgroundColor: colours.surface,
    borderWidth: 1.5,
    borderColor: colours.error + '55',
    borderRadius: radius.full,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    maxWidth: 400,
  },
  logoutText: {
    color: colours.error,
    fontSize: typography.md,
    fontWeight: '700',
  },
});
