import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Keyboard, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { apiClient } from '../../../api/client';
import { fetchOrderChat, sendOrderChatMessage } from '../../../api/chat';
import { QUERY_KEYS } from '../../../shared/constants/queryKeys';
import { PUSHER_APP_KEY, PUSHER_APP_CLUSTER } from '../../../shared/constants/config';
import { useAuthStore } from '../../../store/authStore';
import type { OrderChatMessage } from '../../../types/models';
import { ORDER_STATUS } from '../../../types/enums';
import { normalizePickedImage } from '../../../shared/utils/imageUtils';

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

export type SelectedImage = { uri: string; name: string; type: string };

function computeIsChatLocked(orderStatus: string, completedAt: string | null): boolean {
  if (orderStatus === ORDER_STATUS.Cancelled || orderStatus === ORDER_STATUS.Expired) return true;
  if (orderStatus === ORDER_STATUS.Completed) {
    if (completedAt === null) return true;
    return Date.now() - new Date(completedAt).getTime() >= 3 * 60 * 60 * 1000;
  }
  return false;
}

interface UseOrderChatScreenResult {
  messages: OrderChatMessage[];
  isLoading: boolean;
  isError: boolean;
  isNetworkError: boolean;
  sendError: string | null;
  text: string;
  isSending: boolean;
  inputBarPadding: number;
  selectedImages: SelectedImage[];
  selectedPhoto: string | null;
  listRef: React.RefObject<FlatList | null>;
  isChatLocked: boolean;
  isCompletedButNotLocked: boolean;
  handleTextChange: (v: string) => void;
  handleSend: () => void;
  handleAttachPress: () => void;
  handleRemoveImage: (index: number) => void;
  handlePhotoPress: (uri: string) => void;
  handlePhotoClose: () => void;
}

export function useOrderChatScreen(
  orderId: string,
  orderStatus: string,
  completedAt: string | null,
): UseOrderChatScreenResult {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const { bottom: bottomInset } = useSafeAreaInsets();
  const [text, setText]                     = useState('');
  const [sendError, setSendError]           = useState<string | null>(null);
  const [isSending, setIsSending]           = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [selectedPhoto, setSelectedPhoto]   = useState<string | null>(null);
  const listRef = useRef<FlatList>(null);

  // Real-time chat updates via Pusher private-order.{orderId} channel.
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
              const res = await apiClient.post<{ auth: string }>(
                '/broadcasting/auth',
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
    } catch { /* pusher-js not installed or network error */ }
    return () => {
      try {
        pusher?.unsubscribe(`private-order.${orderId}`);
        pusher?.disconnect();
      } catch { /* silent */ }
    };
  }, [token, orderId, queryClient]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEYS.ORDER_CHAT(orderId),
    queryFn: () => fetchOrderChat(orderId),
    retry: 2,
  });

  const isNetworkError =
    isError && axios.isAxiosError(error) && error.response === undefined;

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

  const { mutateAsync } = useMutation({
    mutationFn: ({ body, image }: { body: string | null; image: SelectedImage | null }) =>
      sendOrderChatMessage(orderId, body, image),
    onSuccess: (newMsg) => {
      queryClient.setQueryData<OrderChatMessage[]>(
        QUERY_KEYS.ORDER_CHAT(orderId),
        (prev) => {
          const existing = prev ?? [];
          // Pusher may have already inserted this message before the HTTP response
          // arrived — skip the append to avoid duplicates regardless of race order.
          if (existing.some((m) => m.id === newMsg.id)) return existing;
          return [...existing, newMsg];
        },
      );
    },
  });

  const handleTextChange  = useCallback((v: string) => setText(v), []);
  const handleRemoveImage = useCallback(
    (index: number) => setSelectedImages((prev) => {
      const img = prev[index];
      if (img?.uri.startsWith('blob:')) URL.revokeObjectURL(img.uri);
      return prev.filter((_, i) => i !== index);
    }),
    [],
  );

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if ((!trimmed && selectedImages.length === 0) || isSending) return;

    setIsSending(true);
    setSendError(null);

    const sends: Array<() => Promise<unknown>> = [];
    if (trimmed) {
      sends.push(() => mutateAsync({ body: trimmed, image: null }));
    }
    for (const img of selectedImages) {
      const captured = img;
      sends.push(() => mutateAsync({ body: null, image: captured }));
    }

    (async () => {
      try {
        for (const fn of sends) {
          await fn();
        }
        setText('');
        selectedImages.forEach((img) => { if (img.uri.startsWith('blob:')) URL.revokeObjectURL(img.uri); });
        setSelectedImages([]);
      } catch {
        setSendError('Failed to send. Please try again.');
      } finally {
        setIsSending(false);
      }
    })();
  }, [text, selectedImages, isSending, mutateAsync]);

  const pickFromLibrary = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.8,
      allowsMultipleSelection: true,
    });
    if (result.canceled || result.assets.length === 0) return;
    const normalized = await Promise.all(
      result.assets.map((asset, i) => normalizePickedImage(asset, `chat_${i}`)),
    );
    setSelectedImages((prev) => [...prev, ...normalized]);
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
    const img = await normalizePickedImage(asset, 'chat');
    setSelectedImages((prev) => [...prev, img]);
  }, []);

  const handleAttachPress = useCallback(() => {
    if (Platform.OS === 'web') {
      void pickFromLibrary();
      return;
    }
    Alert.alert('Add Photo', undefined, [
      { text: 'Take Photo',          onPress: () => { void takePhoto(); } },
      { text: 'Choose from Library', onPress: () => { void pickFromLibrary(); } },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [takePhoto, pickFromLibrary]);

  const handlePhotoPress = useCallback((uri: string) => setSelectedPhoto(uri), []);
  const handlePhotoClose = useCallback(() => setSelectedPhoto(null), []);

  const isChatLocked = computeIsChatLocked(orderStatus, completedAt);
  const isCompletedButNotLocked = orderStatus === ORDER_STATUS.Completed && !isChatLocked;

  return {
    messages, isLoading, isError, isNetworkError, sendError, text, isSending,
    inputBarPadding, selectedImages, selectedPhoto, listRef,
    isChatLocked, isCompletedButNotLocked,
    handleTextChange, handleSend, handleAttachPress, handleRemoveImage,
    handlePhotoPress, handlePhotoClose,
  };
}
