import { CONFIG } from 'src/config-global';

import { PlaceCreateView } from 'src/sections/places/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`New Place - ${CONFIG.appName}`}</title>
      <PlaceCreateView />
    </>
  );
}
