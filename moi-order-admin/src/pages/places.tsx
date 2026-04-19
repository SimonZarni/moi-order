import { CONFIG } from 'src/config-global';

import { PlacesView } from 'src/sections/places/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Places - ${CONFIG.appName}`}</title>
      <PlacesView />
    </>
  );
}
