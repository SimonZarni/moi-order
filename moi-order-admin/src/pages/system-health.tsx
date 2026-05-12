import { CONFIG } from 'src/config-global';

import { SystemHealthView } from 'src/sections/system-health/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`System Health - ${CONFIG.appName}`}</title>
      <SystemHealthView />
    </>
  );
}
