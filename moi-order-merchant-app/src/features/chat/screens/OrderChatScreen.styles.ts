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
    paddingVertical: spacing.sm + 2,
    backgroundColor: colours.backgroundDark,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colours.dividerDark,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerInfo: { flex: 1 },
  topBarTitle: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnDark,
  },
  topBarSub: {
    fontSize: typography.xxs,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 1,
  },
  body: { flex: 1, backgroundColor: colours.backgroundLight },
  list: { flex: 1 },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  emptyText: { fontSize: typography.sm, color: colours.textMuted, textAlign: 'center', marginTop: 8 },
  loaderWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // ── Chat bubbles ────────────────────────────────────────────────────────────
  bubbleRow: { flexDirection: 'row' },
  bubbleRowRight: { justifyContent: 'flex-end' },
  bubbleRowLeft: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '76%',
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 4,
  },
  bubbleMerchant: {
    backgroundColor: colours.primary,
    borderBottomRightRadius: 4,
    shadowColor: colours.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  bubbleOther: {
    backgroundColor: colours.surface,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  senderName: { fontSize: typography.xxs, fontWeight: '700', color: colours.textMuted },
  bubbleImage: { width: 200, height: 150, borderRadius: radius.lg },
  bubbleText: { fontSize: typography.sm, lineHeight: 20 },
  bubbleTextMerchant: { color: colours.white },
  bubbleTextOther: { color: colours.textOnLight },
  bubbleTime: { fontSize: typography.xxs, alignSelf: 'flex-end' },
  bubbleTimeMerchant: { color: 'rgba(255,255,255,0.55)' },
  bubbleTimeOther: { color: colours.textMuted },

  // ── Send error ──────────────────────────────────────────────────────────────
  sendErrorBanner: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colours.errorBg,
    borderTopWidth: 1,
    borderTopColor: colours.error + '33',
  },
  sendErrorText: {
    fontSize: typography.xxs,
    color: colours.error,
    textAlign: 'center',
  },

  // ── Input bar ───────────────────────────────────────────────────────────────
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
    backgroundColor: colours.surfaceMuted,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.sm,
    color: colours.textOnLight,
    maxHeight: 100,
    borderWidth: 1.5,
    borderColor: colours.divider,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colours.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colours.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  sendBtnDisabled: {
    opacity: 0.4,
    shadowOpacity: 0,
    elevation: 0,
  },

  // ── Photo lightbox ──────────────────────────────────────────────────────────
  photoOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoFull: {
    width: '100%',
    height: '80%',
  },
  photoCloseBtn: {
    position: 'absolute',
    top: 52,
    right: spacing.md,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
