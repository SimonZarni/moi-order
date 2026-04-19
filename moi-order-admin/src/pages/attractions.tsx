import { CONFIG } from 'src/config-global';

import { AttractionsView } from 'src/sections/attractions/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Attractions - ${CONFIG.appName}`}</title>
      <AttractionsView />
    </>
  );
}
