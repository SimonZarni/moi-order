import { CONFIG } from 'src/config-global';

import { ServicesView } from 'src/sections/services/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Services - ${CONFIG.appName}`}</title>
      <ServicesView />
    </>
  );
}
