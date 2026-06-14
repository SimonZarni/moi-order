import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colours } from '@/shared/theme/colours';
import { FOOD_ORDER_STATUS } from '@/types/enums';
import { FoodOrder, OrderChatMessage } from '@/types/models';
import { useOrderChatData, useSendChatMessage } from '../hooks/useOrderChatData';
import { styles } from './OrderChatSection.styles';
import { LinkedText } from '@/shared/components/LinkedText';

interface Props {
  order: FoodOrder;
}

interface MessageBubbleProps { msg: OrderChatMessage }

type SelectedImage = { uri: string; name: string; type: string };

function computeIsChatLocked(order: FoodOrder): boolean {
  if (order.status === FOOD_ORDER_STATUS.Cancelled || order.status === FOOD_ORDER_STATUS.Expired) {
    return true;
  }
  if (order.status === FOOD_ORDER_STATUS.Completed && order.completed_at !== null) {
    return Date.now() > new Date(order.completed_at).getTime() + 3 * 60 * 60 * 1_000;
  }
  return false;
}

function MessageBubble({ msg }: MessageBubbleProps): React.JSX.Element {
  if (msg.sender_type === 'system') {
    return (
      <View style={styles.systemNotice}>
        <Text style={styles.systemNoticeText}>{msg.body}</Text>
      </View>
    );
  }

  const isCustomer = msg.sender_type === 'customer';
  return (
    <View style={[styles.bubbleRow, isCustomer ? styles.bubbleRowRight : styles.bubbleRowLeft]}>
      <View style={[styles.bubble, isCustomer ? styles.bubbleCustomer : styles.bubbleAdmin]}>
        {!isCustomer && <Text style={styles.senderName}>{msg.sender_name}</Text>}
        {msg.image_url !== null && (
          <Image source={{ uri: msg.image_url }} style={styles.bubbleImage} resizeMode="cover" />
        )}
        {msg.body !== null && (
          <LinkedText
            text={msg.body}
            style={[styles.bubbleText, isCustomer ? styles.bubbleTextCustomer : styles.bubbleTextAdmin]}
            linkStyle={isCustomer ? styles.bubbleLinkCustomer : styles.bubbleLinkAdmin}
          />
        )}
        <View style={styles.bubbleFooter}>
          <Text style={[styles.bubbleTime, isCustomer ? styles.bubbleTimeCustomer : styles.bubbleTimeAdmin]}>
            {new Date(msg.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </Text>
          {isCustomer && (
            <Ionicons
              name={msg.read_at != null ? 'checkmark-done' : 'checkmark'}
              size={13}
              color={msg.read_at != null ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)'}
            />
          )}
        </View>
      </View>
    </View>
  );
}

export function OrderChatSection({ order }: Props): React.JSX.Element {
  const { messages, isLoading }    = useOrderChatData(order.id);
  const { mutateAsync }            = useSendChatMessage();
  const [text, setText]            = useState('');
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [isSending, setIsSending]  = useState(false);
  const listRef = useRef<FlatList>(null);

  const isChatLocked = computeIsChatLocked(order);
  const canSend = !isSending && (text.trim().length > 0 || selectedImages.length > 0);

  const handleRemoveImage = useCallback(
    (index: number) => setSelectedImages((prev) => prev.filter((_, i) => i !== index)),
    [],
  );

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if ((!trimmed && selectedImages.length === 0) || isSending) return;

    setIsSending(true);
    const sends: Array<() => Promise<unknown>> = [];
    if (trimmed) {
      sends.push(() => mutateAsync({ orderId: order.id, body: trimmed, image: null }));
    }
    for (const img of selectedImages) {
      const captured = img;
      sends.push(() => mutateAsync({ orderId: order.id, body: null, image: captured }));
    }

    (async () => {
      try {
        for (const fn of sends) {
          await fn();
        }
        setText('');
        setSelectedImages([]);
      } finally {
        setIsSending(false);
      }
    })();
  }, [text, selectedImages, isSending, mutateAsync, order.id]);

  const pickFromLibrary = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo library access to attach images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.8,
      allowsMultipleSelection: true,
    });
    if (result.canceled || result.assets.length === 0) return;
    const newImages = result.assets.map((asset) => {
      const mime = (asset.mimeType ?? '').toLowerCase() || 'image/jpeg';
      const ext  = mime.split('/')[1] ?? 'jpg';
      return { uri: asset.uri, name: `chat.${ext}`, type: mime };
    });
    setSelectedImages((prev) => [...prev, ...newImages]);
  }, []);

  const takePhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera permission needed', 'Please allow camera access to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      quality: 0.8,
    });
    if (result.canceled || result.assets.length === 0) return;
    const asset = result.assets[0];
    if (!asset) return;
    const mime = (asset.mimeType ?? '').toLowerCase() || 'image/jpeg';
    const ext  = mime.split('/')[1] ?? 'jpg';
    setSelectedImages((prev) => [...prev, { uri: asset.uri, name: `chat.${ext}`, type: mime }]);
  }, []);

  const handleAttachPress = useCallback(() => {
    Alert.alert('Add Photo', undefined, [
      { text: 'Take Photo',          onPress: () => { void takePhoto(); } },
      { text: 'Choose from Library', onPress: () => { void pickFromLibrary(); } },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [takePhoto, pickFromLibrary]);

  const isCompletedButNotLocked =
    order.status === FOOD_ORDER_STATUS.Completed && !isChatLocked;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chat with Restaurant</Text>

      {(isCompletedButNotLocked || isChatLocked) && (
        <View style={styles.noticeBanner}>
          <Ionicons name="information-circle-outline" size={14} color={colours.textMuted} />
          <Text style={styles.noticeText}>
            {isChatLocked
              ? 'Chat has closed. Messages are deleted 3 hours after order completion.'
              : 'Chat messages are automatically deleted 3 hours after the order is completed.'}
          </Text>
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator color={colours.primary} style={styles.loader} />
      ) : messages.length === 0 ? (
        <Text style={styles.emptyText}>No messages yet. Say hello!</Text>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => String(m.id)}
          renderItem={({ item }) => <MessageBubble msg={item} />}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          accessibilityRole="list"
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      )}

      {!isChatLocked && (
        <>
          {selectedImages.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {selectedImages.map((img, i) => (
                <View key={`${img.uri}-${i}`} style={styles.imagePreviewItem}>
                  <Image source={{ uri: img.uri }} style={styles.imagePreviewThumb} resizeMode="cover" />
                  <Pressable
                    style={styles.imagePreviewRemove}
                    onPress={() => handleRemoveImage(i)}
                    accessibilityRole="button"
                    accessibilityLabel="Remove image"
                  >
                    <Ionicons name="close" size={10} color={colours.white} />
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          )}

          <View style={styles.inputRow}>
            <Pressable
              style={styles.attachBtn}
              onPress={handleAttachPress}
              accessibilityRole="button"
              accessibilityLabel="Add photo"
            >
              <Ionicons name="image-outline" size={20} color={colours.primary} />
            </Pressable>
            <TextInput
              style={styles.input}
              placeholder="Type a message…"
              placeholderTextColor={colours.textMuted}
              value={text}
              onChangeText={setText}
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
    </View>
  );
}
