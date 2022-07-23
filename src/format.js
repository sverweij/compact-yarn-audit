import { terseAdvisoryLog2Table } from "./terse-advisory-to-table.js";
import { EOL } from "node:os";

/**
 *
 * @param {import("../types/compact-yarn-audit.js").ITerseEntry[]} x
 * @return {string}
 */
export default function format(pTerseEntries) {
  if (pTerseEntries.length > 0) {
    return terseAdvisoryLog2Table(pTerseEntries);
  } else {
    return `${EOL} no vulnerabilities found ${EOL}`;
  }
}
