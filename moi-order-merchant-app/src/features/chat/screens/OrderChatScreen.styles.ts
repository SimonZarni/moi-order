import { StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.backgroundDark },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colours.backgroundDark,
    gap: spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  headerInfo: { flex: 1 },
  topBarTitle: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnDark,
  },
  topBarSub: {
    fontSize: typography.xxs,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 1,
  },
  body: { flex: 1, backgroundColor: colours.backgroundLight },
  list: { flex: 1 },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  emptyText: { fontSize: typography.sm, color: colours.textMuted, textAlign: 'center', marginTop: 8 },
  loaderWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  // Bubbles
  bubbleRow: { flexDirection: 'row' },
  bubbleRowRight: { justifyContent: 'flex-end' },
  bubbleRowLeft: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '78%',
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 4,
  },
  bubbleMerchant: {
    backgroundColor: colours.primary,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: colours.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colours.divider,
  },
  senderName: { fontSize: typography.xxs, fontWeight: '700', color: colours.textMuted },
  bubbleImage: { width: 180, height: 140, borderRadius: radius.lg },
  bubbleText: { fontSize: typography.sm, lineHeight: 20 },
  bubbleTextMerchant: { color: colours.white },
  bubbleTextOther: { color: colours.textOnLight },
  bubbleTime: { fontSize: typography.xxs, alignSelf: 'flex-end' },
  bubbleTimeMerchant: { color: 'rgba(255,255,255,0.6)' },
  bubbleTimeOther: { color: colours.textMuted },
  // Send error
  sendErrorBanner: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: '#fee2e2',
    borderTopWidth: 1,
    borderTopColor: '#fca5a5',
  },
  sendErrorText: {
    fontSize: typography.xxs,
    color: '#dc2626',
    textAlign: 'center',
  },
  // Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colours.surface,
    borderTopWidth: 1,
    borderTopColor: colours.divider,
  },
  attachBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: colours.backgroundLight,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.sm,
    color: colours.textOnLight,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colours.divider,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colours.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.4 },
});
