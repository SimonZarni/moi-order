import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { HeroHeader } from '@/shared/components/HeroHeader/HeroHeader';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { useOtherServicesScreen } from '@/features/otherServices/hooks/useOtherServicesScreen';
import { styles } from './OtherServicesScreen.styles';

export function OtherServicesScreen(): React.JSX.Element {
  const { services, isLoading, isError, handleSelectService, handleBack } =
    useOtherServicesScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
              accessibilityLabel={`${service.name_en} service`}
              accessibilityRole="button"
            >
              <View style={styles.serviceCardContent}>
                <Text style={styles.serviceCardTitle}>{service.name_en}</Text>
                <Text style={styles.serviceCardSubtitle}>{service.name}</Text>
                {service.types.length > 0 && (
                  <Text style={styles.serviceCardPrice}>
                    ฿{service.types[0]!.price.toLocaleString('th-TH')}
                  </Text>
                )}
              </View>
              <View style={styles.serviceCardArrow}>
                <Text style={styles.serviceCardArrowText}>›</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <FloatingTabBar />
    </SafeAreaView>
  );
}
