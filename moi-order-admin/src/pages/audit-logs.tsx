import { CONFIG } from 'src/config-global';

import { AuditLogsView } from 'src/sections/audit-logs/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Audit Log - ${CONFIG.appName}`}</title>
      <AuditLogsView />
    </>
  );
}
