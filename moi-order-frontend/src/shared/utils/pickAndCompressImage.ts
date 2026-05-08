import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

import { useLocaleStore } from '@/shared/store/localeStore';
import { getStrings } from '@/shared/i18n';
import { stripAsset } from './stripAsset';

/**
 * Shared image picker + compressor used by all service submission forms.
 *
 * Picks at full quality, then scales down to ≤2048 px on the longer side and
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
    mediaTypes: ['images'],
    quality:    1,
    allowsEditing: false,
    base64: false,
  });

  if (result.canceled || result.assets.length === 0) return null;
  const asset = result.assets[0];
  if (asset == null) return null;

  const MAX_DIM = 2048;
  const ctx = ImageManipulator.manipulate(asset.uri);
  if (asset.width > MAX_DIM || asset.height > MAX_DIM) {
    ctx.resize(asset.width >= asset.height ? { width: MAX_DIM } : { height: MAX_DIM });
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
