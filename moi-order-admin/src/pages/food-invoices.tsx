import { CONFIG } from 'src/config-global';

import { InvoicesView } from 'src/sections/invoices/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Daily Invoices - ${CONFIG.appName}`}</title>
      <InvoicesView />
    </>
  );
}
