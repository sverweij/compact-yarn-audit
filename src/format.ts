import { EOL } from "node:os";
import { ITerseEntry } from "types/compact-yarn-audit";
import { terseAdvisoryLog2Table } from "./terse-advisory-to-table.js";

export default function format(pTerseEntries: ITerseEntry[]): string {
  if (pTerseEntries.length > 0) {
    return terseAdvisoryLog2Table(pTerseEntries);
  } else {
    return `${EOL} no vulnerabilities found ${EOL}`;
  }
}
