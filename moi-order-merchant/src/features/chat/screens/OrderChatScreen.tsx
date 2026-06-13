import React from 'react';
import {
  ActivityIndicator, FlatList, Image, Keyboard, KeyboardAvoidingView,
  Modal, Platform, Pressable, ScrollView, Text, TextInput, View,
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

type Route = RouteProp<MerchantStackParamList, 'OrderChat'>;

interface BubbleProps {
  msg: OrderChatMessage;
  onPhotoPress: (uri: string) => void;
}

function MessageBubble({ msg, onPhotoPress }: BubbleProps): React.JSX.Element {
  if (msg.sender_type === 'system') {
    return (
      <View style={styles.systemNotice}>
        <Text style={styles.systemNoticeText}>{msg.body}</Text>
      </View>
    );
  }

  const isMerchant = msg.sender_type === 'merchant';
  const time = new Date(msg.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return (
    <View style={[styles.bubbleRow, isMerchant ? styles.bubbleRowRight : styles.bubbleRowLeft]}>
      <View style={[styles.bubble, isMerchant ? styles.bubbleMerchant : styles.bubbleOther]}>
        {!isMerchant && <Text style={styles.senderName}>{msg.sender_name}</Text>}
        {msg.image_url !== null && (
          <Pressable onPress={() => onPhotoPress(msg.image_url!)} accessibilityRole="button" accessibilityLabel="View full photo">
            <Image source={{ uri: msg.image_url }} style={styles.bubbleImage} resizeMode="cover" />
          </Pressable>
        )}
        {msg.body !== null && (
          <Text style={[styles.bubbleText, isMerchant ? styles.bubbleTextMerchant : styles.bubbleTextOther]}>
            {msg.body}
          </Text>
        )}
        <Text style={[styles.bubbleTime, isMerchant ? styles.bubbleTimeMerchant : styles.bubbleTimeOther]}>
          {time}
        </Text>
      </View>
    </View>
  );
}

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

// ── Shared content (used by both mobile route and web prop variant) ───────────

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
    selectedImages, selectedPhoto, listRef, isChatLocked, isCompletedButNotLocked,
    handleTextChange, handleSend, handleAttachPress, handleRemoveImage,
    handlePhotoPress, handlePhotoClose,
  } = useOrderChatScreen(orderId, orderStatus, completedAt);

  const canSend = !isSending && !isChatLocked && (text.trim().length > 0 || selectedImages.length > 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable
          style={styles.backButton}
          onPress={onBack}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={20} color={colours.textOnLight} />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.topBarTitle}>{t('chat_title')}</Text>
          <Text style={styles.topBarSub}>{orderNumber ?? `Order #${orderId}`}</Text>
        </View>
      </View>

      <KeyboardAvoidingView behavior="padding" enabled={Platform.OS === 'ios'} style={styles.body}>
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
              {isNetworkError
                ? t('chat_check_internet')
                : t('chat_cannot_load')}
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
            data={[...messages].reverse()}
            inverted
            keyExtractor={(m) => String(m.id)}
            renderItem={({ item }) => <MessageBubble msg={item} onPhotoPress={handlePhotoPress} />}
            style={styles.list}
            contentContainerStyle={styles.listContent}
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
            <View style={[styles.inputBar, { paddingBottom: inputBarPadding }]}>
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
                placeholderTextColor="rgba(255,255,255,0.3)"
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
