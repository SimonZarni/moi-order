import { CONFIG } from 'src/config-global';

import { FoodOrderReviewsView } from 'src/sections/food-orders/view/food-order-reviews-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Customer Reviews - ${CONFIG.appName}`}</title>
      <FoodOrderReviewsView />
    </>
  );
}
