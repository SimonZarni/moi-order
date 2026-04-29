import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import { fetchDocuments } from '@/shared/api/documents';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { DOCUMENT_TYPE } from '@/types/enums';
import { Document } from '@/types/models';
import { RootStackParamList } from '@/types/navigation';
import { useDocumentUpload, UseDocumentUploadResult } from './useDocumentUpload';

export interface UsePassportScreenResult extends UseDocumentUploadResult {
  documents: Document[];
  isLoading: boolean;
  handleBack: () => void;
}

export function usePassportScreen(): UsePassportScreenResult {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const upload     = useDocumentUpload(DOCUMENT_TYPE.Passport);

  const { data: documents = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.DOCUMENTS.LIST(DOCUMENT_TYPE.Passport),
    queryFn:  () => fetchDocuments(DOCUMENT_TYPE.Passport),
    staleTime: 2 * 60 * 1000,
  });

  const handleBack = (): void => { navigation.goBack(); };

  return { documents, isLoading, handleBack, ...upload };
}
