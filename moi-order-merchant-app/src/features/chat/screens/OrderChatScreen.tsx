import React from 'react';
import {
  ActivityIndicator, FlatList, Image, Keyboard, KeyboardAvoidingView,
  Platform, Pressable, Text, TextInput, View,
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

interface BubbleProps { msg: OrderChatMessage }

function MessageBubble({ msg }: BubbleProps): React.JSX.Element {
  const isMerchant = msg.sender_type === 'merchant';
  const time = new Date(msg.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return (
    <View style={[styles.bubbleRow, isMerchant ? styles.bubbleRowRight : styles.bubbleRowLeft]}>
      <View style={[styles.bubble, isMerchant ? styles.bubbleMerchant : styles.bubbleOther]}>
        {!isMerchant && <Text style={styles.senderName}>{msg.sender_name}</Text>}
        {msg.image_url !== null && (
          <Image source={{ uri: msg.image_url }} style={styles.bubbleImage} resizeMode="cover" />
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
    messages, isLoading, isError, sendError, text, isSending, inputBarPadding, listRef,
    handleTextChange, handleSend, handlePickImage,
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
          <Ionicons name="arrow-back" size={20} color={colours.textOnDark} />
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
            <Ionicons name="chatbubbles-outline" size={44} color={colours.medium} />
            <Text style={styles.emptyText}>No messages yet.</Text>
          </Pressable>
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
            {isSending
              ? <ActivityIndicator size="small" color={colours.white} />
              : <Ionicons name="send" size={16} color={colours.white} />
            }
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
