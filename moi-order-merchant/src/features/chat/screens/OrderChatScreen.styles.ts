import { Platform, StyleSheet } from 'react-native';
import { colours } from '../../../shared/theme/colours';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';

const CHAT_BG      = '#0a1f12';
const FROST        = 'rgba(255,255,255,0.08)';
const FROST_BORDER = 'rgba(255,255,255,0.12)';
const FROST_TEXT   = 'rgba(255,255,255,0.45)';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colours.backgroundDark },

  // ── Header ─────────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colours.backgroundDark,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: FROST_BORDER,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FROST,
    borderWidth: 1,
    borderColor: FROST_BORDER,
  },
  headerInfo: { flex: 1 },
  topBarTitle: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colours.textOnDark,
    lineHeight: Platform.select({ web: 20, default: 44 }),
  },
  orderPill: {
    alignSelf: 'flex-start',
    marginTop: 3,
    backgroundColor: colours.primary + '22',
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
  body: { flex: 1, backgroundColor: CHAT_BG },
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
    color: FROST_TEXT,
    textAlign: 'center',
    marginTop: 8,
  },
  loaderWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // ── System notice pill ─────────────────────────────────────────────────────
  systemNotice: {
    alignSelf: 'center',
    backgroundColor: FROST,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    marginVertical: spacing.xs,
    borderWidth: 1,
    borderColor: FROST_BORDER,
  },
  systemNoticeText: {
    fontSize: typography.xxs,
    lineHeight: Platform.select({ web: 16, default: 30 }),
    color: FROST_TEXT,
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
  },
  bubbleMerchant: {
    backgroundColor: colours.primary,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: FROST,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: FROST_BORDER,
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
  bubbleTextOther: { color: '#ffffff' },
  bubbleLinkMerchant: { color: colours.backgroundDark, textDecorationLine: 'underline' } as const,
  bubbleLinkOther: { color: colours.primaryLight, textDecorationLine: 'underline' } as const,
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
  bubbleTimeOther: { color: FROST_TEXT },

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
    backgroundColor: colours.backgroundDark,
    borderTopWidth: 1,
    borderTopColor: FROST_BORDER,
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
    color: FROST_TEXT,
  },

  // ── Quoted reply inside bubble ─────────────────────────────────────────────
  replyQuote: {
    borderLeftWidth: 3,
    borderLeftColor: 'rgba(255,255,255,0.35)',
    borderRadius: 4,
    paddingLeft: spacing.sm,
    paddingRight: spacing.xs,
    paddingVertical: spacing.xs,
    marginBottom: 6,
    gap: 2,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  replyQuoteMerchant: {
    borderLeftColor: 'rgba(0,0,0,0.3)',
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  replyQuoteSender: {
    fontSize: typography.xxs,
    lineHeight: Platform.select({ web: 15, default: 20 }),
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
  },
  replyQuoteSenderMerchant: { color: colours.backgroundDark },
  replyQuoteText: {
    fontSize: typography.xxs,
    lineHeight: Platform.select({ web: 14, default: 18 }),
    color: 'rgba(255,255,255,0.45)',
  },
  replyQuoteTextMerchant: { color: 'rgba(15,61,37,0.65)' },

  // ── Input bar ──────────────────────────────────────────────────────────────
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colours.backgroundDark,
    borderTopWidth: 1,
    borderTopColor: FROST_BORDER,
  },
  attachBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FROST,
    borderWidth: 1,
    borderColor: FROST_BORDER,
  },
  textInput: {
    flex: 1,
    backgroundColor: FROST,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    fontSize: typography.sm,
    color: colours.textOnDark,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: FROST_BORDER,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: colours.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.3 },

  // ── Image preview strip ────────────────────────────────────────────────────
  imagePreviewStrip: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
    backgroundColor: colours.backgroundDark,
    borderTopWidth: 1,
    borderTopColor: FROST_BORDER,
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
    backgroundColor: FROST,
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
    backgroundColor: 'rgba(220,38,38,0.15)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(220,38,38,0.25)',
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
    backgroundColor: 'rgba(220,38,38,0.12)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(220,38,38,0.2)',
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
    backgroundColor: 'rgba(217,119,6,0.12)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(217,119,6,0.2)',
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
    backgroundColor: 'rgba(217,119,6,0.12)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(217,119,6,0.2)',
  },
  noticeText: {
    flex: 1,
    fontSize: typography.xxs,
    lineHeight: Platform.select({ web: 14, default: 18 }),
    color: colours.warning,
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
    backgroundColor: FROST,
    borderWidth: 1,
    borderColor: FROST_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
