import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DocumentCard } from '@/features/documents/components/DocumentCard';
import { useNinetyDayVaultScreen } from '@/features/documents/hooks/useNinetyDayVaultScreen';
import { colours } from '@/shared/theme/colours';
import { styles } from './DocumentVaultScreen.styles';

export function NinetyDayVaultScreen(): React.JSX.Element {
  const { documents, isLoading, isUploading, isDeleting, handleBack, handleUploadPress, handleDelete } =
    useNinetyDayVaultScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack} accessibilityLabel="Go back" accessibilityRole="button">
          <Ionicons name="arrow-back" size={20} color={colours.textOnDark} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>90-Day Report</Text>
          <Text style={styles.headerSubtitle}>TM47 notification slips</Text>
        </View>
        <View style={[styles.headerIcon, { backgroundColor: `${colours.secondary}33` }]}>
          <Ionicons name="document-text-outline" size={20} color={colours.tertiary} />
        </View>
      </View>

      <View style={styles.body}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.hintCard}>
            <Ionicons name="information-circle-outline" size={16} color={colours.primary} />
            <Text style={styles.hintText}>
              Upload your Thai 90-day notification slip (TM47). The next report date will be extracted automatically.
            </Text>
          </View>

          <Pressable
            style={[styles.uploadBtn, (isUploading || isDeleting) && styles.uploadBtnDisabled]}
            onPress={handleUploadPress}
            disabled={isUploading || isDeleting}
            accessibilityLabel="Upload 90-day report slip"
            accessibilityRole="button"
          >
            {isUploading
              ? <ActivityIndicator size="small" color={colours.textOnDark} />
              : <Ionicons name="camera-outline" size={18} color={colours.textOnDark} />
            }
            <Text style={styles.uploadBtnText}>{isUploading ? 'Analysing…' : 'Upload Slip'}</Text>
          </Pressable>

          {isLoading ? (
            <ActivityIndicator color={colours.primary} style={{ marginTop: 32 }} />
          ) : documents.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Ionicons name="document-text-outline" size={48} color={colours.textMuted} />
              <Text style={styles.emptyTitle}>No 90-day slips</Text>
              <Text style={styles.emptySubtitle}>Upload your TM47 notification receipt to track your next report date.</Text>
            </View>
          ) : (
            <>
              <Text style={styles.sectionLabel}>Uploaded ({documents.length})</Text>
              {documents.map((doc) => (
                <DocumentCard key={doc.id} document={doc} onDelete={handleDelete} isDeleting={isDeleting} />
              ))}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
