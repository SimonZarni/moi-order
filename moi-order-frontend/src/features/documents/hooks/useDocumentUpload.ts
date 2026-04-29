import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';

import { uploadDocument, deleteDocument } from '@/shared/api/documents';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { DocumentType } from '@/types/enums';
import { Document, ApiError } from '@/types/models';

export interface UseDocumentUploadResult {
  isUploading: boolean;
  isDeleting: boolean;
  handleUploadPress: () => void;
  handleDelete: (doc: Document) => void;
}

export function useDocumentUpload(type: DocumentType): UseDocumentUploadResult {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting]   = useState(false);

  const invalidate = useCallback((): void => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOCUMENTS.LIST(type) });
  }, [queryClient, type]);

  const launchCamera = useCallback(async (): Promise<void> => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission required', 'Allow camera access to take a photo of your document.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.9,
    });
    if (result.canceled || !result.assets[0]) return;
    await doUpload(result.assets[0].uri, result.assets[0].mimeType ?? 'image/jpeg');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const launchLibrary = useCallback(async (): Promise<void> => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission required', 'Allow photo library access to upload a document.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.9,
    });
    if (result.canceled || !result.assets[0]) return;
    await doUpload(result.assets[0].uri, result.assets[0].mimeType ?? 'image/jpeg');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const doUpload = useCallback(async (uri: string, mimeType: string): Promise<void> => {
    try {
      setIsUploading(true);
      await uploadDocument(uri, mimeType, type);
      invalidate();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      Alert.alert('Upload failed', apiError.message ?? 'Could not upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [type, invalidate]);

  const handleUploadPress = useCallback((): void => {
    Alert.alert('Add Document', 'How would you like to add this document?', [
      { text: 'Take Photo',           onPress: () => { void launchCamera(); } },
      { text: 'Choose from Library',  onPress: () => { void launchLibrary(); } },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [launchCamera, launchLibrary]);

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

  return { isUploading, isDeleting, handleUploadPress, handleDelete };
}
