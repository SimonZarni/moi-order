import { CONFIG } from 'src/config-global';

import { SubmissionDetailView } from 'src/sections/submissions/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Submission Detail - ${CONFIG.appName}`}</title>
      <SubmissionDetailView />
    </>
  );
}
