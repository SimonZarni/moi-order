import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { radius } from '../../../shared/theme/radius';

const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.07,
  shadowRadius: 10,
  elevation: 3,
};

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.backgroundDark },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colours.backgroundLight },
  container: { paddingBottom: spacing.xxl, maxWidth: 860, alignSelf: 'center', width: '100%' },

  // ── Cover photo ──────────────────────────────────────────────────────────────
  coverPhotoContainer: {
    width: '100%',
    height: 220,
    backgroundColor: colours.backgroundMid,
    position: 'relative',
  },
  coverPhoto: { width: '100%', height: 220 },
  coverPhotoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colours.backgroundMid,
  },
  uploadHint: { fontSize: typography.xs, color: 'rgba(255,255,255,0.3)', fontWeight: '500' },
  coverEditBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Identity row ─────────────────────────────────────────────────────────────
  identityRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: -44,
    marginBottom: spacing.md,
  },
  logoContainer: { position: 'relative' },
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
  logoEditBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: radius.full,
    backgroundColor: colours.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colours.backgroundDark,
  },
  restaurantInfo: {
    flex: 1,
    paddingBottom: spacing.xs,
    gap: 4,
  },
  restaurantName: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colours.textOnLight,
    letterSpacing: -0.4,
  },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  address: { fontSize: typography.xs, color: colours.textMuted, flex: 1 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: colours.primary + '18',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.primary + '44',
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colours.primary },
  statusText: { fontSize: typography.xxs, fontWeight: '700', color: colours.primary, textTransform: 'capitalize' },

  description: {
    fontSize: typography.sm,
    color: colours.textMuted,
    lineHeight: 20,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },

  // ── Section blocks ───────────────────────────────────────────────────────────
  sectionBlock: { paddingHorizontal: spacing.md, marginBottom: spacing.md },
  sectionTitle: {
    fontSize: typography.xxs,
    fontWeight: '800',
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },

  // ── Account card ─────────────────────────────────────────────────────────────
  accountCard: {
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadow,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  accountIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  accountInfo: { flex: 1, gap: 2 },
  accountLabel: { fontSize: typography.xxs, fontWeight: '600', color: colours.textMuted, textTransform: 'uppercase', letterSpacing: 0.6 },
  accountValue: { fontSize: typography.sm, fontWeight: '600', color: colours.textOnLight },
  rowDivider: { height: 1, backgroundColor: colours.divider, marginLeft: 36 + spacing.md * 2 },

  // ── Logout ───────────────────────────────────────────────────────────────────
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colours.surface,
    borderWidth: 1.5,
    borderColor: colours.error + '44',
    borderRadius: radius.xl,
    padding: spacing.md,
    minHeight: 54,
    ...shadow,
  },
  logoutText: { color: colours.error, fontSize: typography.md, fontWeight: '700' },

  // kept for compat
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  accountSection: { backgroundColor: colours.surface, marginHorizontal: spacing.md, borderRadius: radius.xl, padding: spacing.md, marginBottom: spacing.md },
  accountName: { fontSize: typography.md, fontWeight: '700', color: colours.textOnLight },
  accountEmail: { fontSize: typography.sm, color: colours.textMuted },
  accountPhone: { fontSize: typography.sm, color: colours.textMuted },
});
