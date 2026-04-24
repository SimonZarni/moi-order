// Stub for @react-native-community/netinfo used by pusher-js's React Native build.
// Reconnection on network change is handled via AppState in usePusherNotifications.
module.exports = {
  addEventListener: () => () => {},
  fetch: () => Promise.resolve({ isConnected: true, isInternetReachable: true }),
  useNetInfo: () => ({ isConnected: true, isInternetReachable: true }),
  NetInfoStateType: {},
};
