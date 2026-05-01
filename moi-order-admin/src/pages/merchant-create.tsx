import { CONFIG } from 'src/config-global';

import { CreateMerchantView } from 'src/sections/merchants/view';

// ----------------------------------------------------------------------

export default function MerchantCreatePage() {
  return (
    <>
      <title>{`Create Merchant - ${CONFIG.appName}`}</title>
      <CreateMerchantView />
    </>
  );
}
