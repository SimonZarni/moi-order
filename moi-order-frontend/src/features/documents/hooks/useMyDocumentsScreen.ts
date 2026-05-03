import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import { fetchDocuments } from '@/shared/api/documents';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { DOCUMENT_TYPE } from '@/types/enums';
import { Document, UploadStats } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { useDocumentUpload, UseDocumentUploadResult } from './useDocumentUpload';
import { useUploadStats } from './useUploadStats';

export interface UseMyDocumentsScreenResult extends UseDocumentUploadResult {
  documents:  Document[];
  isLoading:  boolean;
  stats:      UploadStats | undefined;
  handleBack: () => void;
}

export function useMyDocumentsScreen(): UseMyDocumentsScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const upload     = useDocumentUpload(DOCUMENT_TYPE.Other);
  const { stats }  = useUploadStats();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.DOCUMENTS.LIST(DOCUMENT_TYPE.Other),
    queryFn:  () => fetchDocuments(DOCUMENT_TYPE.Other),
    staleTime: 2 * 60 * 1000,
  });

  const handleBack = (): void => { navigation.goBack(); };

  return { documents, isLoading, stats, handleBack, ...upload };
}
