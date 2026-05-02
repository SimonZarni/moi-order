import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colours } from '@/shared/theme/colours';
import { OrderChatMessage } from '@/types/models';
import { useOrderChatScreen } from '../hooks/useOrderChatScreen';
import { styles } from './OrderChatScreen.styles';

interface BubbleProps { msg: OrderChatMessage }

function MessageBubble({ msg }: BubbleProps): React.JSX.Element {
  const isCustomer = msg.sender_type === 'customer';
  const time = new Date(msg.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return (
    <View style={[styles.bubbleRow, isCustomer ? styles.bubbleRowRight : styles.bubbleRowLeft]}>
      <View style={[styles.bubble, isCustomer ? styles.bubbleCustomer : styles.bubbleOther]}>
        {!isCustomer && <Text style={styles.senderName}>{msg.sender_name}</Text>}
        {msg.image_url !== null && (
          <Image source={{ uri: msg.image_url }} style={styles.bubbleImage} resizeMode="cover" />
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

export function OrderChatScreen(): React.JSX.Element {
  const {
    orderNumber, messages, isLoading, isError,
    text, isSending, listRef,
    handleBack, handleTextChange, handleSend, handlePickImage,
  } = useOrderChatScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={22} color={colours.textOnDark} />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Chat with Restaurant</Text>
          {orderNumber !== null && (
            <Text style={styles.headerSub}>Order #{orderNumber}</Text>
          )}
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.noticeBanner}>
          <Ionicons name="information-circle-outline" size={14} color={colours.textMuted} />
          <Text style={styles.noticeText}>
            Messages are automatically deleted 3 hours after the order is completed.
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator color={colours.primary} />
          </View>
        ) : isError ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>Could not load messages.</Text>
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="chatbubbles-outline" size={44} color={colours.textMuted} />
            <Text style={[styles.emptyText, { marginTop: 8 }]}>No messages yet. Say hello!</Text>
          </View>
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
          />
        )}

        <View style={styles.inputBar}>
          <Pressable
            style={styles.attachBtn}
            onPress={handlePickImage}
            accessibilityRole="button"
            accessibilityLabel="Attach image"
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
            style={[styles.sendBtn, (!text.trim() || isSending) && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!text.trim() || isSending}
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
      </View>
    </SafeAreaView>
  );
}
