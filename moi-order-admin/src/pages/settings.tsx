import { CONFIG } from 'src/config-global';

import { SettingsView } from 'src/sections/account/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Settings - ${CONFIG.appName}`}</title>
      <SettingsView />
    </>
  );
}
