import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { fetchOrderChat, sendOrderChatMessage } from '../../../api/chat';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { PUSHER_APP_KEY, PUSHER_APP_CLUSTER, BROADCAST_AUTH_URL } from '../../../shared/constants/config';
import { useAuthStore } from '../../../store/authStore';
import type { OrderChatMessage } from '../../../types/models';

interface PusherChannel {
  bind(event: string, callback: (data: unknown) => void): void;
  unbind_all(): void;
}
interface PusherInstance {
  subscribe(channel: string): PusherChannel;
  unsubscribe(channel: string): void;
  disconnect(): void;
}
type PusherConstructorFn = new (key: string, options: object) => PusherInstance;

interface UseOrderChatScreenResult {
  messages: OrderChatMessage[];
  isLoading: boolean;
  isError: boolean;
  sendError: string | null;
  text: string;
  isSending: boolean;
  inputBarPadding: number;
  selectedPhoto: string | null;
  listRef: React.RefObject<FlatList | null>;
  handleTextChange: (v: string) => void;
  handleSend: () => void;
  handleAttachPress: () => void;
  handlePhotoPress: (uri: string) => void;
  handlePhotoClose: () => void;
}

export function useOrderChatScreen(orderId: number): UseOrderChatScreenResult {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const { bottom: bottomInset } = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [sendError, setSendError] = useState<string | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const listRef = useRef<FlatList>(null);

  // Real-time chat updates via Pusher private-order.{orderId} channel.
  // Reduces perceived latency vs 10-second polling for incoming messages.
  useEffect(() => {
    if (!token || !PUSHER_APP_KEY) return;
    let pusher: PusherInstance | null = null;
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
      const mod = require('pusher-js') as any;
      const PusherClass: PusherConstructorFn = mod.Pusher ?? mod.default ?? mod;
      pusher = new PusherClass(PUSHER_APP_KEY, {
        cluster: PUSHER_APP_CLUSTER,
        forceTLS: true,
        channelAuthorization: {
          customHandler: async (
            { channelName, socketId }: { channelName: string; socketId: string },
            callback: (err: Error | null, data: { auth: string } | null) => void,
          ) => {
            try {
              // eslint-disable-next-line @typescript-eslint/no-require-imports
              const { apiClient } = require('../../../shared/api/client') as {
                apiClient: { post: <T>(url: string, data: unknown) => Promise<{ data: T }> };
              };
              const res = await apiClient.post<{ auth: string }>(
                BROADCAST_AUTH_URL.replace(_getApiBase(), ''),
                { socket_id: socketId, channel_name: channelName },
              );
              callback(null, res.data);
            } catch {
              callback(new Error('Channel auth failed'), null);
            }
          },
        },
      });
      const channel = pusher.subscribe(`private-order.${orderId}`);
      channel.bind('chat.message-sent', (data: unknown) => {
        const msg = data as OrderChatMessage;
        queryClient.setQueryData<OrderChatMessage[]>(
          QUERY_KEYS.ORDER_CHAT(orderId),
          (prev) => {
            const existing = prev ?? [];
            // Dedup: mutation onSuccess already adds merchant's own sent messages.
            if (existing.some((m) => m.id === msg.id)) return existing;
            return [...existing, msg];
          },
        );
      });
    } catch { /* pusher-js not installed or network error — polling continues */ }
    return () => {
      try {
        pusher?.unsubscribe(`private-order.${orderId}`);
        pusher?.disconnect();
      } catch { /* silent */ }
    };
  }, [token, orderId, queryClient]);

  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.ORDER_CHAT(orderId),
    queryFn: () => fetchOrderChat(orderId),
    refetchInterval: 10_000,
  });

  const messages = data ?? [];

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // Collapse safe-area gap when keyboard is visible (keyboard fills that space)
  const inputBarPadding = keyboardVisible ? 8 : Math.max(bottomInset, 8) + 8;

  const { mutate, isPending: isSending } = useMutation({
    mutationFn: ({ body, image }: { body: string | null; image: { uri: string; name: string; type: string } | null }) =>
      sendOrderChatMessage(orderId, body, image),
    onSuccess: (newMsg) => {
      queryClient.setQueryData<OrderChatMessage[]>(
        QUERY_KEYS.ORDER_CHAT(orderId),
        (prev) => [...(prev ?? []), newMsg],
      );
    },
  });

  const handleTextChange = useCallback((v: string) => setText(v), []);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;
    setSendError(null);
    mutate(
      { body: trimmed, image: null },
      { onError: () => setSendError('Failed to send. Please try again.') },
    );
    setText('');
  }, [text, isSending, mutate]);

  const sendImageAsset = useCallback((asset: ImagePicker.ImagePickerAsset) => {
    const ext = asset.uri.split('.').pop() ?? 'jpg';
    setSendError(null);
    mutate(
      { body: null, image: { uri: asset.uri, name: `chat.${ext}`, type: `image/${ext}` } },
      { onError: () => setSendError('Failed to send image. Please try again.') },
    );
  }, [mutate]);

  const handlePickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
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
      mediaTypes: 'images',
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

  const handlePhotoPress = useCallback((uri: string) => setSelectedPhoto(uri), []);
  const handlePhotoClose = useCallback(() => setSelectedPhoto(null), []);

  return {
    messages, isLoading, isError, sendError, text, isSending,
    inputBarPadding, selectedPhoto, listRef,
    handleTextChange, handleSend, handleAttachPress,
    handlePhotoPress, handlePhotoClose,
  };
}

function _getApiBase(): string {
  return (process.env.EXPO_PUBLIC_API_URL as string | undefined) ??
    'https://api.moiorder.com/api/merchant/v1';
}
