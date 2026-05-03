import { CONFIG } from 'src/config-global';

import { UserDetailView } from 'src/sections/users/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`User Detail - ${CONFIG.appName}`}</title>
      <UserDetailView />
    </>
  );
}
