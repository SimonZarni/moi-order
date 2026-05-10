import React from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StandaloneFloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { HeroHeader } from '@/shared/components/HeroHeader/HeroHeader';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { PassportCiServiceCardSkeleton } from '@/features/passportCiServices/components/PassportCiServiceCardSkeleton';
import { usePassportCiServicesScreen } from '@/features/passportCiServices/hooks/usePassportCiServicesScreen';
import { useLocale } from '@/shared/hooks/useLocale';
import { localeName } from '@/shared/utils/localeName';
import { useStrings } from '@/shared/i18n';
import { styles } from './PassportCiServicesScreen.styles';

export function PassportCiServicesScreen(): React.JSX.Element {
  const { services, isLoading, isRefreshing, isError, handleRefresh, handleSelectService, handleBack } =
    usePassportCiServicesScreen();
  const { locale } = useLocale();
  const s = useStrings();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={editorialPalette.indigo} />
        }
      >
        <HeroHeader
          accentColor={editorialPalette.indigo}
          eyebrow={s.services.passportCiEyebrow}
          title={s.services.passportCiTitle}
          titleStyle={locale === 'mm' ? { fontSize: 20, lineHeight: 36, includeFontPadding: false } : undefined}
          subtitle={s.services.passportCiSubtitle}
          onBack={handleBack}
          backLabel={s.services.backHome}
        />

        <View style={styles.body}>
          <Text style={styles.sectionLabel}>{s.services.availableServices}</Text>

          {isLoading && (
            <>
              <PassportCiServiceCardSkeleton />
              <PassportCiServiceCardSkeleton />
            </>
          )}

          {isError && (
            <View style={styles.centered}>
              <Text style={styles.errorText}>{s.services.unableToLoad}</Text>
            </View>
          )}

          {!isLoading && !isError && services.length === 0 && (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>{s.services.noServices}</Text>
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
