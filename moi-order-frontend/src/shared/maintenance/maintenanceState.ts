let maintenanceEpoch = 0;
let isRecoveringFromMaintenance = false;

export function getMaintenanceEpoch(): number {
  return maintenanceEpoch;
}

export function beginMaintenanceRecovery(): number {
  maintenanceEpoch += 1;
  isRecoveringFromMaintenance = true;
  return maintenanceEpoch;
}

export function endMaintenanceRecovery(epoch?: number): void {
  if (epoch !== undefined && epoch !== maintenanceEpoch) return;
  isRecoveringFromMaintenance = false;
}

export function isMaintenanceRecoveryActive(): boolean {
  return isRecoveringFromMaintenance;
}

export function shouldIgnoreMaintenanceNavigation(requestEpoch?: number): boolean {
  if (isRecoveringFromMaintenance) return true;
  if (requestEpoch !== undefined && requestEpoch !== maintenanceEpoch) return true;
  return false;
}
