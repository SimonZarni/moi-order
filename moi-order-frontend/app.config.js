const mapboxDownloadToken = process.env.RNMAPBOX_MAPS_DOWNLOAD_TOKEN;

/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  expo: {
    name: 'moi-order-frontend',
    slug: 'moi-order-frontend',
    owner: 'simonzarni',
    scheme: 'moiorder',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    runtimeVersion: {
      policy: 'appVersion',
    },
    updates: {
      enabled: true,
      fallbackToCacheTimeout: 0,
      url: 'https://u.expo.dev/299e73b6-58b0-43d0-9a56-c7a212af98e5',
    },
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      infoPlist: {
        UIViewControllerBasedStatusBarAppearance: false,
        NSLocationWhenInUseUsageDescription: 'Used to show nearby places on the map.',
        NSLocationAlwaysAndWhenInUseUsageDescription: 'Used to show nearby places on the map.',
        "ITSAppUsesNonExemptEncryption": false,
      },
      bundleIdentifier: 'com.moiorder.app',
      appleTeamId: '3TULJRMNLT',
      usesAppleSignIn: true,
    },
    android: {
      package: 'com.moiorder.app',
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      predictiveBackGestureEnabled: false,
      permissions: [
        'android.permission.RECORD_AUDIO',
        'android.permission.ACCESS_COARSE_LOCATION',
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
        'android.permission.READ_MEDIA_VISUAL_USER_SELECTED',
        'android.permission.READ_MEDIA_IMAGES',
        'android.permission.READ_MEDIA_VIDEO',
        'android.permission.READ_MEDIA_AUDIO',
      ],
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      "expo-apple-authentication",
      'expo-updates',
      'expo-secure-store',
      [
        'expo-notifications',
        {
          icon: './assets/notification-icon.png',
          color: '#1a1a2e',
        },
      ],
      [
        '@react-native-google-signin/google-signin',
        {
          iosUrlScheme: 'com.googleusercontent.apps.661538209777-o33avjo80379ui26kj2clbn4snla6j2g',
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission: 'Allow $(PRODUCT_NAME) to access your photos for document uploads.',
        },
      ],
      [
        'expo-location',
        {
          locationWhenInUsePermission: 'Allow $(PRODUCT_NAME) to show distances to nearby places.',
        },
      ],
      '@react-native-community/datetimepicker',
      [
        '@rnmapbox/maps',
        ...(mapboxDownloadToken
          ? [{ RNMAPBOX_MAPS_DOWNLOAD_TOKEN: mapboxDownloadToken }]
          : []),
      ],
      [
        'expo-media-library',
        {
          photosPermission: 'Allow $(PRODUCT_NAME) to save QR codes to your gallery.',
          savePhotosPermission: 'Allow $(PRODUCT_NAME) to save QR codes to your gallery.',
          isAccessMediaLocationEnabled: false,
        },
      ],
    ],
    extra: {
      eas: {
        projectId: '299e73b6-58b0-43d0-9a56-c7a212af98e5',
      },
    },
  },
};
