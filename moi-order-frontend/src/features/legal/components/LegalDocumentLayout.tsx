import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { FloatingTabBar } from '@/shared/components/FloatingTabBar/FloatingTabBar';
import { StickyBackButton } from '@/shared/components/StickyBackButton/StickyBackButton';
import type { LegalSection } from '@/features/legal/types';
import { styles } from './LegalDocumentLayout.styles';

interface LegalDocumentLayoutProps {
  accentColor: string;
  emoji: string;
  eyebrow: string;
  title: string;
  effectiveDate: string;
  sections: LegalSection[];
  onBack: () => void;
}

export function LegalDocumentLayout({
  accentColor,
  emoji,
  eyebrow,
  title,
  effectiveDate,
  sections,
  onBack,
}: LegalDocumentLayoutProps): React.JSX.Element {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StickyBackButton onPress={onBack} label="Back" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={styles.orbLarge} />
          <View style={styles.orbSmall} />

          <View style={styles.heroContent}>
            <Text style={[styles.eyebrow, { color: accentColor }]}>{eyebrow}</Text>
            <Text style={styles.heroTitle}>{title}</Text>
            <Text style={styles.effectiveDateLabel}>Effective {effectiveDate}</Text>
          </View>

          <Text style={styles.emojiWatermark}>{emoji}</Text>
        </View>

        {/* ── Body ── */}
        <View style={styles.body}>
          {sections.map((section) => (
            <View key={section.heading} style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <View style={[styles.sectionAccentBar, { backgroundColor: accentColor }]} />
                <Text style={[styles.sectionHeading, { color: accentColor }]}>
                  {section.heading}
                </Text>
              </View>
              <Text style={styles.sectionBody}>{section.body}</Text>
            </View>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerCompany}>Trusted Brothers Company Limited</Text>
            <Text style={styles.footerContact}>hello@moiorder.com</Text>
          </View>
        </View>

      </ScrollView>
      <FloatingTabBar />
    </SafeAreaView>
  );
}
