import { CONFIG } from 'src/config-global';

import { SubmissionsView } from 'src/sections/submissions/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Submissions - ${CONFIG.appName}`}</title>
      <SubmissionsView />
    </>
  );
}
