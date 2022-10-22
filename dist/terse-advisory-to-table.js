import textTable from "text-table";
import chalk from "chalk";
import stripAnsi from "strip-ansi";
function colorSeverity(pSeverity) {
    const lSeverity2ChalkFunction = new Map([
        ["critical", chalk.red],
        ["high", chalk.magenta],
        ["moderate", chalk.yellow],
        ["info", chalk.blue],
    ]);
    const lFunction = lSeverity2ChalkFunction.get(pSeverity) || ((pX) => pX);
    return lFunction(pSeverity);
}
function tableTheThing(pMaxTitleWidth) {
    return (pAll, pExtractedLogEntry) => {
        pAll.push([
            colorSeverity(pExtractedLogEntry.severity),
            pExtractedLogEntry.title.slice(0, Math.max(0, pMaxTitleWidth)),
            pExtractedLogEntry.module_name,
            pExtractedLogEntry.via,
            pExtractedLogEntry.fixString,
        ]);
        return pAll;
    };
}
export function terseAdvisoryLog2Table(pTerseEntries, pColumnsAvailable = process.stdout.columns) {
    const lTable = [
        ["severity", "title", "module", "via", '"resolutions" string'].map((pHeader) => chalk.bold(pHeader)),
    ];
    const lTableOptions = {
        align: ["l", "l", "l", "l", "l", "l"],
        stringLength: (pString) => stripAnsi(pString).length,
    };
    const lTitleMagicDivisionFactor = 5;
    const lMaxTitleWidth = Math.round(pColumnsAvailable / lTitleMagicDivisionFactor);
    return textTable(pTerseEntries.reduce(tableTheThing(lMaxTitleWidth), lTable), lTableOptions);
}
