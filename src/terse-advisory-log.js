import { createHash } from "node:crypto";

/**
 *
 * @param {import("../types/compact-yarn-audit").ITerseEntry} pObject
 * @returns {string}
 */
function hash(pObject) {
  return createHash("md5").update(JSON.stringify(pObject)).digest("base64");
}

/**
 *
 * @param {any} pLogEntry entry as emitted by yarn audit
 * @returns {import("../types/compact-yarn-audit").ITerseEntry}
 */
function extractUsefulAttributes(pLogEntry) {
  const lFixable = pLogEntry.data.advisory.patched_versions !== "<0.0.0";
  const lVia = pLogEntry.data.resolution.path.split(">").shift();

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
/**
 *
 * @param {import("../types/compact-yarn-audit").SeverityType} pSeverity
 * @returns {number}
 */
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

/**
 *
 * @param {import("../types/compact-yarn-audit").ITerseEntry} pEntry
 * @returns {string}
 */
function getKey(pEntry) {
  return `${severity2Order(pEntry.severity)}|${pEntry.module_name}`;
}

/**
 *
 * @param {import("../types/compact-yarn-audit").ITerseEntry} pEntryLeft
 * @param {import("../types/compact-yarn-audit").ITerseEntry} pEntryRight
 * @returns {number}
 */
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

      // Some audit logs are several gigabytes long. Given that there'll
      // be quite some duplicates, the overhead of the hash will be negligable
      // compared to the amount of memory that'd normally be needed
      this.log.set(hash(lUsefulAttributes), lUsefulAttributes);
    }
  }

  /**
   *
   * @returns {import("../types/compact-yarn-audit").ITerseEntry[]}
   */
  get() {
    return [...this.log.values()].sort(orderEntry);
  }
}
