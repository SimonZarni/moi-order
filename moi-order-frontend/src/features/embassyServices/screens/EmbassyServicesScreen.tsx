import React from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StandaloneFloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { StickyBackButton } from '@/shared/components/StickyBackButton/StickyBackButton';
import { HeroHeader } from '@/shared/components/HeroHeader/HeroHeader';
import { colours } from '@/shared/theme/colours';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { useEmbassyServicesScreen } from '@/features/embassyServices/hooks/useEmbassyServicesScreen';
import { useLocale } from '@/shared/hooks/useLocale';
import { localeName } from '@/shared/utils/localeName';
import { styles } from './EmbassyServicesScreen.styles';

export function EmbassyServicesScreen(): React.JSX.Element {
  const { services, isLoading, isRefreshing, isError, handleRefresh, handleSelectService, handleBack } =
    useEmbassyServicesScreen();
  const { locale } = useLocale();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StickyBackButton onPress={handleBack} label="Home" />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={editorialPalette.rose} />
        }
      >
        <HeroHeader
          accentColor={editorialPalette.rose}
          titleNode={<Text style={styles.heroTitle}>သံရုံးထောက်ခံစာများ</Text>}
          subtitle="Embassy support letters and documentation services."
          onBack={handleBack}
          backLabel="Home"
          hideBack
        />

        <View style={styles.body}>
          <Text style={styles.sectionLabel}>Available Services</Text>

          {isLoading && (
            <View style={styles.centered}>
              <ActivityIndicator color={colours.primary} size="large" />
            </View>
          )}

          {isError && (
            <View style={styles.centered}>
              <Text style={styles.errorText}>Unable to load services. Please try again.</Text>
            </View>
          )}

          {!isLoading && !isError && services.length === 0 && (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No embassy services available at the moment.</Text>
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
