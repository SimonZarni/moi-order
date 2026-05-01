import { CONFIG } from 'src/config-global';

import { KycApplicationsView } from 'src/sections/merchants/view';

// ----------------------------------------------------------------------

export default function MerchantsPage() {
  return (
    <>
      <title>{`Merchant Applications - ${CONFIG.appName}`}</title>
      <KycApplicationsView />
    </>
  );
}
