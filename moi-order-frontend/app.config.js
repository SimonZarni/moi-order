const { withAppBuildGradle, withGradleProperties } = require('@expo/config-plugins');

const mapboxDownloadToken = process.env.RNMAPBOX_MAPS_DOWNLOAD_TOKEN;
const lineChannelId = process.env.EXPO_PUBLIC_LINE_CHANNEL_ID ?? '';
const googleIosClientId =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ??
  '661538209777-o33avjo80379ui26kj2clbn4snla6j2g.apps.googleusercontent.com';
const googleIosUrlScheme = `com.googleusercontent.apps.${googleIosClientId.replace('.apps.googleusercontent.com', '')}`;

// Injects ABI splits into the prebuild-generated build.gradle so EAS produces
// per-ABI APKs instead of a single universal APK containing all architectures.
const ABI_SPLITS = [
  '    splits {',
  '        abi {',
  '            reset()',
  '            enable true',
  '            universalApk false',
  '            include "arm64-v8a", "armeabi-v7a"',
  '        }',
  '    }',
].join('\n');

const withAbiSplits = (config) => {
  config = withAppBuildGradle(config, (mod) => {
    if (mod.modResults.contents.includes('splits {')) return mod;
    mod.modResults.contents = mod.modResults.contents.replace(
      /([ \t]+androidResources \{[^}]*\})\n\}/,
      `$1\n${ABI_SPLITS}\n}`
    );
    return mod;
  });

  config = withGradleProperties(config, (mod) => {
    mod.modResults = mod.modResults.filter(
      (item) => !(item.type === 'property' && item.key === 'reactNativeArchitectures')
    );
    mod.modResults.push({
      type: 'property',
      key: 'reactNativeArchitectures',
      value: 'armeabi-v7a,arm64-v8a',
    });
    return mod;
  });

  return config;
};

/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  expo: {
    name: "Moi Order",
    slug: "moi-order-frontend",
    owner: "simonzarni",
    scheme: "moiorder",
    version: "2.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    runtimeVersion: {
      policy: "appVersion",
    },
    updates: {
      enabled: true,
      checkOnLaunch: "ALWAYS",
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/299e73b6-58b0-43d0-9a56-c7a212af98e5",
    },
    assetBundlePatterns: ["assets/**/*"],
    ios: {
      supportsTablet: true,
      infoPlist: {
        UIViewControllerBasedStatusBarAppearance: false,
        NSLocationWhenInUseUsageDescription:
          "Moi Order uses your location to show nearby restaurants, bus ticket counters, and places on the map.",
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "Moi Order uses your location to show nearby restaurants, bus ticket counters, and places on the map.",
        NSPhotoLibraryUsageDescription:
          "Moi Order needs access to your photo library to upload your profile picture and company registration documents.",
        NSPhotoLibraryAddUsageDescription:
          "Moi Order saves your ticket QR codes and payment receipts to your photo library.",
        NSCameraUsageDescription:
          "Moi Order uses your camera to photograph documents for company registration.",
        NSUserNotificationsUsageDescription:
          "Moi Order sends you order updates, delivery alerts, and important account notifications.",
        ITSAppUsesNonExemptEncryption: false,
        LSApplicationQueriesSchemes: ["lineauth2"],
      },
      bundleIdentifier: "com.moiorder.app",
      appleTeamId: "3TULJRMNLT",
      usesAppleSignIn: true,
      buildNumber: "2",
    },
    android: {
      package: "com.moiorder.customer",
      versionCode: 2,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#063B21",
      },
      predictiveBackGestureEnabled: false,
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.READ_MEDIA_VISUAL_USER_SELECTED",
        "android.permission.READ_MEDIA_IMAGES",
        "android.permission.READ_MEDIA_VIDEO",
        "android.permission.READ_MEDIA_AUDIO",
      ],
    },
    web: {
      favicon: "./assets/icon.png",
    },
    plugins: [
      withAbiSplits,
      [
        "expo-splash-screen",
        {
          backgroundColor: "#063B21",
          image: "./assets/splash-icon.png",
          resizeMode: "contain",
          // iOS: keep the original 200dp default — native splash is seamlessly covered by AnimatedSplash
          // Android: 400dp forces the logo to fill the full screen width (matching AnimatedSplash's LOGO_SIZE = SCREEN_W)
          android: {
            imageWidth: 400,
          },
          dark: {
            backgroundColor: "#063B21",
          },
        },
      ],
      "expo-apple-authentication",
      "expo-updates",
      "expo-secure-store",
      [
        "expo-notifications",
        {
          icon: "./assets/icon.png",
          color: "#1a1a2e",
        },
      ],
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
          },
        },
      ],
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: googleIosUrlScheme,
        },
      ],
      [
        "@xmartlabs/react-native-line",
        {
          channelId: lineChannelId,
        },
      ],

      [
        "expo-image-picker",
        {
          photosPermission:
            "Allow $(PRODUCT_NAME) to access your photos for document uploads.",
        },
      ],
      [
        "expo-location",
        {
          locationWhenInUsePermission:
            "Allow $(PRODUCT_NAME) to show distances to nearby places.",
        },
      ],
      "@react-native-community/datetimepicker",
      [
        "@rnmapbox/maps",
        ...(mapboxDownloadToken
          ? [{ RNMAPBOX_MAPS_DOWNLOAD_TOKEN: mapboxDownloadToken }]
          : []),
      ],
      [
        "expo-media-library",
        {
          photosPermission:
            "Allow $(PRODUCT_NAME) to save QR codes to your gallery.",
          savePhotosPermission:
            "Allow $(PRODUCT_NAME) to save QR codes to your gallery.",
          isAccessMediaLocationEnabled: false,
        },
      ],
    ],
    extra: {
      lineChannelId,
      eas: {
        projectId: "299e73b6-58b0-43d0-9a56-c7a212af98e5",
      },
    },
  },
};
