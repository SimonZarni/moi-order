/**
 * Principle: SRP — renders a shimmer placeholder matching OrderCard's layout.
 * Light baseColor/shimmerColor since OrdersScreen uses backgroundLight.
 */
import React from 'react';
import { View } from 'react-native';

import { SkeletonBox } from '@/shared/components/SkeletonBox/SkeletonBox';
import { radius } from '@/shared/theme/radius';
import { styles } from './OrderCardSkeleton.styles';

export function OrderCardSkeleton(): React.JSX.Element {
  return (
    <View style={styles.wrap}>
      {/* Accent bar */}
      <SkeletonBox
        height={72}
        baseColor="#d1d5db"
        shimmerColor="rgba(255,255,255,0.5)"
        style={styles.accentBar}
      />
      <View style={styles.body}>
        {/* Top row: service name + status pill */}
        <View style={styles.topRow}>
          <SkeletonBox
            height={14}
            borderRadius={radius.sm}
            baseColor="#e2e8f0"
            shimmerColor="rgba(255,255,255,0.65)"
            style={{ flex: 1 }}
          />
          <SkeletonBox
            height={20}
            borderRadius={radius.full}
            baseColor="#e2e8f0"
            shimmerColor="rgba(255,255,255,0.65)"
            style={{ width: 72 }}
          />
        </View>
        {/* Meta row: date dot price */}
        <View style={styles.metaRow}>
          <SkeletonBox
            height={10}
            borderRadius={radius.sm}
            baseColor="#e2e8f0"
            shimmerColor="rgba(255,255,255,0.65)"
            style={{ width: 80 }}
          />
          <SkeletonBox
            height={10}
            borderRadius={radius.sm}
            baseColor="#e2e8f0"
            shimmerColor="rgba(255,255,255,0.65)"
            style={{ width: 48 }}
          />
        </View>
      </View>
    </View>
  );
}
