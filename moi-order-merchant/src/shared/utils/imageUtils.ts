import { Platform } from 'react-native';
import type { ImagePickerAsset } from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

export interface NormalizedImage {
  uri: string;
  name: string;
  type: string;
}

const HEIC_TYPES = new Set(['image/heic', 'image/heif']);

// Normalizes any picked image to a format compatible with every upload target:
// - Native + HEIC/HEIF: ImageManipulator re-encodes to JPEG (iOS handles HEIC
//   natively, but some server finfo installs misidentify it; JPEG is universal).
// - Web + HEIC/HEIF: heic2any converts to JPEG (Chrome/Firefox cannot decode HEIC).
// - All other formats: returned as-is with the correct MIME type.
export async function normalizePickedImage(
  asset: ImagePickerAsset,
  baseName = 'photo',
): Promise<NormalizedImage> {
  const mimeType = (asset.mimeType ?? '').toLowerCase();
  const isHeic = HEIC_TYPES.has(mimeType);

  if (Platform.OS !== 'web') {
    if (isHeic) {
      const ctx = ImageManipulator.manipulate(asset.uri);
      const rendered = await ctx.renderAsync();
      const saved = await rendered.saveAsync({ compress: 0.85, format: SaveFormat.JPEG });
      return { uri: saved.uri, name: `${baseName}.jpg`, type: 'image/jpeg' };
    }
    const ext = mimeType ? (mimeType.split('/')[1] ?? 'jpg') : 'jpg';
    return {
      uri: asset.uri,
      name: asset.fileName ?? `${baseName}.${ext}`,
      type: mimeType || 'image/jpeg',
    };
  }

  if (isHeic) {
    const heic2any = (await import('heic2any')).default;
    const srcBlob = await fetch(asset.uri).then((r) => r.blob());
    const converted = await heic2any({ blob: srcBlob, toType: 'image/jpeg', quality: 0.85 });
    const jpegBlob = Array.isArray(converted) ? converted[0] : converted;
    return {
      uri: URL.createObjectURL(jpegBlob),
      name: `${baseName}.jpg`,
      type: 'image/jpeg',
    };
  }

  const ext = mimeType ? (mimeType.split('/')[1] ?? 'jpg') : 'jpg';
  return {
    uri: asset.uri,
    name: asset.fileName ?? `${baseName}.${ext}`,
    type: mimeType || 'image/jpeg',
  };
}
