import { CONFIG } from 'src/config-global';

import { FoodOrderDetailView } from 'src/sections/food-orders/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Food Order - ${CONFIG.appName}`}</title>
      <FoodOrderDetailView />
    </>
  );
}
