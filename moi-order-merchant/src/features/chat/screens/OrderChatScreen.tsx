import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Animated, FlatList, Image, Keyboard, KeyboardAvoidingView,
  Modal, PanResponder, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colours } from '../../../shared/theme/colours';
import type { OrderChatMessage } from '../../../types/models';
import type { MerchantStackParamList } from '../../../types/navigation';
import { useOrderChatScreen, SelectedImage } from '../hooks/useOrderChatScreen';
import { styles } from './OrderChatScreen.styles';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import { LinkedText } from '../../../shared/components/LinkedText';

type Route = RouteProp<MerchantStackParamList, 'OrderChat'>;

// React Native Web does not support the `inverted` FlatList prop — it uses a
// CSS transform that breaks in browser rendering. We detect web once at module
// scope so the flag is stable across renders.
const IS_WEB = Platform.OS === 'web';

// Hover interactions only make sense on desktop browsers (pointer: fine = mouse).
// On Android/iOS PWA, Platform.OS is still 'web' but there is no mouse hover.
const IS_DESKTOP_WEB =
  IS_WEB &&
  typeof window !== 'undefined' &&
  window.matchMedia?.('(pointer: fine)').matches === true;

// ── Notice banner ─────────────────────────────────────────────────────────────

interface NoticeBannerProps {
  text: string;
  onDismiss: () => void;
}

function NoticeBanner({ text, onDismiss }: NoticeBannerProps): React.JSX.Element {
  return (
    <View style={styles.noticeBanner}>
      <Ionicons name="information-circle-outline" size={14} color={colours.warning} />
      <Text style={styles.noticeText}>{text}</Text>
      <Pressable
        onPress={onDismiss}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Dismiss notice"
      >
        <Ionicons name="close" size={14} color={colours.textSubtle} />
      </Pressable>
    </View>
  );
}

// ── Reply bar ─────────────────────────────────────────────────────────────────

interface ReplyBarProps {
  replyingTo: OrderChatMessage;
  photoLabel: string;
  onCancel: () => void;
  cancelLabel: string;
  replyToLabel: string;
}

function ReplyBar({ replyingTo, photoLabel, onCancel, cancelLabel, replyToLabel }: ReplyBarProps): React.JSX.Element {
  const preview =
    replyingTo.image_url !== null && replyingTo.body === null
      ? `📷 ${photoLabel}`
      : (replyingTo.body ?? '');
  return (
    <View style={styles.replyBar}>
      <View style={styles.replyBarIndicator} />
      <View style={styles.replyBarContent}>
        <Text style={styles.replyBarSender}>{replyToLabel} {replyingTo.sender_name}</Text>
        <Text style={styles.replyBarText} numberOfLines={1}>{preview}</Text>
      </View>
      <Pressable
        onPress={onCancel}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={cancelLabel}
      >
        <Ionicons name="close" size={18} color={colours.textSubtle} />
      </Pressable>
    </View>
  );
}

// ── Animated message bubble ───────────────────────────────────────────────────

interface BubbleProps {
  msg: OrderChatMessage;
  isNew: boolean;
  isHighlighted: boolean;
  onPhotoPress: (uri: string) => void;
  onReply: (msg: OrderChatMessage) => void;
  onLongPress?: (msg: OrderChatMessage) => void;
  onPressQuote: (replyToId: number) => void;
}

