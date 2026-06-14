import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { OrderChatMessage } from '@/types/models';
import { useStrings } from '@/shared/i18n';
import { useOrderChatScreen, SelectedImage } from '../hooks/useOrderChatScreen';
import { styles } from './OrderChatScreen.styles';

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
      <Pressable onPress={onDismiss} hitSlop={8} accessibilityRole="button" accessibilityLabel="Dismiss notice">
        <Ionicons name="close" size={14} color={colours.textMuted} />
      </Pressable>
    </View>
  );
}

// ── Reply bar ─────────────────────────────────────────────────────────────────

interface ReplyBarProps {
  replyingTo: OrderChatMessage;
  photoLabel: string;
  replyToLabel: string;
  cancelLabel: string;
  onCancel: () => void;
}

function ReplyBar({ replyingTo, photoLabel, replyToLabel, cancelLabel, onCancel }: ReplyBarProps): React.JSX.Element {
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
      <Pressable onPress={onCancel} hitSlop={8} accessibilityRole="button" accessibilityLabel={cancelLabel}>
        <Ionicons name="close" size={18} color={colours.textMuted} />
      </Pressable>
    </View>
  );
}

// ── Animated message bubble ───────────────────────────────────────────────────

interface BubbleProps {
  msg: OrderChatMessage;
  isNew: boolean;
  onPhotoPress: (uri: string) => void;
  onReply: (msg: OrderChatMessage) => void;
}

