import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

import { useLocaleStore } from '@/shared/store/localeStore';
import { getStrings } from '@/shared/i18n';
import { stripAsset } from './stripAsset';

// NOTE: localeStore → client.ts → (no i18n import now) so no cycle here.

const MAX_DIM = 2048;

/**
 * Shared image picker + compressor used by all service submission forms.
 *
 * Always resizes to ≤2048 px on the longer side and re-encodes as JPEG.
 * The mandatory resize forces expo-image-manipulator to fully decode the source
 * (including HEIC/HEIF from iPhone 16 Pro) and produce a proper JPEG rather
 * than passing through raw pixel data or the HEIC container.
 *
 * HEIC files get quality 0.5 instead of 0.7 — HEIC stores deep-colour / HDR
 * data that expands significantly when converted to 8-bit JPEG, so the extra
 * compression is needed to stay within the server's 50 MB body limit.
 *
 * EXIF orientation is handled server-side (applyExifRotation + portrait heuristic)
 * rather than client-side. Requesting exif:true from the picker causes iOS to
 * deliver the full ProRAW original from iCloud on Optimize-Storage devices,
 * producing 50 MB+ uploads for what looks like a 1.8 MB gallery photo.
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
    // exif: true intentionally omitted — on iPhone 16 Pro with iCloud Optimize
    // Storage, it triggers a download of the full ProRAW original (can be 50 MB+)
    // instead of the local HEIC proxy. EXIF rotation is handled server-side.
  });

  if (result.canceled || result.assets.length === 0) return null;
  const asset = result.assets[0];
  if (asset == null) return null;

  const mimeType = (asset.mimeType ?? '').toLowerCase();
  const isHeic   = mimeType.includes('heic') || mimeType.includes('heif');

  // HEIC deep-colour / HDR content expands significantly when converted to
  // 8-bit JPEG — use lower quality to stay within upload size limits.
  const quality = isHeic ? 0.5 : 0.7;

  const w = asset.width  > 0 ? asset.width  : MAX_DIM;
  const h = asset.height > 0 ? asset.height : MAX_DIM;

  const ctx = ImageManipulator.manipulate(asset.uri);
  // Always apply a resize — even when both dimensions are already under MAX_DIM.
  // Without at least one operation, expo-image-manipulator may pass through raw
  // HEIC data unchanged for ph:// URIs on iOS, producing huge uploads. The resize
  // forces a full decode → encode cycle that always produces a proper JPEG.
  if (w >= h) {
    ctx.resize({ width: Math.min(w, MAX_DIM) });
  } else {
    ctx.resize({ height: Math.min(h, MAX_DIM) });
  }
  const rendered   = await ctx.renderAsync();
  const compressed = await rendered.saveAsync({ compress: quality, format: SaveFormat.JPEG });

  return stripAsset({
    ...asset,
    uri:      compressed.uri,
    width:    compressed.width,
    height:   compressed.height,
    mimeType: 'image/jpeg',
  });
}
