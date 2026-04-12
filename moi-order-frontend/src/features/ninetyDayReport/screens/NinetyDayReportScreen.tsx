import React from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { HeroHeader } from '@/shared/components/HeroHeader/HeroHeader';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { ServiceTypeCard } from '@/features/ninetyDayReport/components/ServiceTypeCard';
import { useNinetyDayReportScreen } from '@/features/ninetyDayReport/hooks/useNinetyDayReportScreen';
import { styles } from './NinetyDayReportScreen.styles';

export function NinetyDayReportScreen(): React.JSX.Element {
  const { types, isLoading, isRefreshing, isError, handleRefresh, handleSelectType, handleBack } =
    useNinetyDayReportScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={editorialPalette.sage} />
        }
      >
        <HeroHeader
          accentColor={editorialPalette.sage}
          eyebrow="รายงานตัว 90 วัน"
          title="90-Day Report"
          subtitle="Select the report type that matches your visa category."
          onBack={handleBack}
          backLabel="Home"
        />

        <View style={styles.body}>
          <Text style={styles.sectionLabel}>Select Type</Text>

          {isLoading && (
            <View style={styles.centered}>
              <ActivityIndicator color={editorialPalette.sage} size="large" />
            </View>
          )}

          {isError && (
            <View style={styles.centered}>
              <Text style={styles.errorText}>Unable to load services. Please try again.</Text>
            </View>
          )}

          {!isLoading && !isError && types.length === 0 && (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No service types available at the moment.</Text>
            </View>
          )}

          {types.map((type) => (
            <ServiceTypeCard key={type.id} type={type} onPress={handleSelectType} />
          ))}
        </View>
      </ScrollView>
      <FloatingTabBar />
    </SafeAreaView>
  );
}
