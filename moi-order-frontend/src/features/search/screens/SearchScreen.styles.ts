import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { spacing } from '@/shared/theme/spacing';
import { radius } from '@/shared/theme/radius';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colours.backgroundDark },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    backgroundColor: colours.backgroundDark, gap: spacing.sm,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: radius.full,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  backText: { fontSize: 18, color: colours.textOnDark, fontWeight: '600' },
  input: {
    flex: 1, fontSize: typography.md,
    color: colours.textOnDark,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.full,
    minHeight: 40,
  },
  placeholder: { color: 'rgba(255,255,255,0.5)' },
  clearBtn: {
    width: 28, height: 28, borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  clearText: { fontSize: 11, color: colours.textOnDark },

  tabsRow: {
    flexDirection: 'row', gap: spacing.xs,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    backgroundColor: colours.backgroundLight,
    borderBottomWidth: 1, borderBottomColor: colours.divider,
  },
  tab: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: radius.full, backgroundColor: colours.infoBg,
    borderWidth: 1.5, borderColor: colours.infoBorder,
    minHeight: 32, justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: colours.primary, borderColor: colours.primary,
  },
  tabText:       { fontSize: typography.xs, fontWeight: '600', color: colours.primary },
  tabTextActive: { color: colours.white },

  body: { flex: 1, backgroundColor: colours.backgroundLight },

  loader:      { marginTop: spacing.xl },
  loaderColor: { color: colours.primary },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 },
  emptyIcon:  { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { fontSize: typography.lg, fontWeight: '700', color: colours.textOnLight, marginBottom: spacing.xs },
  emptySubtitle: { fontSize: typography.sm, color: colours.textMuted },

  list: { paddingBottom: 80 },
  resultRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colours.divider,
    minHeight: 64, gap: spacing.sm,
  },
  thumb: {
    width: 48, height: 48, borderRadius: radius.md, overflow: 'hidden',
    backgroundColor: colours.infoBg, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colours.infoBorder,
  },
  thumbImg:   { width: '100%', height: '100%' },
  thumbEmoji: { fontSize: 22 },
  resultText: { flex: 1 },
  resultTitle: { fontSize: typography.md, fontWeight: '600', color: colours.textOnLight },
  resultSubtitle: { fontSize: typography.xs, color: colours.textMuted, marginTop: 2 },
  typeBadge: {
    backgroundColor: colours.infoBg, borderRadius: radius.full,
    paddingHorizontal: spacing.sm, paddingVertical: 2,
  },
  typeBadgeText: { fontSize: 10, fontWeight: '700', color: colours.primary, textTransform: 'capitalize' },
});
