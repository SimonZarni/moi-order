import { CONFIG } from 'src/config-global';

import { RestaurantsView } from 'src/sections/restaurants/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Restaurants - ${CONFIG.appName}`}</title>
      <RestaurantsView />
    </>
  );
}
