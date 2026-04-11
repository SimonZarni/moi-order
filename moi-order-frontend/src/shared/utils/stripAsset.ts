import { ImagePickerAsset } from 'expo-image-picker';

/**
 * Returns a lean copy of an ImagePickerAsset with the `base64` field removed.
 *
 * expo-image-picker can attach a `base64` string to the asset even when you
 * don't request it (depending on Expo SDK version). Storing that in React state
 * makes every re-render serialise potentially several MB of data, causing the
 * visible UI lag on the DocumentPickerField green-tick transition and the freeze
 * on submit when Axios builds the FormData payload.
 *
 * We only ever send files by URI (React Native's native FormData bridge picks
 * up the file from the filesystem via the uri), so base64 on the state object
 * is never needed.
 */
export function stripAsset(asset: ImagePickerAsset): ImagePickerAsset {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { base64: _, ...lean } = asset as ImagePickerAsset & { base64?: string };
  return lean as ImagePickerAsset;
}