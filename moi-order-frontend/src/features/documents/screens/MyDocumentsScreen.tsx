import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DocumentCard } from '@/features/documents/components/DocumentCard';
import { useMyDocumentsScreen } from '@/features/documents/hooks/useMyDocumentsScreen';
import { colours } from '@/shared/theme/colours';
import { styles } from './DocumentVaultScreen.styles';

export function MyDocumentsScreen(): React.JSX.Element {
  const { documents, isLoading, isUploading, isDeleting, handleBack, handleUploadPress, handleDelete } =
    useMyDocumentsScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack} accessibilityLabel="Go back" accessibilityRole="button">
          <Ionicons name="arrow-back" size={20} color={colours.textOnDark} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>My Documents</Text>
          <Text style={styles.headerSubtitle}>Work permits, visas, ID cards & more</Text>
        </View>
        <View style={[styles.headerIcon, { backgroundColor: `${colours.tertiary}33` }]}>
          <Ionicons name="folder-open-outline" size={20} color={colours.tertiary} />
        </View>
      </View>

      <View style={styles.body}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.hintCard}>
            <Ionicons name="information-circle-outline" size={16} color={colours.primary} />
            <Text style={styles.hintText}>
              Store any official document here — work permits, ID cards, driving licences, insurance cards, and more.
            </Text>
          </View>

          <Pressable
            style={[styles.uploadBtn, (isUploading || isDeleting) && styles.uploadBtnDisabled]}
            onPress={handleUploadPress}
            disabled={isUploading || isDeleting}
            accessibilityLabel="Upload document"
            accessibilityRole="button"
          >
            {isUploading
              ? <ActivityIndicator size="small" color={colours.textOnDark} />
              : <Ionicons name="camera-outline" size={18} color={colours.textOnDark} />
            }
            <Text style={styles.uploadBtnText}>{isUploading ? 'Analysing…' : 'Upload Document'}</Text>
          </Pressable>

          {isLoading ? (
            <ActivityIndicator color={colours.primary} style={{ marginTop: 32 }} />
          ) : documents.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Ionicons name="folder-open-outline" size={48} color={colours.textMuted} />
              <Text style={styles.emptyTitle}>No documents yet</Text>
              <Text style={styles.emptySubtitle}>Upload work permits, ID cards, visas, and other legal documents.</Text>
            </View>
          ) : (
            <>
              <Text style={styles.sectionLabel}>Documents ({documents.length})</Text>
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
