function auditLog2Object(pAuditLog) {
  return JSON.parse(`[${pAuditLog.split("\n").join(",")}]`.replace(",]", "]"));
}

function extractUsefulAttributesFromLogEntry(pLogEntry) {
  const lFixable = pLogEntry.data.advisory.patched_versions !== "<0.0.0";
  const lVia = pLogEntry.data.resolution.path.split(">").shift();

  return {
    severity: pLogEntry.data.advisory.severity,
    title: pLogEntry.data.advisory.title,
    cves: pLogEntry.data.advisory.cves.join(", "),
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

function sortEntry(pEntryLeft, pEntryRight) {
  return `${severity2Order(pEntryLeft.severity)}|${pEntryLeft.module_name}` >
    `${severity2Order(pEntryRight.severity)}|${pEntryRight.module_name}`
    ? 1
    : -1;
}
export function terseLog(pLog) {
  return auditLog2Object(pLog)
    .filter((pLogEntry) => pLogEntry.type === "auditAdvisory")
    .map(extractUsefulAttributesFromLogEntry)
    .sort(sortEntry);
}
