import React from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SkeletonBox } from '@/shared/components/SkeletonBox/SkeletonBox';
import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';
import { styles } from './PlaceDetailSkeleton.styles';

const SCREEN_WIDTH = Dimensions.get('window').width;
// Must match PlaceDetailScreen.styles.ts GALLERY_ITEM_SIZE
const GALLERY_ITEM_SIZE = (SCREEN_WIDTH - spacing.md * 2 - spacing.sm) / 2;

const LIGHT_BASE = '#e9edf2';
const LIGHT_SHIMMER = 'rgba(255,255,255,0.7)';
const BTN_BASE = '#d0d5db';

export function PlaceDetailSkeleton(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView scrollEnabled={false} showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <SkeletonBox height={300} baseColor="#1a2e2c" shimmerColor="rgba(255,255,255,0.05)" />

        {/* ── Body ── */}
        <View style={styles.body}>

          {/* City + hours chips */}
          <View style={styles.infoChipsRow}>
            <SkeletonBox height={32} borderRadius={radius.full} baseColor={LIGHT_BASE} shimmerColor={LIGHT_SHIMMER} style={{ width: 110 }} />
            <SkeletonBox height={32} borderRadius={radius.full} baseColor={LIGHT_BASE} shimmerColor={LIGHT_SHIMMER} style={{ width: 130 }} />
          </View>

          <View style={styles.divider} />

          {/* Description lines */}
          <View style={styles.descRows}>
            <SkeletonBox height={14} borderRadius={radius.sm} baseColor={LIGHT_BASE} shimmerColor={LIGHT_SHIMMER} style={{ width: '100%' }} />
            <SkeletonBox height={14} borderRadius={radius.sm} baseColor={LIGHT_BASE} shimmerColor={LIGHT_SHIMMER} style={{ width: '92%' }} />
            <SkeletonBox height={14} borderRadius={radius.sm} baseColor={LIGHT_BASE} shimmerColor={LIGHT_SHIMMER} style={{ width: '78%' }} />
          </View>

          {/* Tags */}
          <View style={styles.tagsRow}>
            <SkeletonBox height={28} borderRadius={radius.full} baseColor={LIGHT_BASE} shimmerColor={LIGHT_SHIMMER} style={{ width: 72 }} />
            <SkeletonBox height={28} borderRadius={radius.full} baseColor={LIGHT_BASE} shimmerColor={LIGHT_SHIMMER} style={{ width: 60 }} />
            <SkeletonBox height={28} borderRadius={radius.full} baseColor={LIGHT_BASE} shimmerColor={LIGHT_SHIMMER} style={{ width: 80 }} />
          </View>

          {/* Action buttons */}
          <View style={styles.actionsRow}>
            <SkeletonBox height={44} borderRadius={radius.xl} baseColor={BTN_BASE} shimmerColor={LIGHT_SHIMMER} style={{ flex: 1 }} />
            <SkeletonBox height={44} borderRadius={radius.xl} baseColor={BTN_BASE} shimmerColor={LIGHT_SHIMMER} style={{ flex: 1 }} />
            <SkeletonBox height={44} borderRadius={radius.xl} baseColor={BTN_BASE} shimmerColor={LIGHT_SHIMMER} style={{ flex: 1 }} />
          </View>

          <View style={styles.divider} />

          {/* Gallery header */}
          <View style={styles.galleryHeader}>
            <SkeletonBox height={11} borderRadius={radius.sm} baseColor={LIGHT_BASE} shimmerColor={LIGHT_SHIMMER} style={{ width: 60 }} />
          </View>

          {/* Gallery 2-column grid */}
          <View style={styles.galleryGrid}>
            {[0, 1, 2, 3].map(i => (
              <SkeletonBox
                key={i}
                height={GALLERY_ITEM_SIZE}
                borderRadius={radius.lg}
                baseColor={LIGHT_BASE}
                shimmerColor={LIGHT_SHIMMER}
                style={{ width: GALLERY_ITEM_SIZE }}
              />
            ))}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
