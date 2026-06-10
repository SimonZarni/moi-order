import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Pressable, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { FOOD_ORDER_STATUS } from '@/types/enums';
import { FoodOrder, OrderChatMessage } from '@/types/models';
import { useOrderChatData, useSendChatMessage } from '../hooks/useOrderChatData';
import { styles } from './OrderChatSection.styles';

interface Props {
  order: FoodOrder;
}

interface MessageBubbleProps { msg: OrderChatMessage }

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
          <Text style={[styles.bubbleText, isCustomer ? styles.bubbleTextCustomer : styles.bubbleTextAdmin]}>
            {msg.body}
          </Text>
        )}
        <Text style={[styles.bubbleTime, isCustomer ? styles.bubbleTimeCustomer : styles.bubbleTimeAdmin]}>
          {new Date(msg.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
}

export function OrderChatSection({ order }: Props): React.JSX.Element {
  const { messages, isLoading } = useOrderChatData(order.id);
  const sendMutation = useSendChatMessage();
  const [text, setText] = useState('');
  const listRef = useRef<FlatList>(null);

  const isCompleted = order.status === FOOD_ORDER_STATUS.Completed;

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || sendMutation.isPending) return;
    sendMutation.mutate({ orderId: order.id, body: trimmed, image: null });
    setText('');
  }, [text, sendMutation, order.id]);

  const sendImageAsset = useCallback((asset: ImagePicker.ImagePickerAsset) => {
    const ext = asset.uri.split('.').pop() ?? 'jpg';
    sendMutation.mutate({
      orderId: order.id,
      body:    null,
      image:   { uri: asset.uri, name: `chat.${ext}`, type: `image/${ext}` },
    });
  }, [sendMutation, order.id]);

  const handlePickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (result.canceled || result.assets.length === 0) return;
    const asset = result.assets[0];
    if (!asset) return;
    sendImageAsset(asset);
  }, [sendImageAsset]);

  const handleTakePhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera permission needed', 'Please allow camera access to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (result.canceled || result.assets.length === 0) return;
    const asset = result.assets[0];
    if (!asset) return;
    sendImageAsset(asset);
  }, [sendImageAsset]);

  const handleAttachPress = useCallback(() => {
    Alert.alert('Add Photo', undefined, [
      { text: 'Take Photo', onPress: () => { void handleTakePhoto(); } },
      { text: 'Choose from Library', onPress: () => { void handlePickImage(); } },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [handleTakePhoto, handlePickImage]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chat with Restaurant</Text>

      {isCompleted && (
        <View style={styles.noticeBanner}>
          <Ionicons name="information-circle-outline" size={14} color={colours.textMuted} />
          <Text style={styles.noticeText}>
            Chat messages are automatically deleted 3 hours after the order is completed.
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

      {!isCompleted && (
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
            style={[styles.sendBtn, (!text.trim() || sendMutation.isPending) && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!text.trim() || sendMutation.isPending}
            accessibilityRole="button"
            accessibilityLabel="Send message"
          >
            {sendMutation.isPending ? (
              <ActivityIndicator size="small" color={colours.white} />
            ) : (
              <Ionicons name="send" size={16} color={colours.white} />
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}
