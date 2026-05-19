import { useMemo, useState, useContext, useCallback, createContext } from 'react';

// ----------------------------------------------------------------------

export type WorkspaceId = 'moi-order-main' | 'moi-order-trusted-brothers';

type WorkspaceContextValue = {
  activeWorkspace: WorkspaceId;
  setActiveWorkspace: (id: WorkspaceId) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue>({
  activeWorkspace: 'moi-order-main',
  setActiveWorkspace: () => {},
});

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  // Derive initial workspace from the URL so a hard refresh on /tb/* restores correctly
  const [activeWorkspace, setWorkspaceState] = useState<WorkspaceId>(() =>
    window.location.pathname.startsWith('/tb')
      ? 'moi-order-trusted-brothers'
      : 'moi-order-main'
  );

  const setActiveWorkspace = useCallback((id: WorkspaceId) => {
    setWorkspaceState(id);
  }, []);

  const value = useMemo(
    () => ({ activeWorkspace, setActiveWorkspace }),
    [activeWorkspace, setActiveWorkspace]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  return useContext(WorkspaceContext);
}
