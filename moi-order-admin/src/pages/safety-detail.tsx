import { CONFIG } from 'src/config-global';

import { SafetyDetailView } from 'src/sections/safety/view';

export default function Page() {
  return (
    <>
      <title>{`Safety Detail - ${CONFIG.appName}`}</title>
      <SafetyDetailView />
    </>
  );
}
