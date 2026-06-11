import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const KEYBOARD_BEHAVIOR = Platform.OS === 'ios' ? 'padding' : 'height';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { OrderChatMessage } from '@/types/models';
import { useOrderChatScreen, SelectedImage } from '../hooks/useOrderChatScreen';
import { styles } from './OrderChatScreen.styles';

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
  const isCustomer = msg.sender_type === 'customer';
  const time = new Date(msg.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return (
    <View style={[styles.bubbleRow, isCustomer ? styles.bubbleRowRight : styles.bubbleRowLeft]}>
      <View style={[styles.bubble, isCustomer ? styles.bubbleCustomer : styles.bubbleOther]}>
        {!isCustomer && <Text style={styles.senderName}>{msg.sender_name}</Text>}
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
        <Text style={[styles.bubbleTime, isCustomer ? styles.bubbleTimeCustomer : styles.bubbleTimeOther]}>
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

export function OrderChatScreen(): React.JSX.Element {
  const {
    restaurantName, orderNumber, messages, isLoading, isError,
    sendError, text, isSending, isChatLocked, inputBarPadding,
    selectedImages, selectedPhoto, listRef,
    handleBack, handleTextChange, handleSend, handlePickImage,
    handleRemoveImage, handlePhotoPress, handlePhotoClose,
  } = useOrderChatScreen();

  const canSend = !isSending && (text.trim().length > 0 || selectedImages.length > 0);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={22} color={colours.textOnDark} />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>{restaurantName ?? 'Chat with Restaurant'}</Text>
          {orderNumber !== null && <Text style={styles.headerSub}>Order #{orderNumber}</Text>}
        </View>
      </View>

      <KeyboardAvoidingView behavior={KEYBOARD_BEHAVIOR} style={styles.body}>
        <View style={styles.noticeBanner}>
          <Ionicons name="information-circle-outline" size={14} color={colours.textMuted} />
          <Text style={styles.noticeText}>
            Messages are automatically deleted 3 hours after the order is completed.
          </Text>
        </View>

        {isLoading ? (
          <Pressable style={styles.loaderWrap} onPress={Keyboard.dismiss}>
            <ActivityIndicator color={colours.primary} />
          </Pressable>
        ) : isError ? (
          <Pressable style={styles.emptyWrap} onPress={Keyboard.dismiss}>
            <Text style={styles.emptyText}>Could not load messages.</Text>
          </Pressable>
        ) : messages.length === 0 ? (
          <Pressable style={styles.emptyWrap} onPress={Keyboard.dismiss}>
            <Ionicons name="chatbubbles-outline" size={44} color={colours.textMuted} />
            <Text style={[styles.emptyText, { marginTop: 8 }]}>No messages yet. Say hello!</Text>
          </Pressable>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => String(m.id)}
            renderItem={({ item }) => <MessageBubble msg={item} onPhotoPress={handlePhotoPress} />}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
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
            <View style={[styles.inputBar, { paddingBottom: inputBarPadding }]}>
              <Pressable
                style={styles.attachBtn}
                onPress={handlePickImage}
                accessibilityRole="button"
                accessibilityLabel="Attach images"
              >
                <Ionicons name="image-outline" size={22} color={colours.primary} />
              </Pressable>
              <TextInput
                style={styles.textInput}
                placeholder="Type a message…"
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
                {isSending ? (
                  <ActivityIndicator size="small" color={colours.white} />
                ) : (
                  <Ionicons name="send" size={16} color={colours.white} />
                )}
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