function AnimatedBubble({ msg, isNew, isHighlighted, onPhotoPress, onReply, onLongPress, onPressQuote }: BubbleProps): React.JSX.Element {
  const [isHovered, setIsHovered] = useState(false);

  if (msg.sender_type === 'system') {
    return (
      <View style={styles.systemNotice}>
        <Text style={styles.systemNoticeText}>{msg.body}</Text>
      </View>
    );
  }

  const isMerchant = msg.sender_type === 'merchant';
  const time = new Date(msg.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  // ── Entrance animation (native driver) ─────────────────────────────────────
  const entranceOpacity = useRef(new Animated.Value(isNew ? 0 : 1)).current;
  const entranceSlide   = useRef(new Animated.Value(isNew ? (isMerchant ? 20 : -20) : 0)).current;

  useEffect(() => {
    if (!isNew) return;
    Animated.parallel([
      Animated.timing(entranceOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.spring(entranceSlide, { toValue: 0, damping: 18, mass: 0.5, stiffness: 220, useNativeDriver: true }),
    ]).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Highlight flash (jump-to-message) ─────────────────────────────────────
  const highlightOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!isHighlighted) return;
    highlightOpacity.setValue(1);
    Animated.timing(highlightOpacity, { toValue: 0, duration: 900, useNativeDriver: true }).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHighlighted]);

  // ── Bidirectional swipe-to-reply (JS driver) ───────────────────────────────
  // Right swipe (+dx) → left hint visible   Left swipe (−dx) → right hint visible
  const swipeX          = useRef(new Animated.Value(0)).current;
  const hasTriggeredRef = useRef(false);
  const THRESHOLD       = 60;

  const springBack = () => {
    Animated.spring(swipeX, { toValue: 0, damping: 20, stiffness: 300, mass: 0.5, useNativeDriver: false }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderGrant: () => {
        hasTriggeredRef.current = false;
      },
      onPanResponderMove: (_, g) => {
        swipeX.setValue(Math.min(Math.max(g.dx, -72), 72));
        if (!hasTriggeredRef.current && Math.abs(g.dx) >= THRESHOLD) {
          hasTriggeredRef.current = true;
          onReply(msg);
        }
      },
      onPanResponderRelease: springBack,
      onPanResponderTerminate: springBack,
    }),
  ).current;

  // Left hint: fades in when swiping RIGHT (+swipeX)
  const leftHintOpacity = swipeX.interpolate({
    inputRange: [0, THRESHOLD * 0.4, THRESHOLD],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });
  // Right hint: fades in when swiping LEFT (−swipeX)
  const rightHintOpacity = swipeX.interpolate({
    inputRange: [-THRESHOLD, -THRESHOLD * 0.4, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  // reply_to_body can be null when the original message was image-only, so
  // gate on reply_to_id (the FK) not body.
  const hasReply = msg.reply_to_id != null;

  return (
    // Outer: entrance (native thread — zero JS cost per frame)
    // onMouseEnter/onMouseLeave track hover for desktop web — these DOM events
    // do NOT fire when the cursor moves between children (unlike onHoverIn/Out
    // on Pressable which fires "out" when entering a nested Pressable child).
    <Animated.View
      style={{ opacity: entranceOpacity, transform: [{ translateX: entranceSlide }] }}
      // @ts-ignore — RN Web forwards unknown props to the DOM element
      onMouseEnter={IS_DESKTOP_WEB ? () => setIsHovered(true) : undefined}
      onMouseLeave={IS_DESKTOP_WEB ? () => setIsHovered(false) : undefined}
    >
      {/* Long-press wrapper — does not interfere with inner swipe PanResponder */}
      <Pressable
        style={{ position: 'relative' }}
        onLongPress={onLongPress !== undefined ? () => onLongPress(msg) : undefined}
        delayLongPress={400}
        accessibilityRole="none"
      >
        <Animated.View style={[styles.replyHintLeft,  { opacity: leftHintOpacity }]}>
          <Ionicons name="return-up-back-outline"    size={18} color={colours.primary} />
        </Animated.View>
        <Animated.View style={[styles.replyHintRight, { opacity: rightHintOpacity }]}>
          <Ionicons name="return-up-forward-outline" size={18} color={colours.primary} />
        </Animated.View>

        {/* Inner: swipe translation (JS thread) */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.bubbleRow,
            isMerchant ? styles.bubbleRowRight : styles.bubbleRowLeft,
            { transform: [{ translateX: swipeX }] },
          ]}
        >
          {/* Hover reply button — desktop web only, left side for merchant bubbles */}
          {IS_DESKTOP_WEB && isMerchant && isHovered && onLongPress !== undefined && (
            <Pressable
              style={styles.hoverReplyBtn}
              onPress={() => onReply(msg)}
              accessibilityRole="button"
              accessibilityLabel="Reply to message"
            >
              <Ionicons name="return-up-back-outline" size={15} color={colours.primary} />
            </Pressable>
          )}

          <View style={[styles.bubble, isMerchant ? styles.bubbleMerchant : styles.bubbleOther]}>
            {!isMerchant && <Text style={styles.senderName}>{msg.sender_name}</Text>}

            {hasReply && (
              <Pressable
                onPress={() => onPressQuote(msg.reply_to_id!)}
                accessibilityRole="button"
                accessibilityLabel="Jump to original message"
              >
                <View style={[styles.replyQuote, isMerchant && styles.replyQuoteMerchant]}>
                  <Text style={[styles.replyQuoteSender, isMerchant && styles.replyQuoteSenderMerchant]}>
                    {msg.reply_to_sender_name}
                  </Text>
                  <Text style={[styles.replyQuoteText, isMerchant && styles.replyQuoteTextMerchant]} numberOfLines={1}>
                    {msg.reply_to_body ?? '📷 Photo'}
                  </Text>
                </View>
              </Pressable>
            )}

            {msg.image_url !== null && (
              <Pressable onPress={() => onPhotoPress(msg.image_url!)} accessibilityRole="button" accessibilityLabel="View full photo">
                <Image source={{ uri: msg.image_url }} style={styles.bubbleImage} resizeMode="cover" />
              </Pressable>
            )}
            {msg.body !== null && (
              <LinkedText
                text={msg.body}
                style={[styles.bubbleText, isMerchant ? styles.bubbleTextMerchant : styles.bubbleTextOther]}
                linkStyle={isMerchant ? styles.bubbleLinkMerchant : styles.bubbleLinkOther}
              />
            )}

            {/* Time + status tick */}
            <View style={styles.bubbleFooter}>
              <Text style={[styles.bubbleTime, isMerchant ? styles.bubbleTimeMerchant : styles.bubbleTimeOther]}>
                {time}
              </Text>
              {isMerchant && (
                <Ionicons
                  name={msg.read_at != null ? 'checkmark-done' : 'checkmark'}
                  size={13}
                  color={msg.read_at != null ? 'rgba(15,26,20,0.9)' : 'rgba(15,26,20,0.45)'}
                />
              )}
            </View>

            {/* Green flash highlight overlay — fades in 900ms after jump-to-message */}
            <Animated.View
              pointerEvents="none"
              style={[StyleSheet.absoluteFillObject, styles.bubbleHighlight, { opacity: highlightOpacity }]}
            />
          </View>

          {/* Hover reply button — desktop web only, right side for customer bubbles */}
          {IS_DESKTOP_WEB && !isMerchant && isHovered && onLongPress !== undefined && (
            <Pressable
              style={styles.hoverReplyBtn}
              onPress={() => onReply(msg)}
              accessibilityRole="button"
              accessibilityLabel="Reply to message"
            >
              <Ionicons name="return-up-back-outline" size={15} color={colours.primary} />
            </Pressable>
          )}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

// ── Image preview strip item ──────────────────────────────────────────────────

interface ImagePreviewItemProps {
  img: SelectedImage;
  index: number;
  onRemove: (i: number) => void;
}

function ImagePreviewItem({ img, index, onRemove }: ImagePreviewItemProps): React.JSX.Element {
  return (
    <View style={styles.imagePreviewItem}>
      <Image source={{ uri: img.uri }} style={styles.imagePreviewThumb} resizeMode="cover" />
      <Pressable
        style={styles.imagePreviewRemove}
        onPress={() => onRemove(index)}
        accessibilityRole="button"
        accessibilityLabel="Remove image"
      >
        <Ionicons name="close" size={12} color={colours.white} />
      </Pressable>
    </View>
  );
}

// ── Shared content ────────────────────────────────────────────────────────────

interface ContentProps {
  orderId: string;
  orderNumber?: string;
  completedAt: string | null;
  orderStatus: string;
  onBack: () => void;
}

export function OrderChatContent({ orderId, orderNumber, completedAt, orderStatus, onBack }: ContentProps): React.JSX.Element {
  const t = useTranslation();
  const {
    messages, isLoading, isError, isNetworkError, sendError, text, isSending, inputBarPadding,
    selectedImages, selectedPhoto, listRef, isChatLocked, isCompletedButNotLocked, replyingTo,
    pressedMessage, highlightedId,
    handleTextChange, handleSend, handleSetReply, handleAttachPress, handleRemoveImage,
    handlePhotoPress, handlePhotoClose,
    handleLongPress, handleCloseMenu, handleMenuReply, handleQuotePress, handleScrollToIndexFailed,
  } = useOrderChatScreen(orderId, orderStatus, completedAt);

  const [showNoticeBanner, setShowNoticeBanner] = useState(true);

  const initialIdsRef    = useRef<Set<number>>(new Set());
  const hasSeededInitial = useRef(false);
  if (!hasSeededInitial.current && messages.length > 0) {
    messages.forEach((m) => initialIdsRef.current.add(m.id));
    hasSeededInitial.current = true;
  }

  const canSend = !isSending && !isChatLocked && (text.trim().length > 0 || selectedImages.length > 0);

  // On web: FlatList is not inverted — scroll to end when content changes.
  const scrollToEndOnWeb = IS_WEB
    ? () => listRef.current?.scrollToEnd({ animated: false })
    : undefined;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={onBack} accessibilityLabel="Go back" accessibilityRole="button">
          <Ionicons name="arrow-back" size={20} color={colours.textOnLight} />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.topBarTitle}>{t('chat_title')}</Text>
          <View style={styles.orderPill}>
            <Text style={styles.orderPillText}>{orderNumber ?? `#${orderId}`}</Text>
          </View>
        </View>
      </View>

      {showNoticeBanner && (
        <NoticeBanner
          text={t('chat_notice_banner')}
          onDismiss={() => setShowNoticeBanner(false)}
        />
      )}

      {/* KAV enabled on iOS native and web (web: reduces body height when keyboard opens) */}
      <KeyboardAvoidingView
        behavior="padding"
        enabled={Platform.OS === 'ios' || IS_WEB}
        style={styles.body}
      >
        {isLoading ? (
          <Pressable style={styles.loaderWrap} onPress={Keyboard.dismiss}>
            <ActivityIndicator color={colours.primary} />
          </Pressable>
        ) : isError ? (
          <Pressable style={styles.emptyWrap} onPress={Keyboard.dismiss}>
            <Ionicons
              name={isNetworkError ? 'wifi-outline' : 'alert-circle-outline'}
              size={44}
              color={colours.textSubtle}
            />
            <Text style={styles.emptyText}>
              {isNetworkError ? t('chat_check_internet') : t('chat_cannot_load')}
            </Text>
          </Pressable>
        ) : messages.length === 0 ? (
          <Pressable style={styles.emptyWrap} onPress={Keyboard.dismiss}>
            <Ionicons name="chatbubbles-outline" size={44} color={colours.textSubtle} />
            <Text style={styles.emptyText}>{t('chat_no_messages')}</Text>
          </Pressable>
        ) : (
          <FlatList
            ref={listRef}
            // Web: pass messages as-is (oldest first) — inverted prop is broken on RN Web.
            // Native: reverse so newest is first, then invert the list to render bottom-up.
            data={IS_WEB ? messages : [...messages].reverse()}
            inverted={!IS_WEB}
            keyExtractor={(m) => String(m.id)}
            renderItem={({ item }) => (
              <AnimatedBubble
                msg={item}
                isNew={!initialIdsRef.current.has(item.id)}
                isHighlighted={highlightedId === item.id}
                onPhotoPress={handlePhotoPress}
                onReply={handleSetReply}
                onLongPress={isChatLocked ? undefined : handleLongPress}
                onPressQuote={handleQuotePress}
              />
            )}
            style={styles.list}
            contentContainerStyle={[
              styles.listContent,
              IS_WEB && styles.listContentWeb,
            ]}
            onContentSizeChange={scrollToEndOnWeb}
            onLayout={scrollToEndOnWeb}
            onScrollToIndexFailed={handleScrollToIndexFailed}
            accessibilityRole="list"
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
          />
        )}

        {sendError !== null && !isChatLocked && (
          <View style={styles.sendErrorBanner}>
            <Text style={styles.sendErrorText}>{sendError}</Text>
          </View>
        )}

        {selectedImages.length > 0 && !isChatLocked && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imagePreviewStrip}
            contentContainerStyle={{ gap: 8 }}
          >
            {selectedImages.map((img, i) => (
              <ImagePreviewItem key={`${img.uri}-${i}`} img={img} index={i} onRemove={handleRemoveImage} />
            ))}
          </ScrollView>
        )}

        {isChatLocked ? (
          <View style={styles.chatLockedBanner}>
            <Ionicons name="lock-closed-outline" size={14} color={colours.error} />
            <Text style={styles.chatLockedText}>{t('chat_locked')}</Text>
          </View>
        ) : (
          <>
            {isCompletedButNotLocked && (
              <View style={styles.chatWarningBanner}>
                <Ionicons name="time-outline" size={14} color={colours.warning} />
                <Text style={styles.chatWarningText}>{t('chat_will_close')}</Text>
              </View>
            )}

            {replyingTo !== null && (
              <ReplyBar
                replyingTo={replyingTo}
                photoLabel={t('chat_photo')}
                replyToLabel={t('chat_reply_to')}
                onCancel={() => handleSetReply(null)}
                cancelLabel={t('chat_cancel_reply')}
              />
            )}

            <View style={[styles.inputBar, { paddingBottom: IS_WEB ? 8 : inputBarPadding }]}>
              <Pressable
                style={styles.attachBtn}
                onPress={handleAttachPress}
                accessibilityRole="button"
                accessibilityLabel={t('chat_add_photo')}
              >
                <Ionicons name="image-outline" size={22} color={colours.primary} />
              </Pressable>
              <TextInput
                style={styles.textInput}
                placeholder={t('chat_type_message')}
                placeholderTextColor={colours.textSubtle}
                value={text}
                onChangeText={handleTextChange}
                multiline
                maxLength={2000}
                accessibilityLabel="Message input"
              />
              <Pressable
                style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
                onPress={handleSend}
                disabled={!canSend}
                accessibilityRole="button"
                accessibilityLabel="Send message"
              >
                {isSending
                  ? <ActivityIndicator size="small" color={colours.white} />
                  : <Ionicons name="send" size={16} color={colours.white} />
                }
              </Pressable>
            </View>
          </>
        )}
      </KeyboardAvoidingView>

      {/* ── Long-press reply menu ───────────────────────────────────────────── */}
      <Modal visible={pressedMessage !== null} transparent animationType="fade" onRequestClose={handleCloseMenu}>
        <Pressable style={styles.menuOverlay} onPress={handleCloseMenu} accessibilityRole="button" accessibilityLabel="Close menu">
          <Pressable style={styles.menuCard} onPress={() => {}} accessibilityRole="none">
            <View style={styles.menuPreviewWrap}>
              {pressedMessage?.image_url !== null && pressedMessage?.image_url !== undefined && (
                <Ionicons name="image-outline" size={14} color={colours.textSubtle} style={{ marginBottom: 2 }} />
              )}
              <Text style={styles.menuPreviewText} numberOfLines={3}>
                {pressedMessage?.body ?? '📷 Photo'}
              </Text>
            </View>
            <View style={styles.menuDivider} />
            <Pressable
              style={styles.menuOption}
              onPress={handleMenuReply}
              accessibilityRole="button"
              accessibilityLabel="Reply to message"
            >
              <Ionicons name="return-up-back-outline" size={18} color={colours.primary} />
              <Text style={styles.menuOptionText}>Reply</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={selectedPhoto !== null} transparent animationType="fade" onRequestClose={handlePhotoClose}>
        <Pressable style={styles.photoOverlay} onPress={handlePhotoClose} accessibilityRole="button" accessibilityLabel="Close photo">
          {selectedPhoto !== null && (
            <Image source={{ uri: selectedPhoto }} style={styles.photoFull} resizeMode="contain" />
          )}
          <Pressable style={styles.photoCloseBtn} onPress={handlePhotoClose} accessibilityRole="button" accessibilityLabel="Close">
            <Ionicons name="close" size={22} color={colours.white} />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// ── Mobile route wrapper ──────────────────────────────────────────────────────

export function OrderChatScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<MerchantStackParamList>>();
  const route = useRoute<Route>();
  const { orderId, orderNumber, completedAt, orderStatus } = route.params;
  return (
    <OrderChatContent
      orderId={orderId}
      orderNumber={orderNumber}
      completedAt={completedAt}
      orderStatus={orderStatus}
      onBack={() => navigation.goBack()}
    />
  );
}
