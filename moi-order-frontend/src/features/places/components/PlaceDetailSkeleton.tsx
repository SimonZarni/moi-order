/**
 * Principle: SRP — renders a full-page shimmer skeleton mirroring PlaceDetailScreen's layout.
 * Sections match the real screen in order: hero → identity card → details → tags → about.
 * Light baseColor (#e9edf2) suits the white card surfaces; dark color for the hero block.
 */
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SkeletonBox } from '@/shared/components/SkeletonBox/SkeletonBox';
import { radius } from '@/shared/theme/radius';
import { styles } from './PlaceDetailSkeleton.styles';

const LIGHT_BASE = '#e9edf2';
const LIGHT_SHIMMER = 'rgba(255,255,255,0.7)';

function SectionCard({ rows }: { rows: Array<{ width: `${number}%` }> }): React.JSX.Element {
  return (
    <View style={styles.sectionCard}>
      {/* Section label */}
      <SkeletonBox height={11} borderRadius={radius.sm} baseColor={LIGHT_BASE} shimmerColor={LIGHT_SHIMMER} style={{ width: '25%' }} />
      <View style={styles.sectionRows}>
        {rows.map(({ width }, i) => (
          <SkeletonBox
            key={i}
            height={13}
            borderRadius={radius.sm}
            baseColor={LIGHT_BASE}
            shimmerColor={LIGHT_SHIMMER}
            style={{ width }}
          />
        ))}
      </View>
    </View>
  );
}

export function PlaceDetailSkeleton(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        scrollEnabled={false}
      >
        {/* ── Hero image block ─────────────────────────────────────────────── */}
        <SkeletonBox
          height={300}
          baseColor="#1a2e2c"
          shimmerColor="rgba(255,255,255,0.05)"
        />

        {/* ── Identity card (overlaps hero by -32) ─────────────────────────── */}
        <View style={styles.identityCard}>
          {/* Category badge */}
          <SkeletonBox height={24} borderRadius={radius.full} baseColor={LIGHT_BASE} shimmerColor={LIGHT_SHIMMER} style={{ width: 80 }} />
          {/* Place name — my */}
          <SkeletonBox height={22} borderRadius={radius.sm} baseColor={LIGHT_BASE} shimmerColor={LIGHT_SHIMMER} style={{ width: '70%' }} />
          {/* Place name — en */}
          <SkeletonBox height={15} borderRadius={radius.sm} baseColor={LIGHT_BASE} shimmerColor={LIGHT_SHIMMER} style={{ width: '45%' }} />
          {/* City row */}
          <SkeletonBox height={12} borderRadius={radius.sm} baseColor={LIGHT_BASE} shimmerColor={LIGHT_SHIMMER} style={{ width: '30%' }} />
        </View>

        {/* ── Details section ───────────────────────────────────────────────── */}
        <SectionCard rows={[{ width: '80%' }, { width: '65%' }, { width: '55%' }]} />

        {/* ── Tags section ──────────────────────────────────────────────────── */}
        <SectionCard rows={[{ width: '90%' }]} />

        {/* ── About section ─────────────────────────────────────────────────── */}
        <SectionCard rows={[{ width: '100%' }, { width: '95%' }, { width: '85%' }, { width: '60%' }]} />
      </ScrollView>
    </SafeAreaView>
  );
}
