import { CONFIG } from 'src/config-global';

import { AttractionCreateView } from 'src/sections/attractions/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`New Attraction - ${CONFIG.appName}`}</title>
      <AttractionCreateView />
    </>
  );
}
