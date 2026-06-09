const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// pusher-js's React Native build imports @react-native-community/netinfo to
// detect offline/online state. That package is not available in Expo Go.
// We mock it here — pusher-js won't get network events from it, but our
// AppState listener in usePusherNotifications handles reconnection instead.
config.resolver.extraNodeModules = {
  '@react-native-community/netinfo': require.resolve('./netinfo-mock.js'),
};

// sp-react-native-in-app-updates has no web build — swap it for a no-op stub on web.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'sp-react-native-in-app-updates') {
    return { filePath: require.resolve('./in-app-updates-stub.js'), type: 'sourceFile' };
  }
  if (platform === 'web' && moduleName === 'react-native-image-viewing') {
    return { filePath: require.resolve('./image-viewing-stub.js'), type: 'sourceFile' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
