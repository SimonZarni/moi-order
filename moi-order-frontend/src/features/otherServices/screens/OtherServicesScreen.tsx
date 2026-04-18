import React from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { HeroHeader } from '@/shared/components/HeroHeader/HeroHeader';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { useOtherServicesScreen } from '@/features/otherServices/hooks/useOtherServicesScreen';
import { useLocale } from '@/shared/hooks/useLocale';
import { localeName } from '@/shared/utils/localeName';
import { styles } from './OtherServicesScreen.styles';

export function OtherServicesScreen(): React.JSX.Element {
  const { services, isLoading, isRefreshing, isError, handleRefresh, handleSelectService, handleBack } =
    useOtherServicesScreen();
  const { locale } = useLocale();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={editorialPalette.teal} />
        }
      >
        <HeroHeader
          accentColor={editorialPalette.teal}
          eyebrow="Registration & More"
          title="Other Services"
          subtitle="Additional immigration and registration services."
          onBack={handleBack}
          backLabel="Home"
        />

        <View style={styles.body}>
          <Text style={styles.sectionLabel}>Available Services</Text>

          {isLoading && (
            <View style={styles.centered}>
              <ActivityIndicator color={editorialPalette.teal} size="large" />
            </View>
          )}

          {isError && (
            <View style={styles.centered}>
              <Text style={styles.errorText}>Unable to load services. Please try again.</Text>
            </View>
          )}

          {!isLoading && !isError && services.length === 0 && (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No other services available at the moment.</Text>
            </View>
          )}

          {services.map((service) => (
            <Pressable
              key={service.id}
              style={({ pressed }) => [styles.serviceCard, { opacity: pressed ? 0.88 : 1 }]}
              onPress={() => handleSelectService(service)}
              accessibilityLabel={`${localeName(service, locale)} service`}
              accessibilityRole="button"
            >
              <View style={styles.serviceCardContent}>
                <Text style={styles.serviceCardTitle}>{localeName(service, locale)}</Text>
                {service.types.length > 0 && (
                  <Text style={styles.serviceCardPrice}>
                    ฿{service.types[0]!.price.toLocaleString('th-TH')}
                  </Text>
                )}
              </View>
              <View style={styles.serviceCardArrow}>
                <Ionicons name="chevron-forward" size={18} color={styles.serviceCardArrowText.color} />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <FloatingTabBar />
    </SafeAreaView>
  );
}
