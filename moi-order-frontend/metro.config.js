const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// pusher-js's React Native build imports @react-native-community/netinfo to
// detect offline/online state. That package is not available in Expo Go.
// We mock it here — pusher-js won't get network events from it, but our
// AppState listener in usePusherNotifications handles reconnection instead.
config.resolver.extraNodeModules = {
  '@react-native-community/netinfo': require.resolve('./netinfo-mock.js'),
};

module.exports = config;
