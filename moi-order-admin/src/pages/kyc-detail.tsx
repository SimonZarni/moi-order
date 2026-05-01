import { CONFIG } from 'src/config-global';

import { KycDetailView } from 'src/sections/merchants/view';

// ----------------------------------------------------------------------

export default function KycDetailPage() {
  return (
    <>
      <title>{`KYC Review - ${CONFIG.appName}`}</title>
      <KycDetailView />
    </>
  );
}
