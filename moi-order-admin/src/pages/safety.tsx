import { CONFIG } from 'src/config-global';

import { SafetyView } from 'src/sections/safety/view';

export default function Page() {
  return (
    <>
      <title>{`Safety - ${CONFIG.appName}`}</title>
      <SafetyView />
    </>
  );
}
