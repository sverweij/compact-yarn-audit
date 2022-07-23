import textTable from "text-table";
import chalk from "chalk";
import stripAnsi from "strip-ansi";

/**
 *
 * @param {import("../types/compact-yarn-audit").SeverityType} pSeverity
 * @returns {import("chalk").ChalkInstance}
 */
function colorSeverity(pSeverity) {
  const lSeverity2ChalkFunction = {
    critical: chalk.red,
    high: chalk.magenta,
    moderate: chalk.yellow,
    info: chalk.blue,
  };
  const lFunction = lSeverity2ChalkFunction[pSeverity] || ((x) => x);
  return lFunction(pSeverity);
}
/**
 *
 * @param {number} pMaxTitleWidth
 * @returns {(string[][], import("../types/compact-yarn-audit").ITerseEntry) => string[][]})}
 */
function tableTheThing(pMaxTitleWidth) {
  return (pAll, pExtractedLogEntry) => {
    pAll.push([
      colorSeverity(pExtractedLogEntry.severity),
      pExtractedLogEntry.title.substring(0, pMaxTitleWidth),
      pExtractedLogEntry.module_name,
      pExtractedLogEntry.via,
      pExtractedLogEntry.fixString,
    ]);
    return pAll;
  };
}

/**
 *
 * @param {import("../types/compact-yarn-audit").ITerseEntry[]} pTerseEntries
 * @returns {string}
 */
export function terseAdvisoryLog2Table(
  pTerseEntries,
  pColumnsAvailable = process.stdout.columns
) {
  const lTable = [
    ["severity", "title", "module", "via", '"resolutions" string'].map(
      (pHeader) => chalk.bold(pHeader)
    ),
  ];
  const lTableOpts = {
    align: ["l", "l", "l", "l", "l", "l"],
    stringLength: (pString) => stripAnsi(pString).length,
  };
  const lMaxTitleWidth = Math.round(pColumnsAvailable / 5);

  return textTable(
    pTerseEntries.reduce(tableTheThing(lMaxTitleWidth), lTable),
    lTableOpts
  );
}
