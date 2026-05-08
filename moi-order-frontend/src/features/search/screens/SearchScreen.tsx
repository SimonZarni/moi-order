import React from 'react';
import {
  ActivityIndicator, FlatList, Pressable, ScrollView,
  Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useSearchScreen, SearchTab, SearchResult } from '../hooks/useSearchScreen';
import { useStrings } from '@/shared/i18n';
import { styles } from './SearchScreen.styles';

const TYPE_BADGE: Record<string, string> = {
  place:   '📍',
  ticket:  '🎟',
  service: '⚙️',
};

export function SearchScreen(): React.JSX.Element {
  const {
    query, activeTab, results, isLoading,
    handleQueryChange, handleTabChange, handleResultPress, handleBack,
  } = useSearchScreen();
  const s = useStrings();

  const TABS: { key: SearchTab; label: string }[] = [
    { key: 'all',      label: s.search.all      },
    { key: 'places',   label: s.search.places   },
    { key: 'tickets',  label: s.search.tickets  },
    { key: 'services', label: s.search.services },
  ];

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backBtn}
          accessibilityRole="button" accessibilityLabel={s.common.back}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={handleQueryChange}
          placeholder={s.search.placeholder}
          placeholderTextColor={styles.placeholder.color}
          autoFocus
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          accessibilityLabel={s.common.search}
        />
        {query.length > 0 && (
          <Pressable onPress={() => handleQueryChange('')} style={styles.clearBtn}
            accessibilityRole="button" accessibilityLabel={s.common.clear}>
            <Text style={styles.clearText}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Tabs — horizontal scroll so long MM/TH labels don't overflow */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsRow}
        style={styles.tabsScroll}
      >
        {TABS.map(tab => (
          <Pressable key={tab.key} onPress={() => handleTabChange(tab.key)}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            accessibilityRole="button" accessibilityLabel={tab.label}>
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.body}>
        {isLoading && query.length > 0 && (
          <ActivityIndicator style={styles.loader} color={styles.loaderColor.color} />
        )}

        {!isLoading && query.trim().length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>{s.search.searchAll}</Text>
            <Text style={styles.emptySubtitle}>{s.search.searchAllSub}</Text>
          </View>
        )}

        {!isLoading && query.trim().length > 0 && results.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>😕</Text>
            <Text style={styles.emptyTitle}>{s.search.noResults}</Text>
            <Text style={styles.emptySubtitle}>{s.search.noResultsSub}</Text>
          </View>
        )}

        <FlatList
          data={results}
          keyExtractor={(item: SearchResult) => `${item.type}-${item.id}`}
          renderItem={({ item }) => (
            <Pressable style={styles.resultRow} onPress={() => handleResultPress(item)}
              accessibilityRole="button" accessibilityLabel={item.title}>
              <View style={styles.thumb}>
                {item.image
                  ? <Image source={{ uri: item.image }} style={styles.thumbImg} contentFit="cover" />
                  : <Text style={styles.thumbEmoji}>{TYPE_BADGE[item.type]}</Text>
                }
              </View>
              <View style={styles.resultText}>
                <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
                {item.subtitle ? (
                  <Text style={styles.resultSubtitle} numberOfLines={1}>{item.subtitle}</Text>
                ) : null}
              </View>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>{item.type}</Text>
              </View>
            </Pressable>
          )}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          accessibilityRole="list"
        />
      </View>
    </SafeAreaView>
  );
}
