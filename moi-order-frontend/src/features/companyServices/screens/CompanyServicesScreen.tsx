import React from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StandaloneFloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { HeroHeader } from '@/shared/components/HeroHeader/HeroHeader';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { useCompanyServicesScreen } from '@/features/companyServices/hooks/useCompanyServicesScreen';
import { useLocale } from '@/shared/hooks/useLocale';
import { localeName } from '@/shared/utils/localeName';
import { styles } from './CompanyServicesScreen.styles';

export function CompanyServicesScreen(): React.JSX.Element {
  const { services, isLoading, isRefreshing, isError, handleRefresh, handleSelectService, handleBack } =
    useCompanyServicesScreen();
  const { locale } = useLocale();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={editorialPalette.gold} />
        }
      >
        <HeroHeader
          accentColor={editorialPalette.gold}
          eyebrow="Business & Company"
          title="Company Services"
          subtitle="Company registration and business documentation."
          onBack={handleBack}
          backLabel="Home"
        />

        <View style={styles.body}>
          <Text style={styles.sectionLabel}>Available Services</Text>

          {isLoading && (
            <View style={styles.centered}>
              <ActivityIndicator color={editorialPalette.gold} size="large" />
            </View>
          )}

          {isError && (
            <View style={styles.centered}>
              <Text style={styles.errorText}>Unable to load services. Please try again.</Text>
            </View>
          )}

          {!isLoading && !isError && services.length === 0 && (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No services available at the moment.</Text>
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
                {service.types[0] !== undefined && (
                  <Text style={styles.serviceCardPrice}>
                    ฿{service.types[0].price.toLocaleString('th-TH')}
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
      <StandaloneFloatingTabBar />
    </SafeAreaView>
  );
}
