import { Platform, StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.surface },

  // ── Header ─────────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colours.surface,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colours.surfaceMuted,
    borderWidth: 1,
    borderColor: colours.divider,
  },
  headerInfo: { flex: 1 },
  topBarTitle: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnLight,
    lineHeight: Platform.select({ web: 20, default: 44 }),
  },
  orderPill: {
    alignSelf: 'flex-start',
    marginTop: 3,
    backgroundColor: colours.primary + '18',
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colours.primary + '44',
  },
  orderPillText: {
    fontSize: typography.xxs,
    lineHeight: Platform.select({ web: 14, default: 18 }),
    color: colours.primary,
    fontWeight: '600',
  },

  // ── Body ───────────────────────────────────────────────────────────────────
  body: { flex: 1, backgroundColor: colours.backgroundLight },
  list: { flex: 1 },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  listContentWeb: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  emptyText: {
    fontSize: typography.sm,
    color: colours.textSubtle,
    textAlign: 'center',
    marginTop: 8,
  },
  loaderWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // ── System notice pill ─────────────────────────────────────────────────────
  systemNotice: {
    alignSelf: 'center',
    backgroundColor: colours.surfaceMuted,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    marginVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colours.divider,
  },
  systemNoticeText: {
    fontSize: typography.xxs,
    lineHeight: Platform.select({ web: 16, default: 30 }),
    color: colours.textSubtle,
    textAlign: 'center',
  },

  // ── Bubbles ────────────────────────────────────────────────────────────────
  bubbleRow: { flexDirection: 'row' },
  bubbleRowRight: { justifyContent: 'flex-end' },
  bubbleRowLeft: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '76%',
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 4,
    overflow: 'hidden',
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
  senderName: {
    fontSize: typography.xxs,
    lineHeight: Platform.select({ web: 16, default: 30 }),
    fontWeight: '700',
    color: colours.primary,
  },
  bubbleImage: { width: 200, height: 150, borderRadius: radius.lg },
  bubbleText: {
    fontSize: typography.sm,
    lineHeight: Platform.select({ web: 20, default: 42 }),
  },
  bubbleTextMerchant: { color: colours.backgroundDark },
  bubbleTextOther: { color: colours.textOnLight },
  bubbleLinkMerchant: { color: colours.backgroundDark, textDecorationLine: 'underline' } as const,
  bubbleLinkOther: { color: colours.primary, textDecorationLine: 'underline' } as const,
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 3,
  },
  bubbleTime: {
    fontSize: typography.xxs,
    lineHeight: Platform.select({ web: 16, default: 30 }),
  },
  bubbleTimeMerchant: { color: 'rgba(15,61,37,0.6)' },
  bubbleTimeOther: { color: colours.textSubtle },

  // ── Swipe-to-reply hints ───────────────────────────────────────────────────
  replyHintLeft: {
    position: 'absolute',
    left: 2,
    top: 0,
    bottom: 0,
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  replyHintRight: {
    position: 'absolute',
    right: 2,
    top: 0,
    bottom: 0,
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Reply bar (above input) ────────────────────────────────────────────────
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colours.surface,
    borderTopWidth: 1,
    borderTopColor: colours.divider,
  },
  replyBarIndicator: {
    width: 3,
    alignSelf: 'stretch',
    borderRadius: 2,
    backgroundColor: colours.primary,
  },
  replyBarContent: { flex: 1, gap: 2 },
  replyBarSender: {
    fontSize: typography.xxs,
    lineHeight: Platform.select({ web: 14, default: 18 }),
    fontWeight: '700',
    color: colours.primary,
  },
  replyBarText: {
    fontSize: typography.xxs,
    lineHeight: Platform.select({ web: 14, default: 18 }),
    color: colours.textSubtle,
  },

  // ── Quoted reply inside bubble ─────────────────────────────────────────────
  replyQuote: {
    borderLeftWidth: 3,
    borderLeftColor: colours.primary,
    borderRadius: 4,
    paddingLeft: spacing.sm,
    paddingRight: spacing.xs,
    paddingVertical: spacing.xs,
    marginBottom: 6,
    gap: 2,
    backgroundColor: colours.primaryBg,
  },
  replyQuoteMerchant: {
    borderLeftColor: 'rgba(0,0,0,0.3)',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  replyQuoteSender: {
    fontSize: typography.xxs,
    lineHeight: Platform.select({ web: 15, default: 20 }),
    fontWeight: '700',
    color: colours.primary,
  },
  replyQuoteSenderMerchant: { color: colours.backgroundDark },
  replyQuoteText: {
    fontSize: typography.xxs,
    lineHeight: Platform.select({ web: 14, default: 18 }),
    color: colours.textMuted,
  },
  replyQuoteTextMerchant: { color: 'rgba(15,61,37,0.65)' },

  // ── Input bar ──────────────────────────────────────────────────────────────
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
    width: 38,
    height: 38,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colours.surfaceMuted,
    borderWidth: 1,
    borderColor: colours.divider,
  },
  textInput: {
    flex: 1,
    backgroundColor: colours.surfaceMuted,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    fontSize: typography.sm,
    color: colours.textOnLight,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: colours.divider,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: colours.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.35 },

  // ── Image preview strip ────────────────────────────────────────────────────
  imagePreviewStrip: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
    backgroundColor: colours.surface,
    borderTopWidth: 1,
    borderTopColor: colours.divider,
  },
  imagePreviewItem: {
    position: 'relative',
    width: 64,
    height: 64,
  },
  imagePreviewThumb: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colours.divider,
  },
  imagePreviewRemove: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colours.error,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Status banners ─────────────────────────────────────────────────────────
  sendErrorBanner: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colours.error + '12',
    borderTopWidth: 1,
    borderTopColor: colours.error + '33',
  },
  sendErrorText: {
    fontSize: typography.xxs,
    color: colours.error,
    textAlign: 'center',
  },
  chatLockedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colours.error + '12',
    borderTopWidth: 1,
    borderTopColor: colours.error + '25',
  },
  chatLockedText: {
    flex: 1,
    fontSize: typography.xxs,
    lineHeight: Platform.select({ web: 14, default: 18 }),
    color: colours.error,
  },
  chatWarningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colours.warning + '14',
    borderTopWidth: 1,
    borderTopColor: colours.warning + '33',
  },
  chatWarningText: {
    flex: 1,
    fontSize: typography.xxs,
    lineHeight: Platform.select({ web: 14, default: 18 }),
    color: colours.warning,
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colours.warning + '14',
    borderBottomWidth: 1,
    borderBottomColor: colours.warning + '33',
  },
  noticeText: {
    flex: 1,
    fontSize: typography.xxs,
    lineHeight: Platform.select({ web: 14, default: 18 }),
    color: colours.warning,
  },

  // ── Hover reply button (web desktop only) ─────────────────────────────────
  hoverReplyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colours.surface,
    borderWidth: 1,
    borderColor: colours.divider,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  // ── Highlight flash overlay (inside bubble) ────────────────────────────────
  bubbleHighlight: {
    borderRadius: radius.xl,
    backgroundColor: colours.primary + '44',
  },

  // ── Long-press reply menu ──────────────────────────────────────────────────
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  menuCard: {
    width: '75%',
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  menuPreviewWrap: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: 4,
  },
  menuPreviewText: {
    fontSize: typography.sm,
    lineHeight: Platform.select({ web: 20, default: 42 }),
    color: colours.textMuted,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colours.divider,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  menuOptionText: {
    fontSize: typography.md,
    lineHeight: Platform.select({ web: 20, default: 44 }),
    fontWeight: '600',
    color: colours.primary,
  },

  // ── Photo fullscreen overlay ───────────────────────────────────────────────
  photoOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.96)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoFull: { width: '100%', height: '80%' },
  photoCloseBtn: {
    position: 'absolute',
    top: 52,
    right: spacing.md,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
