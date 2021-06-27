import uniqBy from "lodash.uniqby";

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

function wholeRecordAsString(pLogEntry) {
  return `${pLogEntry.severity}|${pLogEntry.title}|${pLogEntry.fixString}|${pLogEntry.module_name}|${pLogEntry.via}`;
}

export function sortLog(pLog) {
  return uniqBy(pLog.sort(sortEntry), wholeRecordAsString);
}

export function extractUsefulAttributes(pLogEntry) {
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
