import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { ServiceTypeCard } from '@/features/ninetyDayReport/components/ServiceTypeCard';
import { useNinetyDayReportScreen } from '@/features/ninetyDayReport/hooks/useNinetyDayReportScreen';
import { styles } from './NinetyDayReportScreen.styles';

export function NinetyDayReportScreen(): React.JSX.Element {
  const { types, isLoading, isError, handleSelectType, handleBack } =
    useNinetyDayReportScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.orbLarge} />
          <View style={styles.orbSmall} />
          <Pressable
            style={styles.backBtn}
            onPress={handleBack}
            accessibilityLabel="Go back to home"
            accessibilityRole="button"
          >
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backLabel}>Home</Text>
          </Pressable>
          <Text style={styles.headerEyebrow}>รายงานตัว 90 วัน</Text>
          <Text style={styles.headerTitle}>90-Day Report</Text>
          <Text style={styles.headerSubtitle}>
            Select the report type that matches your visa category.
          </Text>
        </View>

        {/* Body */}
        <View style={styles.body}>
          <Text style={styles.sectionLabel}>Select Type</Text>

          {isLoading && (
            <View style={styles.centered}>
              <ActivityIndicator color="#224e4a" size="large" />
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
