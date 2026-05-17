import React from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StandaloneFloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { HeroHeader } from '@/shared/components/HeroHeader/HeroHeader';
import { ServiceTypeCard } from '@/shared/components/ServiceTypeCard/ServiceTypeCard';
import { ServiceTypeCardSkeleton } from '@/shared/components/ServiceTypeCardSkeleton/ServiceTypeCardSkeleton';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { useCompanyServicesScreen } from '@/features/companyServices/hooks/useCompanyServicesScreen';
import { useLocale } from '@/shared/hooks/useLocale';
import { useStrings } from '@/shared/i18n';
import { styles } from './CompanyServicesScreen.styles';

export function CompanyServicesScreen(): React.JSX.Element {
  const { types, isLoading, isRefreshing, isError, handleRefresh, handleSelectType, handleBack } =
    useCompanyServicesScreen();
  const { locale } = useLocale();
  const s = useStrings();

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
          eyebrow={s.services.companyEyebrow}
          title={s.services.companyTitle}
          titleStyle={locale === 'mm' ? { fontSize: 20, lineHeight: 40, includeFontPadding: false } : undefined}
          subtitle={s.services.companySubtitle}
          onBack={handleBack}
          backLabel={s.services.backHome}
        />

        <View style={styles.body}>
          <Text style={styles.sectionLabel}>{s.services.selectType}</Text>

          {isLoading && (
            <>
              <ServiceTypeCardSkeleton />
              <ServiceTypeCardSkeleton />
              <ServiceTypeCardSkeleton />
            </>
          )}

          {isError && (
            <View style={styles.centered}>
              <Text style={styles.errorText}>{s.services.unableToLoad}</Text>
            </View>
          )}

          {!isLoading && !isError && types.length === 0 && (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>{s.services.noServices}</Text>
            </View>
          )}

          {types.map((type) => (
            <ServiceTypeCard key={type.id} type={type} onPress={handleSelectType} />
          ))}
        </View>
      </ScrollView>
      <StandaloneFloatingTabBar />
    </SafeAreaView>
  );
}
