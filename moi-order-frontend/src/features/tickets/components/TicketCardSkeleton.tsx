import React from 'react';
import { View } from 'react-native';

import { SkeletonBox } from '@/shared/components/SkeletonBox/SkeletonBox';
import { radius } from '@/shared/theme/radius';
import { styles } from './TicketCardSkeleton.styles';

const BASE  = '#e8eae9';
const SHINE = 'rgba(255,255,255,0.6)';

export function TicketCardSkeleton(): React.JSX.Element {
  return (
    <View style={styles.wrap}>
      <SkeletonBox height={140} baseColor={BASE} shimmerColor={SHINE} />
      <View style={styles.body}>
        <SkeletonBox height={14} borderRadius={radius.sm} baseColor={BASE} shimmerColor={SHINE} style={{ width: '55%' }} />
        <SkeletonBox height={11} borderRadius={radius.sm} baseColor={BASE} shimmerColor={SHINE} style={{ width: '80%' }} />
        <SkeletonBox height={11} borderRadius={radius.sm} baseColor={BASE} shimmerColor={SHINE} style={{ width: '65%' }} />
        <View style={styles.footerRow}>
          <SkeletonBox height={11} borderRadius={radius.sm} baseColor={BASE} shimmerColor={SHINE} style={{ width: '25%' }} />
          <SkeletonBox height={11} borderRadius={radius.sm} baseColor={BASE} shimmerColor={SHINE} style={{ width: '30%' }} />
        </View>
      </View>
    </View>
  );
}
