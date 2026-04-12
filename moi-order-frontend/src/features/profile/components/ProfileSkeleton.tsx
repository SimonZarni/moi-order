/**
 * Principle: SRP — full-screen shimmer placeholder matching ProfileScreen's
 * hero + body layout. Dark base for the hero section, light base for body cards.
 */
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SkeletonBox } from '@/shared/components/SkeletonBox/SkeletonBox';
import { radius } from '@/shared/theme/radius';
import { styles } from './ProfileSkeleton.styles';

// Dark-hero shimmer tokens
const DARK_BASE    = '#1a2e2c';
const DARK_SHIMMER = 'rgba(255,255,255,0.06)';

// Light-body shimmer tokens
const LIGHT_BASE    = '#e2e8f0';
const LIGHT_SHIMMER = 'rgba(255,255,255,0.65)';

function SkeletonRow(): React.JSX.Element {
  return (
    <View style={styles.row}>
      {/* Icon badge */}
      <SkeletonBox height={34} borderRadius={radius.md} baseColor={LIGHT_BASE} shimmerColor={LIGHT_SHIMMER} style={{ width: 34 }} />
      {/* Label */}
      <SkeletonBox height={13} borderRadius={radius.sm} baseColor={LIGHT_BASE} shimmerColor={LIGHT_SHIMMER} style={{ flex: 1 }} />
    </View>
  );
}

export function ProfileSkeleton(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* ── Hero ── */}
      <View style={styles.hero}>
        {/* Avatar ring + circle */}
        <View style={styles.avatarRing}>
          <SkeletonBox height={80} borderRadius={40} baseColor={DARK_BASE} shimmerColor={DARK_SHIMMER} style={{ width: 80 }} />
        </View>
        {/* Name line */}
        <SkeletonBox height={18} borderRadius={radius.sm} baseColor={DARK_BASE} shimmerColor={DARK_SHIMMER} style={{ width: 160, marginBottom: 8 }} />
        {/* Email line */}
        <SkeletonBox height={12} borderRadius={radius.sm} baseColor={DARK_BASE} shimmerColor={DARK_SHIMMER} style={{ width: 120, marginBottom: 6 }} />
        {/* Member since */}
        <SkeletonBox height={10} borderRadius={radius.sm} baseColor={DARK_BASE} shimmerColor={DARK_SHIMMER} style={{ width: 90 }} />
      </View>

      {/* ── Body ── */}
      <View style={styles.body}>

        {/* § Personal Info */}
        <View style={styles.sectionRow}>
          <SkeletonBox height={10} borderRadius={radius.sm} baseColor={LIGHT_BASE} shimmerColor={LIGHT_SHIMMER} style={{ width: 90 }} />
          <View style={styles.sectionLine} />
        </View>
        <View style={styles.card}>
          <SkeletonRow />
          <SkeletonRow />
        </View>

        {/* § Activity */}
        <View style={styles.sectionRow}>
          <SkeletonBox height={10} borderRadius={radius.sm} baseColor={LIGHT_BASE} shimmerColor={LIGHT_SHIMMER} style={{ width: 60 }} />
          <View style={styles.sectionLine} />
        </View>
        <View style={styles.card}>
          <SkeletonRow />
        </View>

        {/* § Security */}
        <View style={styles.sectionRow}>
          <SkeletonBox height={10} borderRadius={radius.sm} baseColor={LIGHT_BASE} shimmerColor={LIGHT_SHIMMER} style={{ width: 65 }} />
          <View style={styles.sectionLine} />
        </View>
        <View style={styles.card}>
          <SkeletonRow />
        </View>

        {/* § Legal */}
        <View style={styles.sectionRow}>
          <SkeletonBox height={10} borderRadius={radius.sm} baseColor={LIGHT_BASE} shimmerColor={LIGHT_SHIMMER} style={{ width: 40 }} />
          <View style={styles.sectionLine} />
        </View>
        <View style={styles.card}>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </View>

      </View>
    </SafeAreaView>
  );
}
