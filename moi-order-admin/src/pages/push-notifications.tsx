import { CONFIG } from 'src/config-global';

import { PushNotificationsView } from 'src/sections/push-notifications/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Push Notifications - ${CONFIG.appName}`}</title>
      <PushNotificationsView />
    </>
  );
}
