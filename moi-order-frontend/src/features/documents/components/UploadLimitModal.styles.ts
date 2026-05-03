import { StyleSheet } from 'react-native';

import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },

  sheet: {
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    gap: spacing.sm,
  },

  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: `${colours.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },

  title: {
    fontSize: typography.md,
    fontWeight: '800',
    color: colours.primary,
    textAlign: 'center',
  },

  body: {
    fontSize: typography.sm,
    color: colours.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },

  highlight: {
    fontWeight: '700',
    color: colours.primary,
  },

  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
    width: '100%',
  },

  btn: {
    flex: 1,
    paddingVertical: spacing.sm + 4,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelBtn: {
    backgroundColor: colours.backgroundLight,
    borderWidth: 1,
    borderColor: `${colours.textMuted}33`,
  },
  cancelBtnText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colours.textMuted,
  },

  uploadBtn: {
    backgroundColor: colours.primary,
  },
  uploadBtnText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colours.card,
  },
});
