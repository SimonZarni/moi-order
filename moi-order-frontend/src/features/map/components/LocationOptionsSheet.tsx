import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { styles } from './LocationOptionsSheet.styles';

interface Props {
  visible:          boolean;
  hasGPS:           boolean;
  onUseCurrentGPS:  () => void;
  onUseMapLocation: () => void;
  onDismiss:        () => void;
}

export function LocationOptionsSheet({
  visible, hasGPS, onUseCurrentGPS, onUseMapLocation, onDismiss,
}: Props): React.JSX.Element {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss}>
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />
          <Text style={styles.title}>Set Location</Text>
          <Text style={styles.subtitle}>
            Choose how to define your origin for Nearby places and directions.
          </Text>

          <Pressable onPress={onUseCurrentGPS} disabled={!hasGPS}
            style={[styles.option, !hasGPS && styles.optionDisabled]}
            accessibilityRole="button" accessibilityLabel="Use my current GPS location">
            <View style={styles.optionIcon}>
              <Text style={styles.optionEmoji}>📍</Text>
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Use Current Location</Text>
              <Text style={styles.optionSub}>
                {hasGPS ? 'Set origin to your real GPS position' : 'GPS not available — enable location access'}
              </Text>
            </View>
            {hasGPS && <Text style={styles.optionArrow}>›</Text>}
          </Pressable>

          <View style={styles.divider} />

          <Pressable onPress={onUseMapLocation} style={styles.option}
            accessibilityRole="button" accessibilityLabel="Use the map location I long-pressed">
            <View style={[styles.optionIcon, styles.optionIconMap]}>
              <Text style={styles.optionEmoji}>🗺</Text>
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Use This Map Location</Text>
              <Text style={styles.optionSub}>Set origin to the point you held on the map</Text>
            </View>
            <Text style={styles.optionArrow}>›</Text>
          </Pressable>

          <Pressable onPress={onDismiss} style={styles.cancelBtn}
            accessibilityRole="button" accessibilityLabel="Cancel">
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
