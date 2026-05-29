/**
 * Principle: SRP — renders a scrollable micro-bar time-series chart.
 * Accepts an array of points with label + two series (revenue + orders).
 */
import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles } from './TimeSeriesChart.styles';
import { colours } from '../../../shared/theme/colours';
import type { AnalyticsChartPoint } from '../../../types/models';

interface TimeSeriesChartProps {
  points: AnalyticsChartPoint[];
  trackHeight?: number;
  emptyMessage?: string;
}

type Series = 'revenue' | 'orders';

const SERIES_COLOUR: Record<Series, string> = {
  revenue: colours.primary,
  orders:  colours.info,
};

const DEFAULT_TRACK = 100;

export function TimeSeriesChart({ points, trackHeight = DEFAULT_TRACK, emptyMessage }: TimeSeriesChartProps): React.JSX.Element {
  const [activeSeries, setActiveSeries] = useState<Series>('revenue');

  const values = points.map((p) =>
    activeSeries === 'revenue' ? p.revenue_cents : p.order_count,
  );
  const maxVal = Math.max(...values, 1);
  const hasData = values.some((v) => v > 0);
  const colour  = SERIES_COLOUR[activeSeries];

  return (
    <View style={styles.root}>
      {/* Toggle: Revenue vs Orders */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {(['revenue', 'orders'] as Series[]).map((s) => (
          <Text
            key={s}
            onPress={() => setActiveSeries(s)}
            style={[
              styles.sectionLabel,
              activeSeries === s && { color: SERIES_COLOUR[s], textDecorationLine: 'underline' as const },
            ]}
          >
            {s === 'revenue' ? '฿ Revenue' : '# Orders'}
          </Text>
        ))}
      </View>

      {!hasData && emptyMessage !== undefined ? (
        <Text style={styles.emptyMessage}>{emptyMessage}</Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { height: trackHeight + 40 }]}
        >
          {points.map((point, i) => {
            const val  = activeSeries === 'revenue' ? point.revenue_cents : point.order_count;
            const barH = val > 0 ? Math.max((val / maxVal) * trackHeight, 4) : 0;

            return (
              <View key={i} style={styles.barCol}>
                <View style={[styles.trackSlot, { height: trackHeight }]}>
                  {val > 0 && (
                    <Text style={[styles.valueLabel, { bottom: barH + 4 }]}>
                      {activeSeries === 'revenue'
                        ? `฿${Math.round(val / 100).toLocaleString()}`
                        : String(val)}
                    </Text>
                  )}
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: barH || 2,
                        backgroundColor: barH > 0 ? colour : colours.divider,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel} numberOfLines={1}>{point.label}</Text>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
