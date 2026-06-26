import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Keyboard, Share } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from '@/types/navigation';
import { FOOD_ORDER_STATUS, FoodOrderStatus } from '@/types/enums';
import { OrderChatMessage } from '@/types/models';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { useOrderChatData, useSendChatMessage, useDeleteChatMessage } from './useOrderChatData';

type Route = RouteProp<RootStackParamList, 'OrderChat'>;

export type SelectedImage = { uri: string; name: string; type: string };

export interface UseOrderChatScreenResult {
  orderId: string;
  orderNumber: string | null;
  restaurantName: string | null;
  messages: ReturnType<typeof useOrderChatData>['messages'];
  isLoading: boolean;
  isError: boolean;
  sendError: string | null;
  text: string;
  isSending: boolean;
  isChatLocked: boolean;
  inputBarPadding: number;
  selectedImages: SelectedImage[];
  selectedPhoto: string | null;
  listRef: React.RefObject<FlatList | null>;
  replyingTo: OrderChatMessage | null;
  pressedMessage: OrderChatMessage | null;
  handleBack: () => void;
  handleTextChange: (v: string) => void;
  handleSend: () => void;
  handleSetReply: (msg: OrderChatMessage | null) => void;
  handlePickImage: () => Promise<void>;
  handleRemoveImage: (index: number) => void;
  handlePhotoPress: (uri: string) => void;
  handlePhotoClose: () => void;
  handleLongPress: (msg: OrderChatMessage) => void;
  handleCloseMenu: () => void;
  handleMenuReply: () => void;
  handleMenuCopyText: () => void;
  handleMenuDelete: () => void;
}

function computeIsChatLocked(
  orderStatus: FoodOrderStatus | undefined,
  completedAt: string | null | undefined,
): boolean {
  if (
    orderStatus === FOOD_ORDER_STATUS.Cancelled ||
    orderStatus === FOOD_ORDER_STATUS.Expired
  ) {
    return true;
  }
  if (orderStatus === FOOD_ORDER_STATUS.Completed && completedAt) {
    return Date.now() > new Date(completedAt).getTime() + 3 * 60 * 60 * 1_000;
  }
  return false;
}

export function useOrderChatScreen(): UseOrderChatScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route      = useRoute<Route>();
  const { orderId, orderNumber, restaurantName, completedAt, orderStatus } = route.params;
  const { bottom: bottomInset } = useSafeAreaInsets();

  const queryClient = useQueryClient();
  const { messages, isLoading, isError, liveOrderStatus, liveCompletedAt } = useOrderChatData(orderId, { orderStatus, completedAt: completedAt ?? null });
  const { mutateAsync }  = useSendChatMessage();
  const { mutate: deleteMessage } = useDeleteChatMessage();
  const [text, setText]             = useState('');
  const [sendError, setSendError]   = useState<string | null>(null);
  const [isSending, setIsSending]   = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedImages, setSelectedImages]   = useState<SelectedImage[]>([]);
  const [selectedPhoto, setSelectedPhoto]     = useState<string | null>(null);
  const [replyingTo, setReplyingTo]           = useState<OrderChatMessage | null>(null);
  const [pressedMessage, setPressedMessage]   = useState<OrderChatMessage | null>(null);
  const listRef = useRef<FlatList>(null);
  const replyingToRef = useRef<OrderChatMessage | null>(null);
  replyingToRef.current = replyingTo;
  const pressedMessageRef = useRef<OrderChatMessage | null>(null);
  pressedMessageRef.current = pressedMessage;

  const isChatLocked = computeIsChatLocked(liveOrderStatus, liveCompletedAt);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // Scroll to bottom whenever message count changes (initial load + Pusher updates).
  useEffect(() => {
    if (messages.length === 0) return;
    listRef.current?.scrollToEnd({ animated: false });
  }, [messages.length]);

  // Collapse safe-area gap when keyboard is visible (keyboard fills that space)
  const inputBarPadding = keyboardVisible ? 8 : Math.max(bottomInset, 8) + 8;

  const handleBack        = useCallback(() => navigation.goBack(), [navigation]);
  const handleTextChange  = useCallback((v: string) => setText(v), []);
  const handleSetReply    = useCallback((msg: OrderChatMessage | null) => setReplyingTo(msg), []);
  const handleRemoveImage = useCallback(
    (index: number) => setSelectedImages((prev) => prev.filter((_, i) => i !== index)),
    [],
  );

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if ((!trimmed && selectedImages.length === 0) || isSending) return;

    setIsSending(true);
    setSendError(null);

    const replySnapshot = replyingToRef.current;
    const replyToId     = replySnapshot?.id;
    setReplyingTo(null);

    const replyExtra = replyToId !== undefined ? { replyToId } : {};

    const hadImages = selectedImages.length > 0;
    const sends: Array<() => Promise<unknown>> = [];
    if (trimmed) {
      sends.push(() => mutateAsync({ orderId, body: trimmed, image: null, ...replyExtra, replyingToMsg: replySnapshot }));
    }
    for (const img of selectedImages) {
      const captured = img;
      sends.push(() => mutateAsync({ orderId, body: null, image: captured, ...replyExtra, replyingToMsg: replySnapshot }));
    }

    (async () => {
      try {
        for (const fn of sends) {
          await fn();
        }
        setText('');
        setSelectedImages([]);
      } catch (err) {
        const status = (err as { status?: number })?.status;
        // 5xx: server saved the photo/message but returned an error response.
        // Refetch so the message appears and clear the stuck preview.
        if (typeof status === 'number' && status >= 500 && hadImages) {
          void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FOOD_ORDERS.CHAT(orderId) });
          setSelectedImages([]);
        } else {
          setSendError('Failed to send. Please try again.');
        }
      } finally {
        setIsSending(false);
      }
    })();
  }, [text, selectedImages, isSending, mutateAsync, orderId, queryClient]);

  const handlePickImage = useCallback(async () => {
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

  const handlePhotoPress = useCallback((uri: string) => setSelectedPhoto(uri), []);
  const handlePhotoClose = useCallback(() => setSelectedPhoto(null), []);

  const handleLongPress  = useCallback((msg: OrderChatMessage) => setPressedMessage(msg), []);
  const handleCloseMenu  = useCallback(() => setPressedMessage(null), []);

  const handleMenuReply  = useCallback(() => {
    if (pressedMessageRef.current !== null) setReplyingTo(pressedMessageRef.current);
    setPressedMessage(null);
  }, []);

  const handleMenuCopyText = useCallback(() => {
    const body = pressedMessageRef.current?.body;
    if (body) void Share.share({ message: body });
    setPressedMessage(null);
  }, []);

  const handleMenuDelete = useCallback(() => {
    const msg = pressedMessageRef.current;
    setPressedMessage(null);
    if (msg === null) return;
    Alert.alert('Delete message', 'This will remove the message for everyone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMessage({ orderId, messageId: msg.id }) },
    ]);
  }, [orderId, deleteMessage]);

  return {
    orderId,
    orderNumber,
    restaurantName,
    messages,
    isLoading,
    isError,
    sendError,
    text,
    isSending,
    isChatLocked,
    inputBarPadding,
    selectedImages,
    selectedPhoto,
    listRef,
    replyingTo,
    pressedMessage,
    handleBack,
    handleTextChange,
    handleSend,
    handleSetReply,
    handlePickImage,
    handleRemoveImage,
    handlePhotoPress,
    handlePhotoClose,
    handleLongPress,
    handleCloseMenu,
    handleMenuReply,
    handleMenuCopyText,
    handleMenuDelete,
  };
}
