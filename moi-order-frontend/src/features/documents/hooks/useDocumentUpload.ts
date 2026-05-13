import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

import { uploadDocument, deleteDocument } from '@/shared/api/documents';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { DOCUMENT_TYPE, DocumentType } from '@/types/enums';
import { Document, ApiError, UploadStats } from '@/types/models';
import { formatResetDate } from '@/shared/utils/formatDate';
import { type Locale, useLocaleStore } from '@/shared/store/localeStore';
import { useUploadStats } from './useUploadStats';

const INVALID_TYPE_MESSAGES: Record<DocumentType, Record<Locale, string>> = {
  [DOCUMENT_TYPE.Passport]: {
    en: 'This does not appear to be a passport. Please upload your passport bio data page or a visa/stamp page.',
    mm: 'ဤပုံသည် နိုင်ငံကူးလက်မှတ် မဟုတ်ပါ။ ကျေးဇူးပြုပြီး သင်၏ နိုင်ငံကူးလက်မှတ်ရဲ့ ဓာတ်ပုံ စာမျက်နှာ သို့မဟုတ် ဗီဇာ/တံဆိပ်တုံး စာမျက်နှာကို တင်ပေးပါ။',
    th: 'รูปนี้ไม่ใช่หนังสือเดินทาง กรุณาอัปโหลดหน้าข้อมูลชีวภาพหรือหน้าวีซ่า/ตราประทับ',
  },
  [DOCUMENT_TYPE.NinetyDayReport]: {
    en: 'This does not appear to be a 90-day report slip. Please upload your TM47 notification receipt.',
    mm: 'ဤပုံသည် ၉၀ ရက် အကြောင်းကြားစာ မဟုတ်ပါ။ ကျေးဇူးပြုပြီး သင်၏ TM47 ထောက်ခံချက်ကို တင်ပေးပါ။',
    th: 'รูปนี้ไม่ใช่ใบแจ้งที่พักอาศัย 90 วัน กรุณาอัปโหลดใบเสร็จการแจ้ง TM47',
  },
  [DOCUMENT_TYPE.Other]: {
    en: 'This does not appear to be a valid official document. Please upload a recognised document such as a work permit, ID card, or driving licence.',
    mm: 'ဤပုံသည် တရားဝင် စာရွက်စာတမ်း မဟုတ်ပါ။ ကျေးဇူးပြုပြီး လုပ်ငန်းခွင် ခွင့်ပြုချက်၊ မှတ်ပုံတင်ကတ် သို့မဟုတ် ယာဉ်မောင်းလိုင်စင် ကဲ့သို့သော တရားဝင် စာရွက်စာတမ်းကို တင်ပေးပါ။',
    th: 'รูปนี้ไม่ใช่เอกสารราชการที่ถูกต้อง กรุณาอัปโหลดเอกสารที่รับรอง เช่น ใบอนุญาตทำงาน บัตรประชาชน หรือใบขับขี่',
  },
};

export interface UseDocumentUploadResult {
  isUploading:           boolean;
  isDeleting:            boolean;
  handleUploadPress:     () => void;
  handleDelete:          (doc: Document) => void;
  showLimitModal:        boolean;
  monthlyRemaining:      number;
  handleLimitModalUpload: () => void;
  handleLimitModalCancel: () => void;
}

// Always re-encode to JPEG before upload so the server and Claude receive a supported format.
// On iOS production builds, gallery images resolve to HEIC (ph:// URIs) which Claude cannot
// decode. Camera shots can also be HEIF in some device configurations.
//
// MAX_DIM 4096 → 2048: a 4096px JPEG at quality 0.92 is 10–20 MB and triggers a 413 on
// nginx. 2048px on the longer side is plenty for OCR — digit strokes remain ~40px+ tall.
//
// Always resize (not conditional): without at least one manipulator operation, expo-image-
// manipulator may pass through raw HEIC data unchanged for ph:// URIs, producing huge uploads.
//
// HEIC (ph:// assets) gets quality 0.85; non-HEIC gets 0.92. Both are well above the
// artifact threshold for OCR — the previous 0.92→0.99 bump was needed when images were
// sideways (mental-rotation + artifacts compounded errors). With server-side orientation
// correction now in place, 0.92 is safe for correctly-oriented images.
const MAX_DIM = 2048;
async function compressAssetToJpeg(
  uri: string,
  width:  number,
  height: number,
): Promise<{ uri: string; mimeType: string }> {
  // ph:// URIs are iOS Photos Library assets and are commonly HEIC.
  // Use lower quality to prevent 50 MB+ uploads when HEIC decodes to deep-colour JPEG.
  const isHeic   = uri.startsWith('ph://');
  const quality  = isHeic ? 0.85 : 0.92;
  const w = width  > 0 ? width  : MAX_DIM;
  const h = height > 0 ? height : MAX_DIM;

  const ctx = ImageManipulator.manipulate(uri);
  // Always resize — forces full decode → JPEG encode cycle even for small images.
  if (w >= h) {
    ctx.resize({ width: Math.min(w, MAX_DIM) });
  } else {
    ctx.resize({ height: Math.min(h, MAX_DIM) });
  }
  const rendered   = await ctx.renderAsync();
  const compressed = await rendered.saveAsync({ compress: quality, format: SaveFormat.JPEG });
  return { uri: compressed.uri, mimeType: 'image/jpeg' };
}

