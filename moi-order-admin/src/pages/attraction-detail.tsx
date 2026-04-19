import { CONFIG } from 'src/config-global';

import { AttractionDetailView } from 'src/sections/attractions/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Attraction Detail - ${CONFIG.appName}`}</title>
      <AttractionDetailView />
    </>
  );
}
