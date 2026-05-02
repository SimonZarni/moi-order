import { StyleSheet } from 'react-native';
import { colours } from '@/shared/theme/colours';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { typography } from '@/shared/theme/typography';

export const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  header: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: colours.infoBg,
    borderRadius: radius.lg,
    padding: spacing.sm,
  },
  noticeText: {
    flex: 1,
    fontSize: typography.xxs,
    color: colours.textMuted,
    lineHeight: 16,
  },
  loader: { marginVertical: spacing.md },
  emptyText: {
    fontSize: typography.sm,
    color: colours.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  list: { maxHeight: 320 },
  listContent: { gap: spacing.xs, paddingVertical: spacing.xs },
  // Bubbles
  bubbleRow: {
    flexDirection: 'row',
  },
  bubbleRowRight: { justifyContent: 'flex-end' },
  bubbleRowLeft:  { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '78%',
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 4,
  },
  bubbleCustomer: {
    backgroundColor: colours.primary,
    borderBottomRightRadius: 4,
  },
  bubbleAdmin: {
    backgroundColor: colours.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colours.divider,
  },
  senderName: {
    fontSize: typography.xxs,
    fontWeight: '700',
    color: colours.textMuted,
  },
  bubbleImage: {
    width: 180,
    height: 140,
    borderRadius: radius.lg,
  },
  bubbleText: {
    fontSize: typography.sm,
    lineHeight: 20,
  },
  bubbleTextCustomer: { color: colours.white },
  bubbleTextAdmin:    { color: colours.textOnLight },
  bubbleTime: {
    fontSize: typography.xxs,
    alignSelf: 'flex-end',
  },
  bubbleTimeCustomer: { color: 'rgba(255,255,255,0.65)' },
  bubbleTimeAdmin:    { color: colours.textMuted },
  // Input row
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs,
    backgroundColor: colours.card,
    borderRadius: radius.xl,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colours.divider,
  },
  attachBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: typography.sm,
    color: colours.textOnLight,
    maxHeight: 100,
    paddingVertical: spacing.xs,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colours.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});
