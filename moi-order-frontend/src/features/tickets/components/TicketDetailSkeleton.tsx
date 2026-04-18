import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SkeletonBox } from '@/shared/components/SkeletonBox/SkeletonBox';
import { radius } from '@/shared/theme/radius';
import { styles } from './TicketDetailSkeleton.styles';

const BASE = '#e8eae9';
const SHINE = 'rgba(255,255,255,0.6)';

function VariantCardSkeleton(): React.JSX.Element {
  return (
    <View style={styles.variantCard}>
      <View style={styles.variantInfo}>
        <SkeletonBox height={13} borderRadius={radius.sm} baseColor={BASE} shimmerColor={SHINE} style={{ width: '55%' }} />
        <SkeletonBox height={11} borderRadius={radius.sm} baseColor={BASE} shimmerColor={SHINE} style={{ width: '80%' }} />
        <SkeletonBox height={13} borderRadius={radius.sm} baseColor={BASE} shimmerColor={SHINE} style={{ width: '35%' }} />
      </View>
      <View style={styles.variantQty}>
        <SkeletonBox height={32} borderRadius={radius.full} baseColor={BASE} shimmerColor={SHINE} style={{ width: 32 }} />
        <SkeletonBox height={20} borderRadius={radius.sm} baseColor={BASE} shimmerColor={SHINE} style={{ width: 20 }} />
        <SkeletonBox height={32} borderRadius={radius.full} baseColor={BASE} shimmerColor={SHINE} style={{ width: 32 }} />
      </View>
    </View>
  );
}

export function TicketDetailSkeleton(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView style={styles.scroll} scrollEnabled={false} showsVerticalScrollIndicator={false}>
        {/* Cover image */}
        <SkeletonBox height={220} baseColor="#1a2e2c" shimmerColor="rgba(255,255,255,0.05)" />

        {/* Info block */}
        <View style={styles.infoBlock}>
          <SkeletonBox height={28} borderRadius={radius.sm} baseColor={BASE} shimmerColor={SHINE} style={{ width: '70%' }} />
          <SkeletonBox height={13} borderRadius={radius.sm} baseColor={BASE} shimmerColor={SHINE} style={{ width: '85%' }} />
          <SkeletonBox height={13} borderRadius={radius.sm} baseColor={BASE} shimmerColor={SHINE} style={{ width: '90%' }} />
          <SkeletonBox height={13} borderRadius={radius.sm} baseColor={BASE} shimmerColor={SHINE} style={{ width: '75%' }} />
          <View style={styles.addressRow}>
            <SkeletonBox height={12} borderRadius={radius.sm} baseColor={BASE} shimmerColor={SHINE} style={{ width: '50%' }} />
          </View>
        </View>

        {/* Section label */}
        <View style={styles.sectionLabelRow}>
          <SkeletonBox height={11} borderRadius={radius.sm} baseColor={BASE} shimmerColor={SHINE} style={{ width: '30%' }} />
          <View style={styles.sectionLine} />
        </View>

        <VariantCardSkeleton />
        <VariantCardSkeleton />
      </ScrollView>
    </SafeAreaView>
  );
}
