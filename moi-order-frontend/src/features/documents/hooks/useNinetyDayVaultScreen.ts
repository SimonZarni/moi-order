import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import { fetchDocuments } from '@/shared/api/documents';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { DOCUMENT_TYPE } from '@/types/enums';
import { Document } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { useDocumentUpload, UseDocumentUploadResult } from './useDocumentUpload';

export interface UseNinetyDayVaultScreenResult extends UseDocumentUploadResult {
  documents: Document[];
  isLoading: boolean;
  handleBack: () => void;
}

export function useNinetyDayVaultScreen(): UseNinetyDayVaultScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const upload     = useDocumentUpload(DOCUMENT_TYPE.NinetyDayReport);

  const { data: documents = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.DOCUMENTS.LIST(DOCUMENT_TYPE.NinetyDayReport),
    queryFn:  () => fetchDocuments(DOCUMENT_TYPE.NinetyDayReport),
    staleTime: 2 * 60 * 1000,
  });

  const handleBack = (): void => { navigation.goBack(); };

  return { documents, isLoading, handleBack, ...upload };
}
