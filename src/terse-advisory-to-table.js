import textTable from "text-table";
import chalk from "chalk";
import stripAnsi from "strip-ansi";

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

function tableTheThing(pAll, pExtractedLogEntry) {
  pAll.push([
    colorSeverity(pExtractedLogEntry.severity),
    pExtractedLogEntry.title.substr(0, 25),
    pExtractedLogEntry.module_name,
    pExtractedLogEntry.via,
    pExtractedLogEntry.fixString,
  ]);
  return pAll;
}

export function TerseAdvisoryLog2Table(pTerseAdvisoryLog) {
  const lTable = [
    ["severity", "title", "module", "via", '"resolutions" string'].map(
      (pHeader) => chalk.bold(pHeader)
    ),
  ];
  const lTableOpts = {
    align: ["l", "l", "l", "l", "l", "l"],
    stringLength: (pString) => stripAnsi(pString).length,
  };
  return textTable(pTerseAdvisoryLog.reduce(tableTheThing, lTable), lTableOpts);
}
