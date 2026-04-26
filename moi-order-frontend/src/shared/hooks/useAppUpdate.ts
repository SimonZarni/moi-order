import { useEffect } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import * as Application from 'expo-application';
import InAppUpdates, { IAUUpdateKind } from 'sp-react-native-in-app-updates';

import { fetchAppStoreVersion } from '@/shared/api/appUpdate';
import { IOS_BUNDLE_ID, IOS_APP_STORE_ID } from '@/shared/constants/config';

const inAppUpdates = new InAppUpdates(false);

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
    const result = await inAppUpdates.checkNeedsUpdate({});
    if (result.shouldUpdate) {
      await inAppUpdates.startUpdate({ updateType: IAUUpdateKind.IMMEDIATE });
    }
  } catch {
    // Play Store unavailable in dev/sideloaded builds — skip silently.
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
