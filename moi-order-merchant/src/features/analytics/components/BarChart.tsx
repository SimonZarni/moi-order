import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './BarChart.styles';
import { colours } from '../../../shared/theme/colours';

export interface BarChartBar {
  label: string;
  sublabel: string;
  value: number;
  valueLabel: string;
  colour: string;
}

interface BarChartProps {
  bars: BarChartBar[];
  trackHeight?: number;
  emptyMessage?: string;
}

const DEFAULT_TRACK = 120;

export function BarChart({ bars, trackHeight = DEFAULT_TRACK, emptyMessage }: BarChartProps): React.JSX.Element {
  const maxVal  = Math.max(...bars.map((b) => b.value), 1);
  const hasData = bars.some((b) => b.value > 0);

  return (
    <View style={styles.root}>
      {/* Y-axis guide lines */}
      <View style={[styles.trackArea, { height: trackHeight }]}>
        {[1, 0.5, 0].map((ratio) => (
          <View
            key={ratio}
            style={[styles.guideLine, { bottom: ratio * trackHeight }]}
          />
        ))}
      </View>

      {/* Bars */}
      <View style={[styles.barsRow, { height: trackHeight + 56 }]}>
        {bars.map((bar) => {
          const barH = bar.value > 0
            ? Math.max((bar.value / maxVal) * trackHeight, 6)
            : 0;

          return (
            <View key={bar.label} style={styles.barCol}>
              {/* Value label — sits just above the bar */}
              <View style={[styles.trackSlot, { height: trackHeight }]}>
                {bar.value > 0 && (
                  <Text style={[styles.valueLabel, { bottom: barH + 6 }]}>
                    {bar.valueLabel}
                  </Text>
                )}
                {!hasData && emptyMessage === undefined && (
                  <Text style={[styles.emptyBar, { bottom: trackHeight / 2 - 8 }]}>—</Text>
                )}
                <View
                  style={[
                    styles.barFill,
                    {
                      height: barH || 2,
                      backgroundColor: barH > 0 ? bar.colour : colours.divider,
                      borderTopLeftRadius: 6,
                      borderTopRightRadius: 6,
                    },
                  ]}
                />
              </View>

              {/* Labels below bar */}
              <Text style={styles.barLabel} numberOfLines={1}>{bar.label}</Text>
              <Text style={styles.barSublabel} numberOfLines={1}>{bar.sublabel}</Text>
            </View>
          );
        })}
      </View>

      {!hasData && emptyMessage !== undefined && (
        <Text style={styles.emptyMessage}>{emptyMessage}</Text>
      )}
    </View>
  );
}
