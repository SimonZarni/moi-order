import { CONFIG } from 'src/config-global';

import { PlaceEditView } from 'src/sections/places/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Edit Place - ${CONFIG.appName}`}</title>
      <PlaceEditView />
    </>
  );
}
