// Web stub — in-app updates are not supported on web.
function InAppUpdates() {}
InAppUpdates.prototype.checkNeedsUpdate = async () => ({ shouldUpdate: false });
InAppUpdates.prototype.startUpdate = async () => {};
module.exports = { default: InAppUpdates, IAUUpdateKind: { IMMEDIATE: 1 } };
