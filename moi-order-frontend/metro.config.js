const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// pusher-js's React Native build imports @react-native-community/netinfo to
// detect offline/online state. That package is not available in Expo Go.
// We mock it here — pusher-js won't get network events from it, but our
// AppState listener in usePusherNotifications handles reconnection instead.
config.resolver.extraNodeModules = {
  '@react-native-community/netinfo': require.resolve('./netinfo-mock.js'),
};

// Native-only packages that have no web build — stub them out on web.
const WEB_STUBS = {
  'sp-react-native-in-app-updates': './in-app-updates-stub.js',
  'react-native-image-viewing':     './image-viewing-stub.js',
  '@rnmapbox/maps':                 './rnmapbox-stub.js',
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && WEB_STUBS[moduleName]) {
    return { filePath: require.resolve(WEB_STUBS[moduleName]), type: 'sourceFile' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
