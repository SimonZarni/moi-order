import { useEffect } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import * as Application from 'expo-application';

import { fetchAppStoreVersion } from '@/shared/api/appUpdate';
import { IOS_BUNDLE_ID, IOS_APP_STORE_ID } from '@/shared/constants/config';

type InAppUpdatesInstance = {
  checkNeedsUpdate: (opts: object) => Promise<{ shouldUpdate: boolean }>;
  startUpdate: (opts: { updateType: number }) => Promise<void>;
};
type InAppUpdatesCtor = new (debug: boolean) => InAppUpdatesInstance;
type InAppUpdatesModule = { default: InAppUpdatesCtor; IAUUpdateKind: { IMMEDIATE: number } };

function isNewerVersion(storeVersion: string, currentVersion: string): boolean {
  const parse = (v: string): number[] => v.split('.').map(Number);
  const [sMaj = 0, sMin = 0, sPat = 0] = parse(storeVersion);
  const [cMaj = 0, cMin = 0, cPat = 0] = parse(currentVersion);
  if (sMaj !== cMaj) return sMaj > cMaj;
  if (sMin !== cMin) return sMin > cMin;
  return sPat > cPat;
}

async function checkAndroidUpdate(): Promise<void> {
  try {
    // require() instead of import so Metro doesn't touch the native module at parse time
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { default: InAppUpdates, IAUUpdateKind } = require('sp-react-native-in-app-updates') as InAppUpdatesModule;
    const updater = new InAppUpdates(false);
    const result = await updater.checkNeedsUpdate({});
    if (result.shouldUpdate) {
      await updater.startUpdate({ updateType: IAUUpdateKind.IMMEDIATE });
    }
  } catch {
    // Native module unavailable in Expo Go / sideloaded builds — skip silently.
  }
}

async function checkIosUpdate(): Promise<void> {
  if (IOS_APP_STORE_ID === '') return;
  try {
    const current = Application.nativeApplicationVersion;
    if (current === null) return;
    const result = await fetchAppStoreVersion(IOS_BUNDLE_ID);
    if (result === null || !isNewerVersion(result.version, current)) return;
    Alert.alert(
      'Update Available',
      `Version ${result.version} is now available. Update for the latest features and improvements.`,
      [
        { text: 'Later', style: 'cancel' },
        {
          text: 'Update Now',
          onPress: () => {
            Linking.openURL(
              `https://apps.apple.com/app/id${IOS_APP_STORE_ID}`,
            ).catch(() => {});
          },
        },
      ],
    );
  } catch {
    // iTunes API unreachable — skip silently.
  }
}

export function useAppUpdate(): void {
  useEffect(() => {
    if (Platform.OS === 'android') {
      void checkAndroidUpdate();
    } else if (Platform.OS === 'ios') {
      void checkIosUpdate();
    }
  }, []);
}
