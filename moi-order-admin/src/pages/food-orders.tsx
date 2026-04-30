import { CONFIG } from 'src/config-global';

import { FoodOrdersView } from 'src/sections/food-orders/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Food Orders - ${CONFIG.appName}`}</title>
      <FoodOrdersView />
    </>
  );
}
