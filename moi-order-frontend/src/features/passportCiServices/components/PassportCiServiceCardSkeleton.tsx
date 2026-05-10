import React from 'react';
import { View } from 'react-native';

import { SkeletonBox } from '@/shared/components/SkeletonBox/SkeletonBox';
import { radius } from '@/shared/theme/radius';
import { styles } from './PassportCiServiceCardSkeleton.styles';

const BASE  = '#e8eae9';
const SHINE = 'rgba(255,255,255,0.6)';

export function PassportCiServiceCardSkeleton(): React.JSX.Element {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <SkeletonBox height={20} borderRadius={radius.sm} baseColor={BASE} shimmerColor={SHINE} style={{ width: '70%' }} />
        <SkeletonBox height={16} borderRadius={radius.sm} baseColor={BASE} shimmerColor={SHINE} style={{ width: '30%', marginTop: 8 }} />
      </View>
      <SkeletonBox height={40} borderRadius={20} baseColor={BASE} shimmerColor={SHINE} style={{ width: 40 }} />
    </View>
  );
}
