import { CONFIG } from 'src/config-global';

import { RestaurantCreateView } from 'src/sections/restaurants/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`New Restaurant - ${CONFIG.appName}`}</title>
      <RestaurantCreateView />
    </>
  );
}