export function useDocumentUpload(type: DocumentType): UseDocumentUploadResult {
  const queryClient   = useQueryClient();
  const { stats }     = useUploadStats();
  const locale        = useLocaleStore((s) => s.locale);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting,  setIsDeleting]  = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const invalidate = useCallback((): void => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOCUMENTS.LIST(type) });
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOCUMENTS.UPLOAD_STATS });
  }, [queryClient, type]);

  const launchPicker = useCallback(async (): Promise<void> => {
    Alert.alert('Add Document', 'How would you like to add this document?', [
      { text: 'Take Photo',          onPress: () => { void launchCamera(); } },
      { text: 'Choose from Library', onPress: () => { void launchLibrary(); } },
      { text: 'Cancel', style: 'cancel' },
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const launchCamera = useCallback(async (): Promise<void> => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission required', 'Allow camera access to take a photo of your document.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    const { uri, mimeType } = await compressAssetToJpeg(asset.uri, asset.width, asset.height);
    await doUpload(uri, mimeType);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const launchLibrary = useCallback(async (): Promise<void> => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission required', 'Allow photo library access to upload a document.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });
    if (result.canceled || !result.assets[0]) return;
    // compressAssetToJpeg converts HEIC/HEIF (common on iOS production ph:// URIs) to JPEG.
    // Claude's vision API only supports JPEG/PNG/GIF/WebP — HEIC causes garbled extraction.
    const asset = result.assets[0];
    const { uri, mimeType } = await compressAssetToJpeg(asset.uri, asset.width, asset.height);
    await doUpload(uri, mimeType);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doUpload = useCallback(async (uri: string, mimeType: string): Promise<void> => {
    try {
      setIsUploading(true);
      const result = await uploadDocument(uri, mimeType, type);
      invalidate();
      if (!result.document.is_valid_type) {
        Alert.alert(
          'Document Not Accepted',
          INVALID_TYPE_MESSAGES[type][locale],
        );
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.status === 429) {
        Alert.alert('Upload Limit Reached', 'You have reached your monthly upload limit.');
      } else {
        // Include field-level validation errors so upload failures can be diagnosed.
        const fieldErrors = apiError.errors
          ? '\n\n' + Object.entries(apiError.errors)
              .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
              .join('\n')
          : '';
        Alert.alert('Upload failed', (apiError.message ?? 'Could not upload document. Please try again.') + fieldErrors);
      }
    } finally {
      setIsUploading(false);
    }
  }, [type, locale, invalidate]);

  // Checks daily section cap then launches picker — shared by handleUploadPress and low-quota continue.
  const proceedWithUpload = useCallback((): void => {
    const sectionStats = stats?.sections[type as keyof typeof stats.sections];
    if (
      sectionStats &&
      sectionStats.daily_limit !== null &&
      sectionStats.today_used >= sectionStats.daily_limit
    ) {
      setShowLimitModal(true);
      return;
    }
    void launchPicker();
  }, [stats, type, launchPicker]);

  const handleUploadPress = useCallback((): void => {
    if (!stats || stats.is_privileged) {
      void launchPicker();
      return;
    }

    // Hard block: monthly limit reached
    if (stats.monthly_remaining !== null && stats.monthly_remaining <= 0) {
      const resetDate = stats.reset_date ? formatResetDate(stats.reset_date) : 'next month';
      Alert.alert(
        'Monthly Limit Reached',
        `You have used all ${stats.monthly_limit} uploads this month.\nResets on ${resetDate}.`,
      );
      return;
    }

    // Soft warning: low monthly quota (≤5 remaining)
    if (stats.monthly_remaining !== null && stats.monthly_remaining <= 5) {
      const n = stats.monthly_remaining;
      Alert.alert(
        'Low Upload Allowance',
        `You only have ${n} upload${n === 1 ? '' : 's'} remaining this month. Do you want to continue?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: proceedWithUpload },
        ],
      );
      return;
    }

    proceedWithUpload();
  }, [stats, launchPicker, proceedWithUpload]);

  const handleLimitModalUpload = useCallback((): void => {
    setShowLimitModal(false);
    void launchPicker();
  }, [launchPicker]);

  const handleLimitModalCancel = useCallback((): void => {
    setShowLimitModal(false);
  }, []);

  const handleDelete = useCallback((doc: Document): void => {
    Alert.alert('Remove Document', 'Delete this document? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setIsDeleting(true);
            await deleteDocument(doc.id);
            invalidate();
          } catch (error: unknown) {
            const apiError = error as ApiError;
            Alert.alert('Error', apiError.message ?? 'Could not delete document.');
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  }, [invalidate]);

  const monthlyRemaining = stats?.monthly_remaining ?? 0;

  return {
    isUploading,
    isDeleting,
    handleUploadPress,
    handleDelete,
    showLimitModal,
    monthlyRemaining,
    handleLimitModalUpload,
    handleLimitModalCancel,
  };
}
