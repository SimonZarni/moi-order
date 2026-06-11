import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator, Animated, Dimensions, Image,
  Modal, PanResponder, Pressable, Text, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import { colours } from '../../../shared/theme/colours';
import { styles } from './CoverPhotoCropModal.styles';

const { width: SCREEN_W } = Dimensions.get('window');
const CROP_ASPECT = 16 / 9;
const CROP_W = SCREEN_W;
const CROP_H = Math.round(CROP_W / CROP_ASPECT);

interface Props {
  uri: string;
  imageWidth: number;
  imageHeight: number;
  onCrop: (uri: string) => void;
  onCancel: () => void;
}

export function CoverPhotoCropModal({ uri, imageWidth, imageHeight, onCrop, onCancel }: Props): React.JSX.Element {
  // Scale image to cover the 16:9 crop box (fill mode — no empty space).
  const scale = Math.max(CROP_W / imageWidth, CROP_H / imageHeight);
  const displayW = Math.round(imageWidth * scale);
  const displayH = Math.round(imageHeight * scale);

  // Initial position: image centered within the crop box.
  const initX = (CROP_W - displayW) / 2;
  const initY = (CROP_H - displayH) / 2;

  // Animated values drive the image position without causing React re-renders on every frame.
  const animX = useRef(new Animated.Value(0)).current;
  const animY = useRef(new Animated.Value(0)).current;

  // Refs track the mutable pan state accessed inside PanResponder callbacks.
  const startPos = useRef({ x: initX, y: initY });
  const currentPos = useRef({ x: initX, y: initY });

  const [isCropping, setIsCropping] = useState(false);
  const isCroppingRef = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startPos.current = { ...currentPos.current };
      },
      onPanResponderMove: (_, g) => {
        const newX = Math.max(CROP_W - displayW, Math.min(0, startPos.current.x + g.dx));
        const newY = Math.max(CROP_H - displayH, Math.min(0, startPos.current.y + g.dy));
        currentPos.current = { x: newX, y: newY };
        // Translate is relative to the initial position embedded in `left`/`top`.
        animX.setValue(newX - initX);
        animY.setValue(newY - initY);
      },
    }),
  ).current;

  const handleCrop = useCallback(async () => {
    if (isCroppingRef.current) return;
    isCroppingRef.current = true;
    setIsCropping(true);

    const { x, y } = currentPos.current;
    // Convert display-pixel offset to original-pixel crop coordinates.
    const originX = Math.max(0, -x / scale);
    const originY = Math.max(0, -y / scale);
    const cropWidth  = Math.min(CROP_W / scale, imageWidth  - originX);
    const cropHeight = Math.min(CROP_H / scale, imageHeight - originY);

    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ crop: { originX, originY, width: cropWidth, height: cropHeight } }],
        { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG },
      );
      onCrop(result.uri);
    } catch {
      isCroppingRef.current = false;
      setIsCropping(false);
    }
  }, [uri, imageWidth, imageHeight, scale, onCrop]);

  return (
    <Modal visible animationType="slide" transparent={false} statusBarTranslucent onRequestClose={onCancel}>
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable style={styles.headerBtn} onPress={onCancel} accessibilityRole="button" accessibilityLabel="Cancel crop">
            <Ionicons name="close" size={22} color={colours.white} />
          </Pressable>
          <Text style={styles.headerTitle}>Adjust Cover Photo</Text>
          <View style={styles.headerSpacer} />
        </View>

        <Text style={styles.hint}>Drag to reposition · 16:9</Text>

        <View style={styles.viewportWrap}>
          <View style={[styles.viewport, { height: CROP_H }]} {...panResponder.panHandlers}>
            <Animated.View
              pointerEvents="none"
              style={{
                width: displayW,
                height: displayH,
                position: 'absolute',
                left: initX,
                top: initY,
                transform: [{ translateX: animX }, { translateY: animY }],
              }}
            >
              <Image source={{ uri }} style={{ width: displayW, height: displayH }} resizeMode="cover" />
            </Animated.View>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            style={styles.cancelBtn}
            onPress={onCancel}
            disabled={isCropping}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable
            style={[styles.cropBtn, isCropping && styles.cropBtnDisabled]}
            onPress={handleCrop}
            disabled={isCropping}
            accessibilityRole="button"
            accessibilityLabel="Crop and use photo"
          >
            {isCropping
              ? <ActivityIndicator size="small" color={colours.white} />
              : <Text style={styles.cropText}>Crop & Use</Text>
            }
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
