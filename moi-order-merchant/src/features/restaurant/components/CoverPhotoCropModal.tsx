import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import {
  ActivityIndicator, Image, Modal, PanResponder,
  Pressable, StyleSheet, Text, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import { colours } from '../../../shared/theme/colours';
import { styles } from './CoverPhotoCropModal.styles';

const CROP_ASPECT = 16 / 9;
const HANDLE_SIZE = 14;   // visual px — must match styles.handle width/height
const HANDLE_HIT  = 40;   // touch/click hit radius for corners
const MIN_CROP_W  = 80;

interface CropBox {
  x: number; // px from rendered-image left edge
  y: number; // px from rendered-image top edge
  w: number; // h is always w / CROP_ASPECT
}

interface RenderedInfo {
  imgW: number; imgH: number;
  offsetX: number; offsetY: number; // image origin within container
  scale: number;                     // display px / original px
}

type DragMode = 'move' | 'tl' | 'tr' | 'bl' | 'br';

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

// touchX/Y are relative to the overlay view (= container).
function detectMode(tx: number, ty: number, box: CropBox, off: RenderedInfo): DragMode | null {
  const L = off.offsetX + box.x;
  const T = off.offsetY + box.y;
  const R = L + box.w;
  const B = T + box.w / CROP_ASPECT;
  const hit = HANDLE_HIT / 2;
  if (Math.abs(tx - L) <= hit && Math.abs(ty - T) <= hit) return 'tl';
  if (Math.abs(tx - R) <= hit && Math.abs(ty - T) <= hit) return 'tr';
  if (Math.abs(tx - L) <= hit && Math.abs(ty - B) <= hit) return 'bl';
  if (Math.abs(tx - R) <= hit && Math.abs(ty - B) <= hit) return 'br';
  if (tx >= L && tx <= R && ty >= T && ty <= B) return 'move';
  return null;
}

interface Props {
  uri: string;
  imageWidth: number;
  imageHeight: number;
  onCrop: (uri: string) => void;
  onCancel: () => void;
}

export function CoverPhotoCropModal({ uri, imageWidth, imageHeight, onCrop, onCancel }: Props): React.JSX.Element {
  const [containerSize, setContainerSize] = useState<{ w: number; h: number } | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [, forceRender] = useReducer(n => n + 1, 0);

  const renderedRef   = useRef<RenderedInfo | null>(null);
  const cropBoxRef    = useRef<CropBox | null>(null);
  const isCroppingRef = useRef(false);
  const dragRef       = useRef<{ mode: DragMode; startBox: CropBox } | null>(null);

  // Recompute rendered image layout whenever the container is resized.
  useEffect(() => {
    if (!containerSize) return;
    const scale  = Math.min(containerSize.w / imageWidth, containerSize.h / imageHeight);
    const imgW   = imageWidth  * scale;
    const imgH   = imageHeight * scale;
    const offsetX = (containerSize.w - imgW) / 2;
    const offsetY = (containerSize.h - imgH) / 2;
    renderedRef.current = { imgW, imgH, offsetX, offsetY, scale };

    // Initialise crop box only on the first measure.
    if (!cropBoxRef.current) {
      // Largest 16:9 box that fits within 85% of the rendered image.
      const w = Math.min(imgW * 0.85, imgH * CROP_ASPECT * 0.85);
      const h = w / CROP_ASPECT;
      cropBoxRef.current = { x: (imgW - w) / 2, y: (imgH - h) / 2, w };
      forceRender();
    }
  }, [containerSize, imageWidth, imageHeight]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  () => true,
      onPanResponderGrant: (e) => {
        const off = renderedRef.current;
        const box = cropBoxRef.current;
        if (!off || !box) return;
        const mode = detectMode(e.nativeEvent.locationX, e.nativeEvent.locationY, box, off);
        if (!mode) return;
        dragRef.current = { mode, startBox: { ...box } };
      },
      onPanResponderMove: (_, g) => {
        const off  = renderedRef.current;
        const drag = dragRef.current;
        if (!off || !drag) return;
        const { mode, startBox: sb } = drag;
        const { imgW, imgH } = off;
        let { x, y, w } = sb;

        if (mode === 'move') {
          x = clamp(sb.x + g.dx, 0, imgW - sb.w);
          y = clamp(sb.y + g.dy, 0, imgH - sb.w / CROP_ASPECT);
        } else if (mode === 'br') {
          w = clamp(sb.w + g.dx, MIN_CROP_W, Math.min(imgW - sb.x, (imgH - sb.y) * CROP_ASPECT));
          x = sb.x; y = sb.y;
        } else if (mode === 'bl') {
          const nw = clamp(sb.w - g.dx, MIN_CROP_W, Math.min(sb.x + sb.w, (imgH - sb.y) * CROP_ASPECT));
          x = sb.x + sb.w - nw; y = sb.y; w = nw;
        } else if (mode === 'tr') {
          const nw = clamp(sb.w + g.dx, MIN_CROP_W, imgW - sb.x);
          const ny = sb.y + sb.w / CROP_ASPECT - nw / CROP_ASPECT;
          if (ny >= 0) { y = ny; w = nw; } else { w = sb.y * CROP_ASPECT + sb.w; y = 0; }
          x = sb.x;
        } else { // tl
          const nw = clamp(sb.w - g.dx, MIN_CROP_W, sb.x + sb.w);
          const ny = sb.y + sb.w / CROP_ASPECT - nw / CROP_ASPECT;
          const nx = sb.x + sb.w - nw;
          if (nx >= 0 && ny >= 0) { x = nx; y = ny; w = nw; }
        }

        cropBoxRef.current = { x, y, w };
        forceRender();
      },
      onPanResponderRelease:   () => { dragRef.current = null; },
      onPanResponderTerminate: () => { dragRef.current = null; },
    }),
  ).current;

  const handleCrop = useCallback(async () => {
    if (isCroppingRef.current) return;
    const off = renderedRef.current;
    const box = cropBoxRef.current;
    if (!off || !box) return;
    isCroppingRef.current = true;
    setIsCropping(true);
    const originX = clamp(Math.round(box.x / off.scale), 0, imageWidth  - 1);
    const originY = clamp(Math.round(box.y / off.scale), 0, imageHeight - 1);
    const cropW   = clamp(Math.round(box.w / off.scale),             1, imageWidth  - originX);
    const cropH   = clamp(Math.round(box.w / CROP_ASPECT / off.scale), 1, imageHeight - originY);
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ crop: { originX, originY, width: cropW, height: cropH } }],
        { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG },
      );
      onCrop(result.uri);
    } catch {
      isCroppingRef.current = false;
      setIsCropping(false);
    }
  }, [uri, imageWidth, imageHeight, onCrop]);

  const box  = cropBoxRef.current;
  const off  = renderedRef.current;
  const boxH = box ? box.w / CROP_ASPECT : 0;
  const hs   = HANDLE_SIZE / 2;

  return (
    <Modal visible animationType="slide" transparent={false} statusBarTranslucent onRequestClose={onCancel}>
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>

        <View style={styles.header}>
          <Pressable style={styles.headerBtn} onPress={onCancel} accessibilityRole="button" accessibilityLabel="Cancel">
            <Ionicons name="close" size={22} color={colours.white} />
          </Pressable>
          <Text style={styles.headerTitle}>Crop Cover Photo</Text>
          <View style={styles.headerSpacer} />
        </View>

        <Text style={styles.hint}>Drag to move · drag corners to resize</Text>

        <View
          style={styles.imageContainer}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setContainerSize({ w: width, h: height });
          }}
        >
          {containerSize && (
            <Image
              source={{ uri }}
              style={{ width: containerSize.w, height: containerSize.h }}
              resizeMode="contain"
            />
          )}

          {box && off && (
            <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers}>
              {/* Dimmed panels outside crop box */}
              <View style={[styles.dim, { left: 0, top: 0, right: 0, height: off.offsetY + box.y }]} />
              <View style={[styles.dim, { left: 0, right: 0, top: off.offsetY + box.y + boxH, bottom: 0 }]} />
              <View style={[styles.dim, { left: 0, top: off.offsetY + box.y, width: off.offsetX + box.x, height: boxH }]} />
              <View style={[styles.dim, {
                left: off.offsetX + box.x + box.w, right: 0,
                top: off.offsetY + box.y, height: boxH,
              }]} />

              {/* Crop rectangle with rule-of-thirds guides */}
              <View style={[styles.cropBorder, {
                left: off.offsetX + box.x, top: off.offsetY + box.y,
                width: box.w, height: boxH,
              }]}>
                <View style={[styles.ruleV, { left: '33.33%' }]} />
                <View style={[styles.ruleV, { left: '66.66%' }]} />
                <View style={[styles.ruleH, { top:  '33.33%' }]} />
                <View style={[styles.ruleH, { top:  '66.66%' }]} />
              </View>

              {/* Corner handles */}
              {(['tl', 'tr', 'bl', 'br'] as const).map((c) => {
                const left = c === 'tl' || c === 'bl';
                const top  = c === 'tl' || c === 'tr';
                return (
                  <View key={c} style={[styles.handle, {
                    left: off.offsetX + box.x + (left ? -hs : box.w - hs),
                    top:  off.offsetY + box.y + (top  ? -hs : boxH  - hs),
                  }]} />
                );
              })}
            </View>
          )}
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
