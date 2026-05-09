import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StandaloneFloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { HeroHeader } from '@/shared/components/HeroHeader/HeroHeader';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { useOtherServicesScreen } from '@/features/otherServices/hooks/useOtherServicesScreen';
import { useStrings } from '@/shared/i18n';
import { useLocale } from '@/shared/hooks/useLocale';
import { styles } from './OtherServicesScreen.styles';

export function OtherServicesScreen(): React.JSX.Element {
  const { handleBack } = useOtherServicesScreen();
  const s = useStrings();
  const { locale } = useLocale();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <HeroHeader
          accentColor={editorialPalette.teal}
          eyebrow={s.services.otherEyebrow}
          title={s.services.otherTitle}
          titleStyle={locale === 'mm' ? { fontSize: 20, lineHeight: 36, includeFontPadding: false } : undefined}
          subtitle={s.services.otherSubtitle}
          onBack={handleBack}
          backLabel={s.services.backHome}
        />

        <View style={styles.body}>
          <Text style={styles.sectionLabel}>{s.services.availableServices}</Text>
          <View style={styles.centered}>
            <Text style={styles.emptyText}>{s.services.noServices}</Text>
          </View>
        </View>
      </ScrollView>
      <StandaloneFloatingTabBar />
    </SafeAreaView>
  );
}
