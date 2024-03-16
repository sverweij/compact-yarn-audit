import type { ITerseEntry, SeverityType } from "./types.js";

interface INdJsonEntry {
  [key: string]: unknown;
}

interface IAuditAdvisoryResolution {
  id: number;
  path: string;
  dev: boolean;
  optional: boolean;
  bundled: boolean;
}

interface IFinding {
  version: string;
  paths: string[];
}

interface IAuditAdvisory {
  id: number;
  findings: IFinding[];
  created: string;
  updated: string;
  deleted?: string;
  title: string;
  // found_by
  // reported_by
  module_name: string;
  cves: string[];
  vulnerable_versions: string;
  patched_versions: string;
  overview: string;
  recommendation: string;
  references: string;
  access: string;
  severity: string;
  cwe: string;
  metadata: {
    module_type: string;
    exploitability: number;
    affected_components: string;
  };
  url: string;
}

interface IAuditAdvisoryData {
  resolution: IAuditAdvisoryResolution;
  advisory: IAuditAdvisory;
}

interface IAuditAdvisoryEntry {
  type: "auditAdvisory";
  data: IAuditAdvisoryData;
}

function extractUsefulAttributes(pLogEntry: IAuditAdvisoryEntry): ITerseEntry {
  const lFixable = pLogEntry.data.advisory.patched_versions !== "<0.0.0";
  const lVia = pLogEntry.data.resolution.path.split(">").shift() ?? "?";

  return {
    severity: pLogEntry.data.advisory.severity as SeverityType,
    title: pLogEntry.data.advisory.title,
    fixable: lFixable,
    fixString: lFixable
      ? `"${pLogEntry.data.advisory.module_name}": "${pLogEntry.data.advisory.patched_versions}"`
      : "no fix available",
    module_name: pLogEntry.data.advisory.module_name,
    via: lVia === pLogEntry.data.advisory.module_name ? "." : lVia,
  };
}

function severity2Order(pSeverity: SeverityType): number {
  const lSeverity2Order = {
    critical: 1,
    high: 2,
    moderate: 3,
    low: 4,
    info: 5,
  };
  // eslint-disable-next-line security/detect-object-injection
  return lSeverity2Order[pSeverity] || -1;
}

function getKey(pEntry: ITerseEntry): string {
  return `${severity2Order(pEntry.severity)}|${pEntry.module_name}`;
}

function orderEntry(pEntryLeft: ITerseEntry, pEntryRight: ITerseEntry): 1 | -1 {
  return getKey(pEntryLeft) > getKey(pEntryRight) ? 1 : -1;
}

export class TerseAdvisoryLog {
  log = new Set();

  constructor() {
    this.log = new Set();
  }

  add(pEntry: INdJsonEntry) {
    if (pEntry.type === "auditAdvisory") {
      const lUsefulAttributes: ITerseEntry = extractUsefulAttributes(
        pEntry as unknown as IAuditAdvisoryEntry,
      );

      // Some audit logs are several gigabytes long. Given that there'll
      // be quite some duplicates a Set is used to avoid duplicates and
      // to keep the log small enough to fit in memory.
      this.log.add(JSON.stringify(lUsefulAttributes));
    }
  }

  get(): ITerseEntry[] {
    return Array.from(this.log)
      .map(
        (pStringifiedEntry) =>
          JSON.parse(pStringifiedEntry as string) as ITerseEntry,
      )
      .sort(orderEntry);
  }
}
