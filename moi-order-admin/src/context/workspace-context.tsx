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
  const [activeWorkspace, setWorkspaceState] = useState<WorkspaceId>('moi-order-main');

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
