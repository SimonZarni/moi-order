import { CONFIG } from 'src/config-global';

import { RestaurantDetailView } from 'src/sections/restaurants/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Restaurant - ${CONFIG.appName}`}</title>
      <RestaurantDetailView />
    </>
  );
}
