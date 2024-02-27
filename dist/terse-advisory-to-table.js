import { EOL } from "node:os";
import chalk from "chalk";
function colorBySeverity(pSeverity, pString) {
    const lSeverity2ChalkFunction = new Map([
        ["critical", chalk.red],
        ["high", chalk.magenta],
        ["moderate", chalk.yellow],
        ["info", chalk.blue],
    ]);
    const lFunction = lSeverity2ChalkFunction.get(pSeverity) || ((pX) => pX);
    return lFunction(pString);
}
function getColumnWidth(pTerseEntries, pColumnName) {
    return pTerseEntries.reduce((pAll, pEntry) => Math.max(pAll, pEntry[pColumnName].length), 0);
}
function getColumnWidths(pTerseEntries, pWidthAvailable) {
    const lColumns = ["severity", "title", "module_name", "via", "fixString"];
    const lReturnValue = new Map(lColumns.map((pColumn) => {
        return [pColumn, getColumnWidth(pTerseEntries, pColumn)];
    }));
    const lAllColumnsLength = Array.from(lReturnValue.values()).reduce((pAll, pLength) => {
        return pAll + pLength;
    }, 0);
    const lMinimumTitleColumnWidth = 14;
    const lSpacesPerColumn = 2;
    const lAvailableForTitle = Math.min(lReturnValue.get("title"), Math.max(lMinimumTitleColumnWidth, pWidthAvailable -
        (lAllColumnsLength - lReturnValue.get("title")) -
        lSpacesPerColumn * lColumns.length));
    lReturnValue.set("title", lAvailableForTitle);
    return lReturnValue;
}
function truncateTitle(pTitle, pWidth) {
    let lReturnValue = pTitle.padEnd(pWidth).slice(0, pWidth);
    if (pTitle.length > pWidth) {
        lReturnValue = `${lReturnValue.slice(0, -1)}…`;
    }
    return lReturnValue;
}
export function terseAdvisoryLog2Table(pTerseEntries, pColumnsAvailable = process.stdout.columns) {
    const lColumnWidths = getColumnWidths(pTerseEntries, pColumnsAvailable);
    const lTitle = chalk.bold(`${"severity".padEnd(lColumnWidths.get("severity"))}  ` +
        `${"title".padEnd(lColumnWidths.get("title"))}  ` +
        `${"module".padEnd(lColumnWidths.get("module_name"))}  ` +
        `${"via".padEnd(lColumnWidths.get("via"))}  ` +
        `"resolutions" string`);
    const lCells = pTerseEntries
        .map((pEntry) => {
        return (`${colorBySeverity(pEntry.severity, `${pEntry.severity.padEnd(lColumnWidths.get("severity"))}  `)}` +
            `${truncateTitle(pEntry.title, lColumnWidths.get("title"))}  ` +
            `${pEntry.module_name.padEnd(lColumnWidths.get("module_name"))}  ` +
            `${pEntry.via.padEnd(lColumnWidths.get("via"))}  ` +
            `${pEntry.fixString}`);
    })
        .join(EOL);
    return lTitle + EOL + lCells;
}
