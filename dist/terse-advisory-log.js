import { createHash } from "node:crypto";
function hash(pEntry) {
  return createHash("md5").update(JSON.stringify(pEntry)).digest("base64");
}
function extractUsefulAttributes(pLogEntry) {
  const lFixable = pLogEntry.data.advisory.patched_versions !== "<0.0.0";
  const lVia = pLogEntry.data.resolution.path.split(">").shift() ?? "?";
  return {
    severity: pLogEntry.data.advisory.severity,
    title: pLogEntry.data.advisory.title,
    fixable: lFixable,
    fixString: lFixable
      ? `"${pLogEntry.data.advisory.module_name}": "${pLogEntry.data.advisory.patched_versions}"`
      : "no fix available",
    module_name: pLogEntry.data.advisory.module_name,
    via: lVia === pLogEntry.data.advisory.module_name ? "." : lVia,
  };
}
function severity2Order(pSeverity) {
  const lSeverity2Order = {
    critical: 1,
    high: 2,
    moderate: 3,
    low: 4,
    info: 5,
  };
  return lSeverity2Order[pSeverity] || -1;
}
function getKey(pEntry) {
  return `${severity2Order(pEntry.severity)}|${pEntry.module_name}`;
}
function orderEntry(pEntryLeft, pEntryRight) {
  return getKey(pEntryLeft) > getKey(pEntryRight) ? 1 : -1;
}
export class TerseAdvisoryLog {
  log = new Map();
  constructor() {
    this.log = new Map();
  }
  add(pEntry) {
    if (pEntry.type === "auditAdvisory") {
      const lUsefulAttributes = extractUsefulAttributes(pEntry);
      this.log.set(hash(lUsefulAttributes), lUsefulAttributes);
    }
  }
  get() {
    return [...this.log.values()].sort(orderEntry);
  }
}
