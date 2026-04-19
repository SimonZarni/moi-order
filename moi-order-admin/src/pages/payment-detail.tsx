import { CONFIG } from 'src/config-global';

import { PaymentDetailView } from 'src/sections/payments/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Payment Detail - ${CONFIG.appName}`}</title>
      <PaymentDetailView />
    </>
  );
}
