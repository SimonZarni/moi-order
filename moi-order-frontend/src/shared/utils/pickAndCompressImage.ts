import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

import { useLocaleStore } from '@/shared/store/localeStore';
import { getStrings } from '@/shared/i18n';
import { stripAsset } from './stripAsset';

// NOTE: localeStore → client.ts → (no i18n import now) so no cycle here.

// EXIF orientation → clockwise rotation degrees needed to make pixels upright.
// expo-image-manipulator strips the EXIF tag when it re-encodes but does NOT
// physically rotate pixels for ph:// assets on iOS. Without this map we'd send
// sideways pixel data to the server even though the gallery showed it correctly.
const EXIF_ROTATION: Record<number, number> = { 3: 180, 6: 90, 8: -90 };

/**
 * Shared image picker + compressor used by all service submission forms.
 *
 * Picks at full quality, reads the EXIF orientation tag, physically rotates the
 * pixels to match, then scales down to ≤2048 px on the longer side and
 * re-encodes at JPEG 0.7 — keeps document photos readable while staying well
 * under the 12 MB per-file and 50 MB total server limits.
 */
export async function pickAndCompressImage(
  onPermissionDenied: (message: string) => void,
): Promise<ImagePicker.ImagePickerAsset | null> {
  const { granted } = await ImagePicker.getMediaLibraryPermissionsAsync();
  if (!granted) {
    const request = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!request.granted) {
      const s = getStrings(useLocaleStore.getState().locale);
      onPermissionDenied(s.upload.photoLibraryRequired);
      return null;
    }
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes:    ['images'],
    quality:       1,
    allowsEditing: false,
    base64:        false,
    exif:          true, // needed to read Orientation tag before manipulator strips it
  });

  if (result.canceled || result.assets.length === 0) return null;
  const asset = result.assets[0];
  if (asset == null) return null;

  const exifOrientation = (asset.exif?.Orientation as number | undefined) ?? 1;
  const rotateDeg = EXIF_ROTATION[exifOrientation] ?? 0;

  // After a 90°/-90° rotation, width and height swap. Use the corrected
  // dimensions for the resize decision so we pick the right axis.
  const isTransposed = rotateDeg === 90 || rotateDeg === -90;
  const logicalW = isTransposed ? asset.height : asset.width;
  const logicalH = isTransposed ? asset.width  : asset.height;

  const MAX_DIM = 2048;
  const ctx = ImageManipulator.manipulate(asset.uri);
  if (rotateDeg !== 0) {
    ctx.rotate(rotateDeg);
  }
  if (logicalW > MAX_DIM || logicalH > MAX_DIM) {
    ctx.resize(logicalW >= logicalH ? { width: MAX_DIM } : { height: MAX_DIM });
  }
  const rendered = await ctx.renderAsync();
  const compressed = await rendered.saveAsync({ compress: 0.7, format: SaveFormat.JPEG });

  return stripAsset({
    ...asset,
    uri:      compressed.uri,
    width:    compressed.width,
    height:   compressed.height,
    mimeType: 'image/jpeg',
  });
}