function AnimatedBubble({ msg, isNew, onPhotoPress, onReply }: BubbleProps): React.JSX.Element {
  if (msg.sender_type === 'system') {
    return (
      <View style={styles.systemNotice}>
        <Text style={styles.systemNoticeText}>{msg.body}</Text>
      </View>
    );
  }

  const isCustomer = msg.sender_type === 'customer';
  const time = new Date(msg.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  // ── Entrance animation (native driver) ──────────────────────────────────────
  const entranceOpacity = useRef(new Animated.Value(isNew ? 0 : 1)).current;
  const entranceSlide   = useRef(new Animated.Value(isNew ? (isCustomer ? 20 : -20) : 0)).current;

  useEffect(() => {
    if (!isNew) return;
    Animated.parallel([
      Animated.timing(entranceOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.spring(entranceSlide, { toValue: 0, damping: 18, mass: 0.5, stiffness: 220, useNativeDriver: true }),
    ]).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Bidirectional swipe-to-reply (JS driver) ─────────────────────────────────
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
      onPanResponderGrant: () => { hasTriggeredRef.current = false; },
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

  const leftHintOpacity = swipeX.interpolate({
    inputRange: [0, THRESHOLD * 0.4, THRESHOLD],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });
  const rightHintOpacity = swipeX.interpolate({
    inputRange: [-THRESHOLD, -THRESHOLD * 0.4, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const hasReply = msg.reply_to_body != null && msg.reply_to_sender_name != null;

  return (
    <Animated.View style={{ opacity: entranceOpacity, transform: [{ translateX: entranceSlide }] }}>
      <View style={{ position: 'relative' }}>
        <Animated.View style={[styles.replyHintLeft,  { opacity: leftHintOpacity }]}>
          <Ionicons name="return-up-back-outline"    size={18} color={colours.primary} />
        </Animated.View>
        <Animated.View style={[styles.replyHintRight, { opacity: rightHintOpacity }]}>
          <Ionicons name="return-up-forward-outline" size={18} color={colours.primary} />
        </Animated.View>

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.bubbleRow,
            isCustomer ? styles.bubbleRowRight : styles.bubbleRowLeft,
            { transform: [{ translateX: swipeX }] },
          ]}
        >
          <View style={[styles.bubble, isCustomer ? styles.bubbleCustomer : styles.bubbleOther]}>
            {!isCustomer && <Text style={styles.senderName}>{msg.sender_name}</Text>}

            {hasReply && (
              <View style={styles.replyQuote}>
                <Text style={styles.replyQuoteSender}>{msg.reply_to_sender_name}</Text>
                <Text style={styles.replyQuoteText} numberOfLines={1}>{msg.reply_to_body}</Text>
              </View>
            )}

            {msg.image_url !== null && (
              <Pressable onPress={() => onPhotoPress(msg.image_url!)} accessibilityRole="button" accessibilityLabel="View full photo">
                <Image source={{ uri: msg.image_url }} style={styles.bubbleImage} resizeMode="cover" />
              </Pressable>
            )}
            {msg.body !== null && (
              <Text style={[styles.bubbleText, isCustomer ? styles.bubbleTextCustomer : styles.bubbleTextOther]}>
                {msg.body}
              </Text>
            )}

            {/* Time + status tick (tick only on customer's own sent messages) */}
            <View style={styles.bubbleFooter}>
              <Text style={[styles.bubbleTime, isCustomer ? styles.bubbleTimeCustomer : styles.bubbleTimeOther]}>
                {time}
              </Text>
              {isCustomer && (
                <Ionicons
                  name={msg.read_at != null ? 'checkmark-done' : 'checkmark'}
                  size={13}
                  color={msg.read_at != null ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)'}
                />
              )}
            </View>
          </View>
        </Animated.View>
      </View>
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
      <Pressable style={styles.imagePreviewRemove} onPress={() => onRemove(index)} accessibilityRole="button" accessibilityLabel="Remove image">
        <Ionicons name="close" size={12} color={colours.white} />
      </Pressable>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export function OrderChatScreen(): React.JSX.Element {
  const s = useStrings();
  const {
    restaurantName, orderNumber, messages, isLoading, isError,
    sendError, text, isSending, isChatLocked, inputBarPadding,
    selectedImages, selectedPhoto, listRef, replyingTo,
    handleBack, handleTextChange, handleSend, handleSetReply,
    handlePickImage, handleRemoveImage, handlePhotoPress, handlePhotoClose,
  } = useOrderChatScreen();

  const [showNoticeBanner, setShowNoticeBanner] = useState(true);

  const initialIdsRef    = useRef<Set<number>>(new Set());
  const hasSeededInitial = useRef(false);
  if (!hasSeededInitial.current && messages.length > 0) {
    messages.forEach((m) => initialIdsRef.current.add(m.id));
    hasSeededInitial.current = true;
  }

  const canSend = !isSending && (text.trim().length > 0 || selectedImages.length > 0);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={22} color={colours.textOnDark} />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>{restaurantName ?? s.restaurant.chatWithRestaurant}</Text>
          {orderNumber !== null && <Text style={styles.headerSub}>Order #{orderNumber}</Text>}
        </View>
      </View>

      <KeyboardAvoidingView behavior="padding" enabled={Platform.OS === 'ios'} style={styles.body}>
        {showNoticeBanner && (
          <NoticeBanner text={s.chat.notice} onDismiss={() => setShowNoticeBanner(false)} />
        )}

        {isLoading ? (
          <Pressable style={styles.loaderWrap} onPress={Keyboard.dismiss}>
            <ActivityIndicator color={colours.primary} />
          </Pressable>
        ) : isError ? (
          <Pressable style={styles.emptyWrap} onPress={Keyboard.dismiss}>
            <Text style={styles.emptyText}>{s.chat.cannotLoad}</Text>
          </Pressable>
        ) : messages.length === 0 ? (
          <Pressable style={styles.emptyWrap} onPress={Keyboard.dismiss}>
            <Ionicons name="chatbubbles-outline" size={44} color={colours.textMuted} />
            <Text style={[styles.emptyText, { marginTop: 8 }]}>{s.chat.noMessages}</Text>
          </Pressable>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => String(m.id)}
            renderItem={({ item }) => (
              <AnimatedBubble
                msg={item}
                isNew={!initialIdsRef.current.has(item.id)}
                onPhotoPress={handlePhotoPress}
                onReply={handleSetReply}
              />
            )}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
            onLayout={() => messages.length > 0 && listRef.current?.scrollToEnd({ animated: false })}
            accessibilityRole="list"
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
          />
        )}

        {sendError !== null && (
          <View style={styles.sendErrorBanner}>
            <Text style={styles.sendErrorText}>{sendError}</Text>
          </View>
        )}

        {!isChatLocked && (
          <>
            {selectedImages.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreviewStrip} contentContainerStyle={{ gap: 8 }}>
                {selectedImages.map((img, i) => (
                  <ImagePreviewItem key={`${img.uri}-${i}`} img={img} index={i} onRemove={handleRemoveImage} />
                ))}
              </ScrollView>
            )}

            {replyingTo !== null && (
              <ReplyBar
                replyingTo={replyingTo}
                photoLabel={s.chat.photo}
                replyToLabel={s.chat.replyTo}
                cancelLabel={s.chat.cancelReply}
                onCancel={() => handleSetReply(null)}
              />
            )}

            <View style={[styles.inputBar, { paddingBottom: inputBarPadding }]}>
              <Pressable style={styles.attachBtn} onPress={handlePickImage} accessibilityRole="button" accessibilityLabel={s.chat.addPhoto}>
                <Ionicons name="image-outline" size={22} color={colours.primary} />
              </Pressable>
              <TextInput
                style={styles.textInput}
                placeholder={s.chat.typePlaceholder}
                placeholderTextColor={colours.textMuted}
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
                {isSending ? <ActivityIndicator size="small" color={colours.white} /> : <Ionicons name="send" size={16} color={colours.white} />}
              </Pressable>
            </View>
          </>
        )}
      </KeyboardAvoidingView>

      <Modal visible={selectedPhoto !== null} transparent animationType="fade" onRequestClose={handlePhotoClose}>
        <Pressable style={styles.photoOverlay} onPress={handlePhotoClose} accessibilityRole="button" accessibilityLabel="Close photo">
          {selectedPhoto !== null && <Image source={{ uri: selectedPhoto }} style={styles.photoFull} resizeMode="contain" />}
          <Pressable style={styles.photoCloseBtn} onPress={handlePhotoClose} accessibilityRole="button" accessibilityLabel="Close">
            <Ionicons name="close" size={22} color={colours.white} />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
