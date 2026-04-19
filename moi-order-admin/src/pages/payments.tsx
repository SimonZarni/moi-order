import { CONFIG } from 'src/config-global';

import { PaymentsView } from 'src/sections/payments/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Payments - ${CONFIG.appName}`}</title>
      <PaymentsView />
    </>
  );
}
