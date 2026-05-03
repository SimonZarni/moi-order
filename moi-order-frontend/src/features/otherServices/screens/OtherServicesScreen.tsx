import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StandaloneFloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { HeroHeader } from '@/shared/components/HeroHeader/HeroHeader';
import { editorialPalette } from '@/shared/theme/editorialPalette';
import { useOtherServicesScreen } from '@/features/otherServices/hooks/useOtherServicesScreen';
import { styles } from './OtherServicesScreen.styles';

export function OtherServicesScreen(): React.JSX.Element {
  const { handleBack } = useOtherServicesScreen();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
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
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No services available at the moment.</Text>
          </View>
        </View>
      </ScrollView>
      <StandaloneFloatingTabBar />
    </SafeAreaView>
  );
}
