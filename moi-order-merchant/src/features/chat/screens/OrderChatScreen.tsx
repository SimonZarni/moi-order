import React from 'react';
import {
  ActivityIndicator, FlatList, Image, Keyboard, KeyboardAvoidingView,
  Modal, Platform, Pressable, Text, TextInput, View,
} from 'react-native';

const KEYBOARD_BEHAVIOR = Platform.OS === 'ios' ? 'padding' : 'height';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colours } from '../../../shared/theme/colours';
import type { OrderChatMessage } from '../../../types/models';
import type { MerchantStackParamList } from '../../../types/navigation';
import { useOrderChatScreen } from '../hooks/useOrderChatScreen';
import { styles } from './OrderChatScreen.styles';

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

// ── Shared content (used by both mobile route and web prop variant) ───────────

interface ContentProps {
  orderId: number;
  onBack: () => void;
}

export function OrderChatContent({ orderId, onBack }: ContentProps): React.JSX.Element {
  const {
    messages, isLoading, isError, sendError, text, isSending, inputBarPadding,
    selectedPhoto, listRef,
    handleTextChange, handleSend, handleAttachPress, handlePhotoPress, handlePhotoClose,
  } = useOrderChatScreen(orderId);

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
          <Text style={styles.topBarTitle}>Chat with Customer</Text>
          <Text style={styles.topBarSub}>Order #{orderId}</Text>
        </View>
      </View>

      <KeyboardAvoidingView behavior={KEYBOARD_BEHAVIOR} style={styles.body}>
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
            <Ionicons name="chatbubbles-outline" size={44} color={colours.textSubtle} />
            <Text style={styles.emptyText}>No messages yet.</Text>
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

        <View style={[styles.inputBar, { paddingBottom: inputBarPadding }]}>
          <Pressable
            style={styles.attachBtn}
            onPress={handleAttachPress}
            accessibilityRole="button"
            accessibilityLabel="Add photo"
          >
            <Ionicons name="image-outline" size={22} color={colours.primary} />
          </Pressable>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message…"
            placeholderTextColor="rgba(255,255,255,0.3)"
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
            {isSending
              ? <ActivityIndicator size="small" color={colours.white} />
              : <Ionicons name="send" size={16} color={colours.white} />
            }
          </Pressable>
        </View>
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
  const { orderId } = route.params;
  return <OrderChatContent orderId={orderId} onBack={() => navigation.goBack()} />;
}
