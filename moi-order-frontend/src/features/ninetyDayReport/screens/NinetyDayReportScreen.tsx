import React from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StandaloneFloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { HeroHeader } from '@/shared/components/HeroHeader/HeroHeader';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { ServiceTypeCard } from '@/shared/components/ServiceTypeCard/ServiceTypeCard';
import { ServiceTypeCardSkeleton } from '@/shared/components/ServiceTypeCardSkeleton/ServiceTypeCardSkeleton';
import { useNinetyDayReportScreen } from '@/features/ninetyDayReport/hooks/useNinetyDayReportScreen';
import { useStrings } from '@/shared/i18n';
import { useLocale } from '@/shared/hooks/useLocale';
import { styles } from './NinetyDayReportScreen.styles';

export function NinetyDayReportScreen(): React.JSX.Element {
  const { types, isLoading, isRefreshing, isError, handleRefresh, handleSelectType, handleBack } =
    useNinetyDayReportScreen();
  const s = useStrings();
  const { locale } = useLocale();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={editorialPalette.sage} />
        }
      >
        <HeroHeader
          accentColor={editorialPalette.sage}
          eyebrow={s.services.ninetyDayEyebrow}
          title={s.services.ninetyDayTitle}
          titleStyle={locale === 'mm' ? { fontSize: 20, lineHeight: 36, includeFontPadding: false } : undefined}
          subtitle={s.services.ninetyDaySubtitle}
          onBack={handleBack}
          backLabel={s.services.backHome}
        />

        <View style={styles.body}>
          <Text style={[styles.sectionLabel, locale === 'mm' && { fontSize: 10, lineHeight: 18, includeFontPadding: false }]}>{s.services.selectType}</Text>

          {isLoading && (
            <>
              <ServiceTypeCardSkeleton />
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
